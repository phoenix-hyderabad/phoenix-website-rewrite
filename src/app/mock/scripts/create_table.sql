-- ============================================================
-- Supabase SQL: Create phoenix-website_mock_oa table
-- Run this in the Supabase SQL Editor if the table doesn't exist yet.
-- https://supabase.com/dashboard/project/vmhkpasbiwjtjorasepm/sql/new
-- ============================================================

CREATE TABLE IF NOT EXISTS "phoenix-website_mock_oa" (
  qid        SERIAL       PRIMARY KEY,
  qtext      TEXT,
  qimage     TEXT,
  type       VARCHAR(20),
  section    VARCHAR(50),
  option1    TEXT,
  option2    TEXT,
  option3    TEXT,
  option4    TEXT,
  correctans TEXT
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE "phoenix-website_mock_oa" ENABLE ROW LEVEL SECURITY;

-- Allow public read access (needed for the publishable/anon key)
CREATE POLICY "Allow public read" ON "phoenix-website_mock_oa"
  FOR SELECT USING (true);

-- Allow authenticated users (or anon) to insert
-- NOTE: If you're using the publishable key from the frontend/Python script,
-- you need the insert policy too. For production, restrict to service role only.
CREATE POLICY "Allow insert with anon key" ON "phoenix-website_mock_oa"
  FOR INSERT WITH CHECK (true);

-- Verify table
SELECT count(*) FROM "phoenix-website_mock_oa";
