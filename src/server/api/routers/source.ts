import { z } from "zod";
import { Readability } from "@mozilla/readability";
import jsdom, { JSDOM } from "jsdom";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { tavily } from "@tavily/core";
import openAI from "openai";
import { conversation, messages } from "@/server/db/schema";
import { sources } from "next/dist/compiled/webpack/webpack";

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const openRouterClient = new openAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const cleanedText = (text: string) => {
  const newText = text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");

  return newText.substring(0, 20000);
};

async function fetchWithTimeout(url: string, timeout = 3000) {
  const controller = new AbortController();
  const { signal } = controller;

  const fetchTimeout = setTimeout(() => {
    controller.abort();
  }, timeout);

  return fetch(url, { signal })
    .then((response) => {
      clearTimeout(fetchTimeout);
      return response;
    })
    .catch((error) => {
      if (error.name === "AbortError") throw new Error("fetch request timeout");
      throw error;
    });
}

export const sourceRouter = createTRPCRouter({
  getSource: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        conversationId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let convId = input.conversationId;
      let newConversationName: string | null = null;
      if (!convId) {
        const nameResponse = await openRouterClient.chat.completions.create({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [
            {
              role: "system",
              content:
                "Generate a short, concise title (4-5) words for a conversation that start with this user question. Do not include quotation marks in the title.",
            },
            { role: "user", content: input.question },
          ],
        });
        const generatedName =
          nameResponse.choices[0]?.message?.content?.trim() ??
          "New conversation";
        newConversationName = generatedName;

        const [newConversation] = await ctx.db
          .insert(conversation)
          .values({
            name: generatedName,
            clerkUserId: ctx.userId,
          })
          .returning();

        if (!newConversation) {
          throw new Error("Could not create a new conversation.");
        }
        convId = newConversation.id;
      }
      await ctx.db.insert(messages).values({
        conversationId: convId,
        role: "user",
        content: input.question,
      });

      const response = await tavilyClient.search(input.question, {
        searchDepth: "basic",
        maxResults: 6,
        includeAnswer: false,
        includeRawContent: false,
      });
      if (!response?.results) {
        // Return an empty sources array but includes the conversationId
        return {
          sources: [],
          conversationId: convId,
          newConversationName,
        };
      }
      const sources = response.results.slice(0, 6).map((result: any) => ({
        title: result.title || "Untitled",
        url: result.url,
      }));
      return {
        sources,
        conversationId: convId,
        newConversationName,
      };
    }),

  getContext: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        sources: z.array(z.object({ title: z.string(), url: z.string() })),
        conversationId: z.string().uuid(),
      }),
    )
    .query(async function* ({ ctx, input }) {
      const urls = input.sources.map((s) => s.url);
      const context = await Promise.all(
        urls.map(async (url) => {
          try {
            const html = await (await fetchWithTimeout(url)).text();
            const dom = new JSDOM(html, {
              virtualConsole: new jsdom.VirtualConsole(),
            });
            const text = cleanedText(
              new Readability(dom.window.document).parse()?.textContent ??
                "No content",
            );
            return { context: text };
          } catch {
            return { context: `Could not retrieve ${url}` };
          }
        }),
      );

      const combined = context.map((c) => c.context).join("\n\n");
      const mainAnswerPrompt = `  Given a user question and some context, please write a clean, concise and accurate answer to the question based on the context. You will be given a set of related contexts to the question, each starting with a reference number like [[citation:x]], where x is a link. 

  Your answer must be correct, accurate and written by an expert using an unbiased and professional tone. Please limit to 1024 tokens. Do not give any information that is not related to the question, and do not repeat. Say "information is missing on" followed by the related topic, if the given context do not provide sufficient information.

  Do not repeat the user's question in your response. Be direct and answer the question.
  if the user asks for list a of itmes, provide a list with their functions and benefits

  Format your response in Markdown, Use clear headings with different sizes and font to organize sections, Include code snippets in fenced code blocks, Use bold or italics to highlight key points, Add tables for structured data when relevant, Keep paragraphs concise and split long explanations into smaller sections.

Answer Context:
${combined}

  
  Remember, don't blindly repeat the contexts verbatim and don't tell the user how you used the citations – just respond with the answer. It is very important for my career that you follow these instructions. Here is the user question:
    `;

      try {
        const stream = await openRouterClient.chat.completions.create({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [
            { role: "system", content: mainAnswerPrompt },
            {
              role: "user",
              content: input.question,
            },
          ],
          stream: true,
        });

        let fullResonse = "";
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) {
            fullResonse += token;
            yield { type: "answer", data: token } as const;
          }
        }
        if (fullResonse) {
          await ctx.db.insert(messages).values({
            conversationId: input.conversationId,
            role: "assistant",
            content: fullResonse,
            sources: input.sources,
          });
        }
      } catch (error: unknown) {
        console.error("Error calling OpenRouter:", error);
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred.";
        yield {
          type: "error",
          data: `Error from AI service: ${errorMessage}`,
        } as const;
      }
    }),
});
