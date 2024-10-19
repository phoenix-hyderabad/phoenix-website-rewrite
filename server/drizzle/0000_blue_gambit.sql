DO $$ BEGIN
 CREATE TYPE "public"."roles" AS ENUM('member', 'por', 'professor', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inductions" (
	"name" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"is_open" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"email" text PRIMARY KEY NOT NULL,
	"roles" roles[] DEFAULT '{}'::roles[] NOT NULL
);
