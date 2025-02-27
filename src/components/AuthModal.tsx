import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authStateChanged, setAuthStateChanged] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setMessage(null);
      setAuthStateChanged(false);
    }
  }, [isOpen]);

  // Handle auth state changes
  useEffect(() => {
    const handleAuthStateChange = (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED') => {
      if (event === 'SIGNED_IN' && !authStateChanged) {
        setAuthStateChanged(true);
        onSuccess();
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      handleAuthStateChange(event as 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED');
    });

    return () => subscription.unsubscribe();
  }, [onSuccess, authStateChanged]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || googleLoading) return;

    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;
        
        setMessage({
          type: 'success',
          text: 'Registration successful! Please check your email to verify your account.'
        });
        
        setIsSignUp(false);
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        // onSuccess will be called by the auth state change listener
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An error occurred during authentication'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading || googleLoading) return;
    
    try {
      setGoogleLoading(true);
      setMessage(null);
      
      const { error } = await signInWithGoogle();
      if (error) throw error;
      
      // Success is handled by the auth state change listener
    } catch (err) {
      console.error('Google sign in error:', err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to sign in with Google'
      });
      setGoogleLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        
        {message && (
          <div className={`flex items-center gap-2 ${
            message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          } p-3 rounded-lg mb-4`}>
            {message.type === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          aria-label="Sign in with Google"
        >
          {googleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span className="font-medium">{googleLoading ? 'Signing in...' : 'Continue with Google'}</span>
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-cta focus:ring focus:ring-primary-cta focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={loading || googleLoading}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-cta focus:ring focus:ring-primary-cta focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={loading || googleLoading}
              minLength={8}
              placeholder={isSignUp ? "8+ characters" : "Enter your password"}
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-primary-cta text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}</span>
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }}
              className="text-primary-cta hover:underline transition-all duration-200"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Create one'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}