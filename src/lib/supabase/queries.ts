import { supabase } from './client';
import type { Database } from './types';
import { PAGINATION } from '../constants';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type JobApplication = Database['public']['Tables']['job_applications']['Row'];

// Products
export async function getProducts(options: {
  limit?: number;
  offset?: number;
  categoryId?: string;
  search?: string;
  sortBy?: keyof Product;
  sortOrder?: 'asc' | 'desc';
}) {
  const {
    limit = PAGINATION.defaultLimit,
    offset = 0,
    categoryId,
    search,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = options;

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error, count } = await query.select('*', { count: 'exact' });

  if (error) throw error;
  return { data, count };
}

// Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

// Job Applications
export async function submitJobApplication(application: {
  job_title: string;
  email: string;
  phone: string;
  cv_path: string;
  cover_letter?: string;
}) {
  const { data, error } = await supabase
    .from('job_applications')
    .insert([application])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserApplications(userId: string) {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// User Data
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, profile: Partial<Database['public']['Tables']['user_profiles']['Update']>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Favorites
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(f => f.product_id);
}

export async function toggleFavorite(userId: string, productId: string, isFavorite: boolean) {
  if (isFavorite) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, product_id: productId }]);

    if (error) throw error;
  }
}

// Cart
export async function getUserCart(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .upsert([{ user_id: userId, product_id: productId, quantity }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromCart(userId: string, productId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}

// Search History
export async function addToSearchHistory(userId: string, query: string) {
  const { error } = await supabase
    .from('search_history')
    .insert([{ user_id: userId, query }]);

  if (error) throw error;
}

export async function getSearchHistory(userId: string) {
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

export async function clearSearchHistory(userId: string) {
  const { error } = await supabase
    .from('search_history')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}