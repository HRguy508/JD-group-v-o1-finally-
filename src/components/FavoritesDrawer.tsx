import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { formatCurrency, getImageFallback } from '../lib/utils';
import { Toast } from './Toast';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const { favorites, removeFromFavorites, addToCart } = useUser();
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      setLoading(productId);
      await removeFromFavorites(productId);
      setToast({
        message: 'Removed from favorites',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to remove from favorites',
        type: 'error'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setLoading(productId);
      await addToCart(productId);
      setToast({
        message: 'Added to cart',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to add to cart',
        type: 'error'
      });
    } finally {
      setLoading(null);
    }
  };

  // Filter out any favorites that don't have an ID
  const validFavorites = favorites.filter(item => item && item.id);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="flex items-center justify-between px-4 py-6 sm:px-6">
                      <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                        <Heart className="h-5 w-5 mr-2 text-primary-cta" />
                        Favorites ({validFavorites.length})
                      </Dialog.Title>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close panel</span>
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {validFavorites.length === 0 ? (
                      <div className="flex-1 px-4 py-6 sm:px-6">
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Heart className="h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-500">Your favorites list is empty</p>
                          <button
                            onClick={onClose}
                            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-primary-cta hover:text-primary-cta/90"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {validFavorites.map((item) => (
                              <li key={`favorite-${item.id}`} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={imageErrors[item.id] ? getImageFallback(item.name) : item.image_url}
                                    alt={item.name}
                                    className="h-full w-full object-cover object-center"
                                    onError={() => handleImageError(item.id)}
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.name}</h3>
                                      <p className="ml-4">{formatCurrency(item.price)}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                      {item.description}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <button
                                      onClick={() => handleAddToCart(item.id)}
                                      disabled={loading === item.id}
                                      className="flex items-center text-primary-cta hover:text-primary-cta/90 disabled:opacity-50"
                                    >
                                      {loading === item.id ? (
                                        <div className="h-5 w-5 border-2 border-primary-cta border-t-transparent rounded-full animate-spin mr-2" />
                                      ) : (
                                        <ShoppingBag className="h-5 w-5 mr-2" />
                                      )}
                                      Add to Cart
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFromFavorites(item.id)}
                                      disabled={loading === item.id}
                                      className="font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
                                    >
                                      {loading === item.id ? (
                                        <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <Trash2 className="h-5 w-5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </Dialog>
    </Transition.Root>
  );
}