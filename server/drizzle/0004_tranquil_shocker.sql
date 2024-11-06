CREATE TABLE IF NOT EXISTS "config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "news" (
	"title" text NOT NULL,
	"url" text,
	"description" text NOT NULL,
	"venue" text NOT NULL,
	"timings" text NOT NULL,
	"contact_name" text,
	"contact_number" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"key" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cover" text NOT NULL,
	"problem_statement" text NOT NULL,
	"current" boolean DEFAULT true,
	CONSTRAINT "projects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "contact" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "socials" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "professors" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "professors" ALTER COLUMN "courses_taught" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "professors" ALTER COLUMN "experiences" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "professors" ALTER COLUMN "lab_website" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "professors" ALTER COLUMN "research_lab" DROP DEFAULT;