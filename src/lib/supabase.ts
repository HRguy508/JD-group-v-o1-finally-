import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with improved configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: localStorage,
    storageKey: 'jd-group-auth-token'
  },
  global: {
    headers: { 'x-application-name': 'jd-group-website' }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Retry function for API calls with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  initialDelay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    // Exponential backoff with jitter
    const delay = initialDelay * Math.pow(2, 3 - retries) * (0.9 + Math.random() * 0.2);
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, initialDelay);
  }
}

// Authentication helpers with improved error handling
export async function signInWithGoogle() {
  return withRetry(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  });
}

export async function signInWithEmail(email: string, password: string) {
  return withRetry(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  });
}

export async function signUpWithEmail(email: string, password: string) {
  return withRetry(async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    }
  });
}

export async function signOut() {
  return withRetry(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear any stored tokens
      localStorage.removeItem('jd-group-auth-token');
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  });
}

export async function checkAuth() {
  return withRetry(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        if (error.message.includes('refresh_token_not_found')) {
          // Handle invalid refresh token by signing out
          await signOut();
          return { session: null };
        }
        throw error;
      }

      return { session };
    } catch (error) {
      console.error('Check auth error:', error);
      throw error;
    }
  });
}

export async function refreshSession() {
  return withRetry(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        if (error.message.includes('refresh_token_not_found')) {
          // Handle invalid refresh token by signing out
          await signOut();
          return { session: null };
        }
        throw error;
      }

      return { session };
    } catch (error) {
      console.error('Refresh session error:', error);
      throw error;
    }
  });
}

// Sample data for fallback when offline or errors occur
const sampleProducts = [
  {
    id: '1',
    name: 'Modern Sofa',
    description: 'Comfortable 3-seater sofa with premium fabric upholstery',
    price: 899.99,
    category_id: '1',
    category: 'Furniture',
    slug: 'modern-sofa',
    stock_quantity: 10,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Smart TV 55"',
    description: '4K Ultra HD Smart LED TV with HDR',
    price: 699.99,
    category_id: '2',
    category: 'Electronics',
    slug: 'smart-tv-55',
    stock_quantity: 15,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Products with improved error handling and fallback data
export async function getProducts() {
  try {
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.log('Using fallback data due to connection issues');
      return { data: sampleProducts, error: null };
    }

    // First check if categories exist
    const { data: categories, error: categoriesError } = await withRetry(async () => 
      supabase
        .from('categories')
        .select('id, name')
        .order('name')
    );

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return { data: sampleProducts, error: null };
    }

    // Then get products
    const { data: products, error: productsError } = await withRetry(async () =>
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
    );

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return { data: sampleProducts, error: null };
    }

    // If we have both real products and categories, merge them
    if (products?.length && categories?.length) {
      const productsWithCategories = products.map(product => ({
        ...product,
        category: categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized'
      }));
      return { data: productsWithCategories, error: null };
    }

    // Use sample data as fallback
    return { data: sampleProducts, error: null };
  } catch (error) {
    console.error('Error in getProducts:', error);
    return { data: sampleProducts, error: null };
  }
}

// Job Applications with retry logic
export async function submitJobApplication(application: {
  job_title: string;
  email: string;
  phone: string;
  cv_path: string;
  cover_letter?: string;
}) {
  return withRetry(async () => {
    const jobId = application.job_title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const { data, error } = await supabase
      .from('job_applications')
      .insert([{
        ...application,
        job_id: jobId,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  });
}

// Health check function with timeout
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const { error } = await supabase
      .from('products')
      .select('id')
      .limit(1)
      .abortSignal(controller.signal);

    clearTimeout(timeoutId);
    return !error;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
}