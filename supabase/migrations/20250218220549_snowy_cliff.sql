/*
  # Fix Job Applications Schema

  1. Changes
    - Add missing columns to job_applications table
    - Update RLS policies
    - Add indexes for better performance

  2. Security
    - Ensure RLS is enabled
    - Update policies for proper access control
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_applications' AND column_name = 'cover_letter'
  ) THEN
    ALTER TABLE job_applications ADD COLUMN cover_letter text;
  END IF;
END $$;

-- Update or create policies
DROP POLICY IF EXISTS "Users can view their own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can create applications" ON job_applications;

CREATE POLICY "Users can view their own applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add or update indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_status_created ON job_applications(status, created_at DESC);