/*
  # Fix job applications RLS policies

  1. Changes
    - Drop existing policies
    - Create new policies for job applications table
    - Allow authenticated users to create applications
    - Allow users to view their own applications
    - Allow admin to view all applications

  2. Security
    - Enable RLS on job_applications table
    - Add policies for INSERT and SELECT operations
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can create applications" ON job_applications;
DROP POLICY IF EXISTS "Admin can view all applications" ON job_applications;

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Anyone can create applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    email = auth.email()
  );

CREATE POLICY "Admin can view all applications"
  ON job_applications
  FOR ALL
  TO authenticated
  USING (
    auth.email() = 'admin@jdgroup.co.ug'
  );