import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { tavily } from "@tavily/core";

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY 
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
});
