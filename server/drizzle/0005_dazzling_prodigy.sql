ALTER TABLE "members" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "current";--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "student";--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "socials";