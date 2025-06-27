DO $$ BEGIN
 CREATE TYPE "public"."roles" AS ENUM('member', 'por', 'professor', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."teams" AS ENUM('it', 'tech', 'editorial', 'design');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phoenix-website_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "phoenix-website_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phoenix-website_inductions" (
	"name" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"is_open" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phoenix-website_members" (
	"uid" text NOT NULL,
	"name" text NOT NULL,
	"year" integer NOT NULL,
	"ispor" boolean DEFAULT false NOT NULL,
	"designation" text DEFAULT 'Member' NOT NULL,
	"team" "teams",
	"project" text,
	"ispoc" boolean DEFAULT false NOT NULL,
	"link" text,
	"contact" text,
	CONSTRAINT "phoenix-website_members_uid_year_pk" PRIMARY KEY("uid","year")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phoenix-website_news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"description" text NOT NULL,
	"venue" text NOT NULL,
	"timings" text NOT NULL,
	"contact_name" text,
	"contact_number" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phoenix-website_professors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"designation" text NOT NULL,
	"qualification" text NOT NULL,
	"joined_bits" text NOT NULL,
	"interests" text,
	"courses_taught" text,
	"experience" text,
	"research_lab" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phoenix-website_project_applications" (
	"user_id" text PRIMARY KEY NOT NULL,
	"cgpa" integer NOT NULL,
	"skills" text NOT NULL,
	"additional_info" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phoenix-website_projects" (
	"key" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cover" text NOT NULL,
	"problem_statement" text NOT NULL,
	"current" boolean DEFAULT true,
	CONSTRAINT "phoenix-website_projects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phoenix-website_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phoenix-website_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"roles" roles[] DEFAULT '{}'::roles[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phoenix-website_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "phoenix-website_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phoenix-website_account" ADD CONSTRAINT "phoenix-website_account_user_id_phoenix-website_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."phoenix-website_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phoenix-website_members" ADD CONSTRAINT "phoenix-website_members_project_phoenix-website_projects_key_fk" FOREIGN KEY ("project") REFERENCES "public"."phoenix-website_projects"("key") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phoenix-website_project_applications" ADD CONSTRAINT "phoenix-website_project_applications_user_id_phoenix-website_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."phoenix-website_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phoenix-website_session" ADD CONSTRAINT "phoenix-website_session_user_id_phoenix-website_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."phoenix-website_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "phoenix-website_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "phoenix-website_session" USING btree ("user_id");