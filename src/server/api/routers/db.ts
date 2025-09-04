import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { desc, eq, and } from "drizzle-orm";
import { conversation, messages } from "@/server/db/schema";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const dbRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await ctx.db
      .select()
      .from(conversation)
      .where(eq(conversation.clerkUserId, ctx.userId))
      .orderBy(desc(conversation.createdAt));

    return conversations;
  }),
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const conv = await ctx.db.query.conversation.findFirst({
        where: and(
          eq(conversation.id, input.conversationId),
          eq(conversation.clerkUserId, ctx.userId),
        ),
      });
      if (!conv) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.db.query.messages.findMany({
        where: eq(messages.conversationId, input.conversationId),
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      });
    }),
});
