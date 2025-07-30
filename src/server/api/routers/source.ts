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
    .input(z.object({ urls: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      let context = await Promise.all(
        input.urls.map(async (url: string) => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();

            const virtualConsole = new jsdom.VirtualConsole();
            const dom = new JSDOM(html, { virtualConsole });

            const reader = new Readability(dom.window.document);
            const article = reader.parse();

            let cleanText = article?.textContent || "No content found";
            cleanText = cleanedText(cleanText);
            console.log(
              `After cleaning (${url}):`,
              cleanText.substring(0, 100),
            );
            return {
              context: cleanText,
            };
          } catch (error) {
            console.error(`Failed to fetch or parse ${url}:`, error);
            return {
              context: `Could not retrieve content from ${url}`,
            };
          }
        }),
      );
      const mainAnswerPrompt = `
  Given a user question and some context, please write a clean, concise and accurate answer to the question based on the context. You will be given a set of related contexts to the question, each starting with a reference number like [[citation:x]], where x is a number. Please use the context when crafting your answer.

  Your answer must be correct, accurate and written by an expert using an unbiased and professional tone. Please limit to 1024 tokens. Do not give any information that is not related to the question, and do not repeat. Say "information is missing on" followed by the related topic, if the given context do not provide sufficient information.


  Remember, don't blindly repeat the contexts verbatim and don't tell the user how you used the citations – just respond with the answer. It is very important for my career that you follow these instructions. Here is the user question:
    `;
      const combinedContext = context.map((item) => item?.context).join("\n\n");
      const completions = await openRouterClient.chat.completions.create({
        model: "moonshotai/kimi-k2:free",
        messages: [
          {
            role: "system",
            content: `${mainAnswerPrompt}`,
          },
          {
            role: "user",
            content: `Here is the extracted context from web:\n\n${combinedContext}`,
          },
        ],
      });
      console.log(completions.choices[0]?.message);
      return context;
    }),
});
