ALTER TABLE "drizzle_conversation" ALTER COLUMN "clerkUserId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "drizzle_conversation" ADD COLUMN "name" text NOT NULL;