import { useState, useEffect, useRef } from 'react';
import { LogOut, User, Heart, ShoppingBag, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { CartDrawer } from './CartDrawer';
import { FavoritesDrawer } from './FavoritesDrawer';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { favoritesCount, cartCount } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const truncateEmail = (email: string) => {
    const [username] = email.split('@');
    return username.length > 12 ? `${username.slice(0, 12)}...` : username;
  };

  return (
    <div className="relative flex items-center space-x-4">
      <button
        onClick={() => setIsFavoritesOpen(true)}
        className="p-2 text-gray-700 hover:text-primary-cta transition-colors duration-200 relative"
        aria-label="View favorites"
      >
        <Heart className="h-5 w-5" />
        {favoritesCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-cta text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {favoritesCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="p-2 text-gray-700 hover:text-primary-cta transition-colors duration-200 relative"
        aria-label="View cart"
      >
        <ShoppingBag className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-cta text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 hover:text-primary-cta transition-colors duration-200"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="User menu"
        >
          <User className="h-5 w-5" />
          <span className="hidden md:inline">
            {user?.email ? truncateEmail(user.email) : 'Account'}
          </span>
        </button>

        <div
          ref={menuRef}
          className={`
            absolute right-[-8px] md:right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 
            transform transition-all duration-200 origin-top-right mx-2 max-w-[calc(100vw-1rem)] overflow-hidden
            ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
          `}
          role="menu"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm text-gray-600 truncate">
              {user?.email ? truncateEmail(user.email) : 'Account'}
            </p>
          </div>

          <a
            href="/account"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            role="menuitem"
          >
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </a>

          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
            role="menuitem"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      <FavoritesDrawer 
        isOpen={isFavoritesOpen} 
        onClose={() => setIsFavoritesOpen(false)} 
      />
    </div>
  );
}