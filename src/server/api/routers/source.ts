import { z } from "zod";
import { Readability } from "@mozilla/readability";
import jsdom, { JSDOM } from "jsdom";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { tavily } from "@tavily/core";
import openAI from "openai";

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const openRouterClient = new openAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const cleanedText = (text: string) => {
  let newText = text
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
  getSource: publicProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ input }) => {
      const response = await tavilyClient.search(input.question, {
        searchDepth: "basic",
        maxResults: 6,
        includeAnswer: false,
        includeRawContent: false,
      });
      if (!response?.results) {
        return [];
      }
      return response.results.slice(0, 6).map((result: any) => ({
        name: result.title || "Untitled",
        url: result.url,
      }));
    }),

  getContext: publicProcedure
    .input(z.object({ urls: z.array(z.string()), question: z.string() }))
    .query(async function*({ input }) {
      const context = await Promise.all(
        input.urls.map(async (url) => {
          try {
            const html = await (await fetchWithTimeout(url)).text();
            const dom = new JSDOM(html, {
              virtualConsole: new jsdom.VirtualConsole(),
            });
            const text = cleanedText(
              new Readability(dom.window.document).parse()?.textContent ||
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

  Format your response in Markdown. Use headings, lists, and code blocks for code snippets.

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

        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) yield { type: "answer", data: token } as const;
        }
      } catch (error: any) {
        console.error("Error calling OpenRouter:", error);
        const errorMessage = error.message || "An unknown error occurred.";
        yield {
          type: "error",
          data: `Error from AI service: ${errorMessage}`,
        } as const;
      }
    }),
});
