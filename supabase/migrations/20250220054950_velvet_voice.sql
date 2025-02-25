/*
  # Add Initial Categories

  1. New Data
    - Add initial product categories
    - Add indexes for better performance
  
  2. Changes
    - Insert default categories if they don't exist
    - Add text search capabilities
*/

-- Insert initial categories if they don't exist
INSERT INTO categories (name, slug, description)
VALUES 
  ('Furniture', 'furniture', 'Quality home and office furniture'),
  ('Electronics', 'electronics', 'Modern electronics and appliances'),
  ('Appliances', 'appliances', 'Home and kitchen appliances'),
  ('Decor', 'decor', 'Home decoration and accessories')
ON CONFLICT (slug) DO NOTHING;

-- Add text search capabilities
ALTER TABLE categories ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', name || ' ' || COALESCE(description, ''))) STORED;

CREATE INDEX IF NOT EXISTS categories_search_idx ON categories USING GIN (search_vector);

-- Add updated_at trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_categories_updated_at'
  ) THEN
    CREATE TRIGGER set_categories_updated_at
      BEFORE UPDATE ON categories
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;