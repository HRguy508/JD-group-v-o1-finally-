/*
  # Fix Job Applications Schema

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key)
      - `job_title` (text)
      - `email` (text)
      - `phone` (text)
      - `cv_path` (text)
      - `status` (application_status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Create application_status enum type
    - Add RLS policies for job applications
    - Add indexes for better performance

  3. Security
    - Enable RLS on job_applications table
    - Add policies for authenticated users
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
  job_title text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cv_path text NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);

-- Add updated_at trigger
CREATE TRIGGER set_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();