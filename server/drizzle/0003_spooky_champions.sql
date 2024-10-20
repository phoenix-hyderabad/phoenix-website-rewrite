CREATE TABLE IF NOT EXISTS "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"current" boolean NOT NULL,
	"student" text NOT NULL,
	"designation" text DEFAULT 'member' NOT NULL,
	"team" text,
	"contact" text DEFAULT null,
	"socials" text DEFAULT null
);
