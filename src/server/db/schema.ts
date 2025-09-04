import {
  pgTableCreator,
  uuid,
  timestamp,
  jsonb,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const createTable = pgTableCreator((name) => `drizzle_${name}`);

export const conversation = createTable("conversation", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  clerkUserId: varchar("clerk_user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = createTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversation.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  content: text("content").notNull(),
  sources: jsonb().$type<
    {
      url: string;
      title: string;
    }[]
  >(),
});

// Relations
export const conversationRelations = relations(conversation, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversation, {
    fields: [messages.conversationId],
    references: [conversation.id],
  }),
}));
