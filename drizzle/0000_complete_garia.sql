CREATE TABLE "drizzle_conversation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerkUserId" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drizzle_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"payload" jsonb,
	"sources" jsonb
);
--> statement-breakpoint
ALTER TABLE "drizzle_messages" ADD CONSTRAINT "drizzle_messages_conversation_id_drizzle_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."drizzle_conversation"("id") ON DELETE cascade ON UPDATE no action;