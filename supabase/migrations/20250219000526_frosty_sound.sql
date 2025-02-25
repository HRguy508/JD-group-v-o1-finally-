/*
  # Add job_id to job_applications table

  1. Changes
    - Add job_id column to job_applications table
    - Make job_id NOT NULL
    - Add index on job_id for better query performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add job_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_applications' AND column_name = 'job_id'
  ) THEN
    ALTER TABLE job_applications ADD COLUMN job_id text;
  END IF;
END $$;

-- Update any existing rows with a default value
UPDATE job_applications 
SET job_id = lower(regexp_replace(job_title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE job_id IS NULL;

-- Make the column NOT NULL
ALTER TABLE job_applications 
  ALTER COLUMN job_id SET NOT NULL;

-- Add index for job_id
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id 
  ON job_applications(job_id);

-- Add constraint to ensure job_id is not empty
ALTER TABLE job_applications 
  ADD CONSTRAINT job_id_not_empty 
  CHECK (length(trim(job_id)) > 0) 
  NOT VALID;

-- Validate the constraint
ALTER TABLE job_applications 
  VALIDATE CONSTRAINT job_id_not_empty;