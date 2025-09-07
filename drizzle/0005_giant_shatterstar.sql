ALTER TABLE "drizzle_messages" RENAME COLUMN "payload" TO "role";--> statement-breakpoint
ALTER TABLE "drizzle_messages" ADD COLUMN "content" text NOT NULL;