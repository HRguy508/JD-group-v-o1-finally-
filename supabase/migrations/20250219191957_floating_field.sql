/*
  # Fix function search path warnings

  1. Changes
    - Add search_path parameter to all database functions
    - Ensure consistent schema usage
    - Fix potential schema resolution issues

  2. Security
    - Maintain existing security model
    - Explicit schema resolution for better security
*/

-- Set search_path for get_product_image_url function
CREATE OR REPLACE FUNCTION public.get_product_image_url(bucket_name text, file_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'https://uxolqtcieelehayczhpl.supabase.co/storage/v1/object/public/' || bucket_name || '/' || file_name;
END;
$$;

-- Set search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Recreate triggers with proper schema qualification
DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER set_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER set_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment to document the search_path setting
COMMENT ON FUNCTION public.get_product_image_url(text, text) IS 'Returns the public URL for a product image. Search path is explicitly set to public schema.';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Updates the updated_at column with the current timestamp. Search path is explicitly set to public schema.';