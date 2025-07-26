import { z } from "zod";
import { Readability } from "@mozilla/readability";
import jsdom, { JSDOM } from "jsdom";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { tavily } from "@tavily/core";

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

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

  getAnswer: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input }) => {
      const response = await fetch(input.url);
      const html = await response.text();

      const virtualConsole = new jsdom.VirtualConsole();
      const dom = new JSDOM(html, { virtualConsole });

      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      return {
        answer: article?.textContent || "No content found",
      };
    // return article?.textContent
    }),
});
