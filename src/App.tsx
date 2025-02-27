import React, { useState, useEffect } from 'react';
import { MapPin, Phone, ArrowRight, Search, Menu, X, Mail, ExternalLink, LogIn, LogOut } from 'lucide-react';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AuthModal } from './components/AuthModal';
import { ServicesSection } from './components/ServicesSection';
import { CareersPage } from './components/CareersPage';
import { SearchModal } from './components/SearchModal';
import { UserMenu } from './components/UserMenu';
import { Toast } from './components/Toast';
import { ProductCard } from './components/ProductCard';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { LocationsSection } from './components/LocationsSection';
import { useAuth } from './contexts/AuthContext';
import { useUser } from './contexts/UserContext';
import { supabase, getProducts, checkSupabaseConnection } from './lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  slug: string;
  stock_quantity: number;
  is_available: boolean;
  image_url: string | null;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const { user, signOut } = useAuth();
  useUser();

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setToast({
      message: 'Successfully signed in!',
      type: 'success'
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      setToast({
        message: 'Successfully signed out!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setToast({
        message: 'Failed to sign out. Please try again.',
        type: 'error'
      });
    }
  };

  const handleShopNowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setActiveCategory('all');
  };

  const fetchProductsAndCategories = async () => {
    try {
      setIsLoading(true);

      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }

      const { data: productsData, error: productsError } = await getProducts();

      if (productsError) throw productsError;
      if (!productsData) {
        throw new Error('No products data received');
      }
      
      setProducts(productsData);

      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name');
      
      if (categoriesData) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setToast({
        message: error instanceof Error 
          ? error.message 
          : 'Failed to load data. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    fetchProductsAndCategories();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => {
        const category = categories.find(cat => cat.id === product.category_id);
        return category?.name.toLowerCase() === activeCategory.toLowerCase();
      });

  return (
    <div className="min-h-screen bg-primary-bg">
      <AnnouncementBanner />
      <WhatsAppButton phoneNumbers={['+256702554028', '+256784772829']} />
      
      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <nav className={`fixed w-full bg-white/95 backdrop-blur-sm z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-12">
              <div className="flex items-center">
                <img src="/logo.svg" alt="JD GROUP" className="h-10 w-10" />
                <span className="ml-2.5 text-xl font-bold text-gray-900 tracking-tight">JD GROUP</span>
              </div>
              
              <div className="hidden lg:flex items-center space-x-8">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className={`text-[15px] font-medium hover:text-primary-cta transition-colors duration-200 ${
                    currentPage === 'home' ? 'text-primary-cta' : 'text-gray-700'
                  }`}
                >
                  Home
                </button>
                <a 
                  href="#products" 
                  className="text-[15px] font-medium text-gray-700 hover:text-primary-cta transition-colors duration-200"
                >
                  Products
                </a>
                <a 
                  href="#services" 
                  className="text-[15px] font-medium text-gray-700 hover:text-primary-cta transition-colors duration-200"
                >
                  Services
                </a>
                <a 
                  href="#locations" 
                  className="text-[15px] font-medium text-gray-700 hover:text-primary-cta transition-colors duration-200"
                >
                  Locations
                </a>
                <button 
                  onClick={() => setCurrentPage('careers')}
                  className={`text-[15px] font-medium hover:text-primary-cta transition-colors duration-200 ${
                    currentPage === 'careers' ? 'text-primary-cta' : 'text-gray-700'
                  }`}
                >
                  Careers
                </button>
                <a 
                  href="#contact" 
                  className="text-[15px] font-medium text-gray-700 hover:text-primary-cta transition-colors duration-200"
                >
                  Contact
                </a>
                <a 
                  href="/privacy-policy.html" 
                  className="text-[15px] font-medium text-gray-700 hover:text-primary-cta transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms-of-service.html" 
                  className="text-[15px] font-medium text-gray-700 hover:text-primary-cta transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-primary-cta transition-colors duration-200"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </button>
              {user ? (
                <UserMenu />
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary-cta text-white text-[15px] font-medium hover:bg-primary-cta/90 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </button>
              )}
            </div>

            <button 
              className="lg:hidden p-2 text-gray-700 hover:text-primary-cta transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen border-t border-gray-100' : 'max-h-0 overflow-hidden'}`}>
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={() => {
                setCurrentPage('home');
                setIsMenuOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-[15px] font-medium text-gray-700 hover:text-primary-cta hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Home
            </button>
            <a 
              href="#products" 
              className="block px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-primary-cta hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </a>
            <a 
              href="#services" 
              className="block px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-primary-cta hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </a>
            <a 
              href="#locations" 
              className="block px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-primary-cta hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Locations
            </a>
            <button
              onClick={() => {
                setCurrentPage('careers');
                setIsMenuOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-[15px] font-medium text-gray-700 hover:text-primary-cta hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Careers
            </button>
            <a 
              href="#contact" 
              className="block px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-primary-cta hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <a 
              href="/privacy-policy.html" 
              className="block px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-primary-cta hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Privacy Policy
            </a>
            <a 
              href="/terms-of-service.html" 
              className="block px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-primary-cta hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Terms of Service
            </a>
            
            <div className="pt-3 border-t border-gray-100">
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-[15px] font-medium text-gray-700">
                    {user.email}
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2.5 text-[15px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2.5 text-[15px] font-medium text-white bg-primary-cta hover:bg-primary-cta/90 rounded-lg transition-colors duration-200"
                >
                  <LogIn className="h-5 w-5 mr-3" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {currentPage === 'careers' ? (
          <CareersPage />
        ) : (
          <>
            <section className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen">
              <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80')"
              }}>
                <span className="w-full h-full absolute opacity-50 bg-secondary-corporate"></span>
              </div>
              <div className="container relative mx-auto">
                <div className="items-center flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                    <div className="text-white">
                      <h1 className="text-5xl font-bold leading-tight mb-6 animate-fade-in">
                        Transform Your Home with JD GROUP
                      </h1>
                      <p className="text-lg mb-8 animate-fade-in-delay">
                        Discover quality furniture, electronics, and appliances at affordable prices. 
                        Powered by PEPKOR's excellence in retail.
                      </p>
                      <div className="flex justify-center gap-4">
                        <button 
                          onClick={handleShopNowClick}
                          className="bg-primary-cta text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-200 
                                   flex items-center animate-fade-in-delay-2 transform hover:scale-105 active:scale-95"
                          aria-label="Shop now and view our products"
                        >
                          Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => {
                            const locationsSection = document.getElementById('locations');
                            if (locationsSection) {
                              locationsSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-white text-primary-text px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-200 
                                   animate-fade-in-delay-2 transform hover:scale-105 active:scale-95"
                          aria-label="Find our store locations"
                        >
                          Find Store
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="products" className="py-16 bg-secondary-bg scroll-mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-primary-text mb-4 md:mb-0">Featured Categories</h2>
                  <div className="flex flex-wrap justify-center gap-2">
                    <CategoryButton 
                      active={activeCategory === 'all'} 
                      onClick={() => setActiveCategory('all')}
                    >
                      All
                    </CategoryButton>
                    {categories.map((category) => (
                      <CategoryButton 
                        key={category.id}
                        active={activeCategory === category.name.toLowerCase()} 
                        onClick={() => setActiveCategory(category.name.toLowerCase())}
                      >
                        {category.name}
                      </CategoryButton>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {isLoading ? (
                    [...Array(8)].map((_, index) => (
                      <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                          <div className="flex justify-between items-center">
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id}
                        id={product.id}
                        title={product.name}
                        price={product.price}
                        rating={4.5}
                        image={product.image_url || `https://source.unsplash.com/featured/?${encodeURIComponent(product.name)}`}
                        description={product.description}
                        stock={product.stock_quantity}
                      />
                    ))
                  )}
                </div>
              </div>
            </section>

            <ServicesSection />
            <LocationsSection />

            <section id="contact" className="py-16 bg-secondary-bg scroll-mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-primary-text mb-8 text-center">Contact Us</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                    <div className="space-y-4">
                      <p className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-primary-cta" />
                        hrjdgroupco@gmail.com
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-primary-cta" />
                        +256702554028 / +256784772829
                      </p>
                      <p className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-primary-cta" />
                        Kampala, Uganda
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          id="name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-cta focus:ring focus:ring-primary-cta focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          id="email"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-cta focus:ring focus:ring-primary-cta focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                          id="message"
                          rows={4}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-cta focus:ring focus:ring-primary-cta focus:ring-opacity-50"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-primary-cta text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors duration-200"
                      >
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="bg-secondary-corporate text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <img src="/logo.svg" alt="JD GROUP" className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold">JD GROUP</span>
              </div>
              <p className="text-gray-300">
                Part of PEPKOR Holdings Limited, bringing quality retail solutions to Uganda.
              </p>
              <a
                href="https://pepkor.co.za/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 text-secondary-accent hover:text-highlight transition-colors duration-200"
              >
                Visit PEPKOR <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-highlight transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-highlight transition-colors duration-200">Our Stores</a></li>
                <li><a href="#" className="hover:text-highlight transition-colors duration-200">Products</a></li>
                <li><a href="#" className="hover:text-highlight transition-colors duration-200">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-highlight transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="hover:text-highlight transition-colors duration-200">FAQs</a></li>
                <li><a href="#" className="hover:text-highlight transition-colors duration-200">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-highlight transition-colors duration-200">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Kampala, Uganda
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +256702554028 / +256784772829
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  hrjdgroupco@gmail.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} JD GROUP Uganda. All rights reserved.</p>
            <p className="mt-2">
              <a href="/privacy-policy.html" className="hover:text-highlight transition-colors duration-200 mr-4">Privacy Policy</a>
              <a href="/terms-of-service.html" className="hover:text-highlight transition-colors duration-200">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface CategoryButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function CategoryButton({ children, active, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full transition-colors duration-200 ${
        active 
          ? 'bg-primary-cta text-white' 
          : 'bg-white text-primary-text hover:bg-secondary-bg'
      }`}
    >
      {children}
    </button>
  );
}

export default App;