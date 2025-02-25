import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from './Toast';
import { DEFAULT_PRODUCT_IMAGE } from '../lib/storage-config';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  stock: number;
}

export function ProductCard({ id, title, price, rating, image, description, stock }: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart, addToFavorites, removeFromFavorites, favorites } = useUser();
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const isFavorite = favorites.includes(id);

  const getFallbackImage = () => {
    return `https://source.unsplash.com/featured/?${encodeURIComponent(title)}`;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleAddToCart = async () => {
    if (!user) {
      setToast({
        message: 'Please sign in to add items to your cart',
        type: 'error'
      });
      return;
    }

    if (stock === 0) return;
    
    setLoading(true);
    try {
      await addToCart(id);
      setToast({
        message: 'Added to cart successfully!',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to add to cart. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      setToast({
        message: 'Please sign in to save favorites',
        type: 'error'
      });
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(id);
        setToast({
          message: 'Removed from favorites',
          type: 'success'
        });
      } else {
        await addToFavorites(id);
        setToast({
          message: 'Added to favorites!',
          type: 'success'
        });
      }
    } catch (error) {
      setToast({
        message: 'Failed to update favorites. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <div className={`w-full h-48 bg-gray-100 ${!imageLoaded ? 'animate-pulse' : ''}`}>
          <img 
            src={imageError ? getFallbackImage() : image || DEFAULT_PRODUCT_IMAGE}
            alt={title}
            className={`w-full h-48 object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            decoding="async"
          />
        </div>
        
        <button 
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-secondary-bg transition-colors duration-200"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary-cta text-primary-cta' : 'text-gray-400'}`} />
        </button>
        
        {stock < 5 && stock > 0 && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm rounded-full">
            Only {stock} left
          </div>
        )}
        {stock === 0 && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gray-500 text-white text-sm rounded-full">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-primary-text">{title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
        <div className="flex items-center mb-2">
          <span className="text-sm text-gray-600">Rating: {rating}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary-text">
            {new Intl.NumberFormat('en-UG', {
              style: 'currency',
              currency: 'UGX',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(price * 3700 * 0.5)} {/* Apply 50% discount */}
          </span>
          <button 
            onClick={handleAddToCart}
            disabled={loading || stock === 0}
            className={`
              relative overflow-hidden
              ${stock > 0 
                ? 'bg-primary-cta hover:bg-opacity-90' 
                : 'bg-gray-400 cursor-not-allowed'
              } 
              text-white px-4 py-2 rounded-full transition-all duration-200
              transform hover:scale-105 active:scale-95
            `}
          >
            <span className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              <ShoppingBag className="h-5 w-5" />
              {user ? 'Add to Cart' : 'Sign in to Buy'}
            </span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </div>
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}