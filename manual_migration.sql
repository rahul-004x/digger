
-- Update the drizzle_conversation table to match our schema
ALTER TABLE IF EXISTS "drizzle_conversation" ADD COLUMN IF NOT EXISTS "name" text;
ALTER TABLE IF EXISTS "drizzle_conversation" ALTER COLUMN "name" SET NOT NULL;

