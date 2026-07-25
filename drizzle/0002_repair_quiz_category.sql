-- ai-quiz-generation.D_PERSIST.4
-- Repair databases created before quiz category was added to the schema.
DO $$
BEGIN
  CREATE TYPE "public"."quiz_category" AS ENUM (
    'science',
    'history',
    'mathematics',
    'technology',
    'language',
    'geography',
    'arts',
    'sports',
    'medicine',
    'law',
    'economics',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "quizzes"
  ADD COLUMN IF NOT EXISTS "category" "public"."quiz_category";

UPDATE "quizzes"
SET "category" = 'other'
WHERE "category" IS NULL;

ALTER TABLE "quizzes"
  ALTER COLUMN "category" SET NOT NULL;
