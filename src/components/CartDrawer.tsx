import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Toast } from './Toast';
import { supabase } from '../lib/supabase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { user } = useAuth();
  const { cartItems, updateCartQuantity, removeFromCart } = useUser();
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return sum + (price * quantity);
  }, 0);

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setLoading(productId);
      await updateCartQuantity(productId, newQuantity);
    } catch (error) {
      setToast({
        message: 'Failed to update quantity. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setLoading(productId);
      await removeFromCart(productId);
      setToast({
        message: 'Item removed from cart',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to remove item. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleCheckout = async () => {
    if (!user) return;

    try {
      setIsCheckingOut(true);

      // First create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          total_amount: total,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Then create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart after successful order
      for (const item of cartItems) {
        await removeFromCart(item.id);
      }

      // Show success message and redirect
      setToast({
        message: 'Order placed successfully! Redirecting to payment...',
        type: 'success'
      });

      // Simulate payment redirect
      setTimeout(() => {
        window.location.href = `/checkout/${order.id}`;
      }, 2000);

    } catch (error) {
      console.error('Checkout error:', error);
      setIsCheckingOut(false);
    }
  };

  const getImageFallback = (name: string) => `https://source.unsplash.com/featured/?${encodeURIComponent(name)}`;

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
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        Shopping Cart ({cartItems.length})
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

                    {cartItems.length === 0 ? (
                      <div className="flex-1 px-4 py-6 sm:px-6">
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-500">Your cart is empty</p>
                          <button
                            onClick={onClose}
                            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-primary-cta hover:text-primary-cta/90"
                          >
                            Continue Shopping
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {cartItems.map((item) => (
                                <li key={item.id} className="flex py-6">
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
                                        <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                        {item.description}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center space-x-3">
                                        <button
                                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                          disabled={loading === item.id || item.quantity <= 1}
                                          className="rounded-full p-1 hover:bg-gray-100 disabled:opacity-50"
                                        >
                                          <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="font-medium">{item.quantity}</span>
                                        <button
                                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                          disabled={loading === item.id}
                                          className="rounded-full p-1 hover:bg-gray-100 disabled:opacity-50"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </button>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handleRemoveItem(item.id)}
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

                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-base font-medium text-gray-900">Total</p>
                            <p className="text-base font-medium text-gray-900">{formatCurrency(total)}</p>
                          </div>

                          <div className="mt-6">
                            <button
                              onClick={handleCheckout}
                              disabled={isCheckingOut}
                              className="w-full rounded-full bg-primary-cta px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-cta/90 focus:outline-none focus:ring-2 focus:ring-primary-cta focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 flex items-center justify-center"
                            >
                              {isCheckingOut ? (
                                <>
                                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                  Processing...
                                </>
                              ) : (
                                'Checkout'
                              )}
                            </button>
                          </div>

                          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                            <p>
                              or{' '}
                              <button
                                type="button"
                                className="font-medium text-primary-cta hover:text-primary-cta/90"
                                onClick={onClose}
                              >
                                Continue Shopping
                                <span aria-hidden="true"> →</span>
                              </button>
                            </p>
                          </div>
                        </div>
                      </>
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