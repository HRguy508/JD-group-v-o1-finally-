/*
  # Consolidated Schema Updates

  1. Changes
    - Add missing indexes for performance optimization
    - Add missing RLS policies
    - Add missing triggers and functions
    - Ensure all tables have proper constraints

  2. Security
    - Verify RLS is enabled on all tables
    - Add any missing security policies
*/

-- Create or replace the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add missing triggers for updated_at columns
DO $$ 
BEGIN
  -- Products table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_products_updated_at'
  ) THEN
    CREATE TRIGGER set_products_updated_at
      BEFORE UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Cart items table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_cart_items_updated_at'
  ) THEN
    CREATE TRIGGER set_cart_items_updated_at
      BEFORE UPDATE ON cart_items
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- User profiles table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_user_profiles_updated_at'
  ) THEN
    CREATE TRIGGER set_user_profiles_updated_at
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_product ON cart_items(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_created ON search_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Add check constraints for data integrity
ALTER TABLE products 
  ADD CONSTRAINT check_price_positive 
  CHECK (price >= 0) 
  NOT VALID;

ALTER TABLE cart_items 
  ADD CONSTRAINT check_quantity_positive 
  CHECK (quantity > 0) 
  NOT VALID;

-- Ensure all tables have proper timestamps
DO $$ 
BEGIN
  -- Add updated_at to tables if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE categories ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add missing RLS policies
DO $$ 
BEGIN
  -- Categories policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' AND policyname = 'Categories are viewable by everyone'
  ) THEN
    CREATE POLICY "Categories are viewable by everyone" 
      ON categories FOR SELECT 
      USING (true);
  END IF;

  -- Product variants policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_variants' AND policyname = 'Product variants are viewable by everyone'
  ) THEN
    CREATE POLICY "Product variants are viewable by everyone" 
      ON product_variants FOR SELECT 
      USING (true);
  END IF;
END $$;