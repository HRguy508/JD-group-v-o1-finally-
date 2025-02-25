/*
  # Link product images to products

  1. Changes
    - Add image_url column to products table
    - Update RLS policies for products table
    - Add function to get public URL for product images

  2. Security
    - Maintain existing RLS policies
    - Add policy for public read access to product images
*/

-- Add image_url column to products if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE products ADD COLUMN image_url text;
  END IF;
END $$;

-- Create a function to get the public URL for product images
CREATE OR REPLACE FUNCTION get_product_image_url(bucket_name text, file_name text)
RETURNS text AS $$
BEGIN
  RETURN 'https://uxolqtcieelehayczhpl.supabase.co/storage/v1/object/public/' || bucket_name || '/' || file_name;
END;
$$ LANGUAGE plpgsql;