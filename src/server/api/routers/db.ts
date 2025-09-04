import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { desc, eq } from "drizzle-orm";
import { conversation } from "@/server/db/schema";

export const dbRouter = createTRPCRouter({
  getConversations: protectedProcedure
    .query(async({ ctx }) => {
      const conversations = await ctx.db
        .select()
        .from(conversation)
        .where(eq(conversation.clerkUserId, ctx.userId))
        .orderBy(desc(conversation.createdAt));
      
      return conversations;
    })
})
