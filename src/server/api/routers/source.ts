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
            cleanText = cleanText
              .replace(/\n\s*\n\s*\n/g, "\n\n")
              .replace(/[ \t]{2,}/g, " ")
              .replace(/^\s+|\s+$/gm, "")
              .trim();

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
      return context;
    }),
});
