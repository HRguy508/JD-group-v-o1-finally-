/*
  # Add Product Image Indexes

  1. Changes
    - Add indexes for product_images and products tables to improve query performance
    - Indexes added:
      - product_images.product_id
      - products.category_id
      - products.is_available
*/

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available) WHERE is_available = true;