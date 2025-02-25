// Supabase Database Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_title: string;
  email: string;
  phone: string;
  cv_path: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

// Storage types
export interface StorageError extends Error {
  statusCode?: number;
  code?: string;
}

export interface UploadResult {
  path: string;
  url?: string;
}

export interface StorageConfig {
  maxSize: number;
  allowedTypes: string[];
  bucket: string;
}