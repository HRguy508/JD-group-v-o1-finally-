import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface UserContextType {
  favorites: Product[];
  cartItems: CartItem[];
  searchHistory: SearchItem[];
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  addToSearchHistory: (query: string) => Promise<void>;
  clearSearchHistory: () => Promise<void>;
  cartCount: number;
  favoritesCount: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  stock_quantity: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface SearchItem {
  id: string;
  query: string;
  created_at: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchItem[]>([]);

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when logged out
      setFavorites([]);
      setCartItems([]);
      setSearchHistory([]);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load favorites with product details
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select(`
          product_id,
          products (
            id,
            name,
            description,
            price,
            image_url,
            category_id,
            stock_quantity
          )
        `)
        .eq('user_id', user.id);

      if (favoritesData) {
        const products = favoritesData
          .map(f => f.products)
          .filter(p => p !== null) as Product[];
        setFavorites(products);
      }

      // Load cart items with product details
      const { data: cartData } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          products (
            id,
            name,
            description,
            price,
            image_url,
            category_id,
            stock_quantity
          )
        `)
        .eq('user_id', user.id);

      if (cartData) {
        const items = cartData
          .map(item => ({
            ...item.products,
            quantity: item.quantity
          }))
          .filter(item => item.id !== null) as CartItem[];
        setCartItems(items);
      }

      // Load search history
      const { data: searchData } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (searchData) {
        setSearchHistory(searchData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const addToFavorites = async (productId: string) => {
    if (!user) return;

    try {
      // First get the product details
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) throw new Error('Product not found');

      // Add to favorites table
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, product_id: productId }]);

      if (!error) {
        setFavorites([...favorites, product]);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) {
        setFavorites(favorites.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  };

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) return;

    try {
      // Get product details
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) throw new Error('Product not found');

      const existingItem = cartItems.find(item => item.id === productId);

      if (existingItem) {
        await updateCartQuantity(productId, existingItem.quantity + quantity);
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert([{ user_id: user.id, product_id: productId, quantity }]);

        if (!error) {
          setCartItems([...cartItems, { ...product, quantity }]);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) {
        setCartItems(cartItems.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) {
        setCartItems(cartItems.map(item => 
          item.id === productId ? { ...item, quantity } : item
        ));
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  };

  const addToSearchHistory = async (query: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('search_history')
        .insert([{ user_id: user.id, query }])
        .select()
        .single();

      if (!error && data) {
        setSearchHistory([data, ...searchHistory]);
      }
    } catch (error) {
      console.error('Error adding to search history:', error);
      throw error;
    }
  };

  const clearSearchHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (!error) {
        setSearchHistory([]);
      }
    } catch (error) {
      console.error('Error clearing search history:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{
      favorites,
      cartItems,
      searchHistory,
      addToFavorites,
      removeFromFavorites,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      addToSearchHistory,
      clearSearchHistory,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      favoritesCount: favorites.length,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}