/*
  # Add job_title to job_applications table

  1. Changes
    - Add job_title column as nullable first
    - Update existing records with default value
    - Make column NOT NULL
    - Add index and constraints
    
  2. Security
    - Maintain existing RLS policies
*/

-- Drop the trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS set_job_applications_updated_at ON job_applications;

-- Add job_title column as nullable first
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_applications' AND column_name = 'job_title'
  ) THEN
    ALTER TABLE job_applications ADD COLUMN job_title text;
  END IF;
END $$;

-- Update any existing rows with a default value
UPDATE job_applications 
SET job_title = 'Unknown Position'
WHERE job_title IS NULL;

-- Now make the column NOT NULL
ALTER TABLE job_applications 
  ALTER COLUMN job_title SET NOT NULL;

-- Add index for job_title column
CREATE INDEX IF NOT EXISTS idx_job_applications_job_title 
  ON job_applications(job_title);

-- Add constraint to ensure job_title is not empty
ALTER TABLE job_applications 
  ADD CONSTRAINT job_title_not_empty 
  CHECK (length(trim(job_title)) > 0) 
  NOT VALID;

-- Validate the constraint
ALTER TABLE job_applications 
  VALIDATE CONSTRAINT job_title_not_empty;

-- Recreate the updated_at trigger
CREATE TRIGGER set_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();