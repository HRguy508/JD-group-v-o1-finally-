export const SITE_CONFIG = {
  name: 'JD GROUP Uganda',
  description: 'Quality furniture, electronics, and appliances at affordable prices.',
  url: 'https://jdgroup.ug',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/jdgroupug',
    facebook: 'https://facebook.com/jdgroupug',
    linkedin: 'https://linkedin.com/company/jd-group-uganda',
  },
} as const;

export const CONTACT_INFO = {
  email: 'hrjdgroupco@gmail.com',
  phone: ['+256702554028', '+256784772829'],
  address: 'Kampala, Uganda',
  locations: [
    {
      name: 'NEW PIONEER MALL',
      description: 'Located in the heart of Kampala City',
      hours: 'Mon-Sat: 9:00 AM - 8:00 PM',
      coordinates: { lat: 0.3136, lng: 32.5811 },
    },
    {
      name: 'Namanve Industrial Park',
      description: 'Our main distribution center',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
      coordinates: { lat: 0.3500, lng: 32.6833 },
    },
  ],
} as const;

export const FILE_CONFIG = {
  maxSizes: {
    productImage: 5 * 1024 * 1024, // 5MB
    cv: 10 * 1024 * 1024, // 10MB
  },
  allowedTypes: {
    images: ['image/jpeg', 'image/png', 'image/webp'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
} as const;

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_SUPABASE_URL,
  maxRetries: 3,
  timeout: 10000,
} as const;

export const STORAGE_KEYS = {
  theme: 'jd-group-theme',
  authToken: 'jd-group-auth-token',
  cart: 'jd-group-cart',
  searchHistory: 'jd-group-search-history',
} as const;

export const QUERY_KEYS = {
  products: 'products',
  categories: 'categories',
  cart: 'cart',
  favorites: 'favorites',
  applications: 'applications',
  user: 'user',
} as const;

export const ROUTES = {
  home: '/',
  products: '/products',
  categories: '/categories',
  cart: '/cart',
  favorites: '/favorites',
  account: '/account',
  careers: '/careers',
  contact: '/contact',
} as const;

export const APPLICATION_STATUS = {
  pending: 'pending',
  reviewing: 'reviewing',
  shortlisted: 'shortlisted',
  rejected: 'rejected',
  accepted: 'accepted',
} as const;

export const CURRENCY = {
  code: 'UGX',
  symbol: 'USh',
  exchangeRate: 3700, // USD to UGX
  defaultDiscount: 50, // 50% off
} as const;

export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 100,
} as const;

export const TIMEOUTS = {
  toast: 5000,
  search: 300,
  animation: 200,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const META_DEFAULTS = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  ogImage: SITE_CONFIG.ogImage,
  keywords: [
    'furniture',
    'electronics',
    'appliances',
    'Uganda',
    'PEPKOR',
    'retail',
    'home solutions',
  ],
} as const;