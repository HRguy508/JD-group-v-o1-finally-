import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import { API_CONFIG } from '../constants';

const supabaseUrl = API_CONFIG.baseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'jd-group-website',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  // Add request timeout
  fetch: (url, options) => {
    return fetch(url, {
      ...options,
      signal: AbortSignal.timeout(API_CONFIG.timeout),
    });
  },
});

// Improved connection check with timeout
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1)
      .abortSignal(controller.signal);

    clearTimeout(timeoutId);
    return !error && data !== null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Connection check timed out');
    } else {
      console.error('Connection check failed:', error);
    }
    return false;
  }
}

// Initialize Supabase with retry logic
export async function initializeSupabase(retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    const isConnected = await checkSupabaseConnection();
    if (isConnected) return;

    // Exponential backoff
    if (i < retries - 1) {
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Failed to establish connection to Supabase');
}