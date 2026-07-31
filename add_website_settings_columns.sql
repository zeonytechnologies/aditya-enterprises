-- Add columns to website_settings for the About page & Google Reviews if they don't exist

ALTER TABLE "public"."website_settings" 
  ADD COLUMN IF NOT EXISTS "google_reviews_summary" text DEFAULT '4.9 (551 reviews)',
  ADD COLUMN IF NOT EXISTS "google_reviews_link" text DEFAULT 'https://share.google/fhMAACIVAMLSR57Rc',
  ADD COLUMN IF NOT EXISTS "google_reviews_data" jsonb,
  ADD COLUMN IF NOT EXISTS "about_hero_subtitle" text,
  ADD COLUMN IF NOT EXISTS "about_overview" text,
  ADD COLUMN IF NOT EXISTS "mobile" text,
  ADD COLUMN IF NOT EXISTS "email" text,
  ADD COLUMN IF NOT EXISTS "instagram_link" text,
  ADD COLUMN IF NOT EXISTS "linkedin_link" text,
  ADD COLUMN IF NOT EXISTS "youtube_link" text;

-- Ensure an initial row exists so upsert with id=1 works
INSERT INTO "public"."website_settings" ("id", "google_reviews_summary")
VALUES (1, '4.9 (551 reviews)')
ON CONFLICT ("id") DO NOTHING;
