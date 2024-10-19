CREATE TABLE IF NOT EXISTS "professors" (
	"id" serial PRIMARY KEY NOT NULL,
	"faculty" text NOT NULL,
	"designation" text NOT NULL,
	"qualification" text NOT NULL,
	"joined_bits" text NOT NULL,
	"interests" text NOT NULL,
	"courses_taught" text NOT NULL,
	"experiences" text,
	"lab_website" text,
	"research_lab" text
);
