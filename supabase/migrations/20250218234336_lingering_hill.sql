/*
  # Job Applications Schema Update

  1. Changes
    - Creates application_status enum type if it doesn't exist
    - Creates job_applications table if it doesn't exist
    - Adds required columns and constraints
    - Sets up RLS policies safely
    - Adds necessary indexes

  2. Security
    - Enables RLS
    - Adds policies for viewing and creating applications
    
  3. Performance
    - Adds indexes for common query patterns
    - Includes updated_at trigger
*/

-- Create application status enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM (
      'pending',
      'reviewing',
      'shortlisted',
      'rejected',
      'accepted'
    );
  END IF;
END $$;

-- Create job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text NOT NULL,
  job_title text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cv_path text NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  cover_letter text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Safely create policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own applications" ON job_applications;
  DROP POLICY IF EXISTS "Users can create applications" ON job_applications;
  
  -- Create new policies
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
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'job_applications' AND indexname = 'idx_job_applications_user_id'
  ) THEN
    CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'job_applications' AND indexname = 'idx_job_applications_status'
  ) THEN
    CREATE INDEX idx_job_applications_status ON job_applications(status);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'job_applications' AND indexname = 'idx_job_applications_created_at'
  ) THEN
    CREATE INDEX idx_job_applications_created_at ON job_applications(created_at DESC);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'job_applications' AND indexname = 'idx_job_applications_job_id'
  ) THEN
    CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
  END IF;
END $$;

-- Create or replace updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS set_job_applications_updated_at ON job_applications;
CREATE TRIGGER set_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();