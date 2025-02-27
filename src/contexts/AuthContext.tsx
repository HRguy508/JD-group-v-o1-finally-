import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, checkAuth, refreshSession, signOut as supabaseSignOut } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { session } = await checkAuth();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid session state
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session?.user?.email);
      
      try {
        switch (event) {
          case 'SIGNED_IN':
            setSession(session);
            setUser(session?.user ?? null);
            break;
          case 'SIGNED_OUT':
            setSession(null);
            setUser(null);
            break;
          case 'TOKEN_REFRESHED':
            const { session: refreshedSession } = await refreshSession();
            setSession(refreshedSession);
            setUser(refreshedSession?.user ?? null);
            break;
          case 'USER_UPDATED':
            setSession(session);
            setUser(session?.user ?? null);
            break;
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        // Handle auth errors by clearing state
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription and mounted flag
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabaseSignOut();
      setSession(null);
      setUser(null);
      return Promise.resolve();
    } catch (error) {
      console.error('Sign out error:', error);
      return Promise.reject(error);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}