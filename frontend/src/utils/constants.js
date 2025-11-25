// Application constants
export const APP_CONFIG = {
    NAME: 'EstatePro',
    VERSION: '1.0.0',
    DESCRIPTION: 'Premium Real Estate Platform',
    SUPPORT_EMAIL: 'support@estatepro.com',
    SUPPORT_PHONE: '+1 (555) 123-4567',
    OFFICE_HOURS: 'Mon-Fri: 9:00 AM - 6:00 PM',
  };
  
  // Property-related constants
  export const PROPERTY_TYPES = {
    HOUSE: 'house',
    APARTMENT: 'apartment',
    CONDO: 'condo',
    VILLA: 'villa',
    COMMERCIAL: 'commercial',
    LAND: 'land',
    OTHER: 'other',
  };
  
  export const PROPERTY_STATUS = {
    FOR_SALE: 'forSale',
    FOR_RENT: 'forRent',
    SOLD: 'sold',
    RENTED: 'rented',
    PENDING: 'pending',
  };
  
  export const PROPERTY_FEATURES = {
    AIR_CONDITIONING: 'airConditioning',
    HEATING: 'heating',
    PARKING: 'parking',
    GARAGE: 'garage',
    POOL: 'pool',
    GARDEN: 'garden',
    BALCONY: 'balcony',
    FIREPLACE: 'fireplace',
    SECURITY_SYSTEM: 'securitySystem',
    FURNISHED: 'furnished',
    PET_FRIENDLY: 'petFriendly',
    WHEELCHAIR_ACCESSIBLE: 'wheelchairAccessible',
  };
  
  export const PROPERTY_SORT_OPTIONS = {
    NEWEST: 'createdAt:desc',
    OLDEST: 'createdAt:asc',
    PRICE_LOW_TO_HIGH: 'price:asc',
    PRICE_HIGH_TO_LOW: 'price:desc',
    AREA_LOW_TO_HIGH: 'area:asc',
    AREA_HIGH_TO_LOW: 'area:desc',
    NAME_A_TO_Z: 'title:asc',
    NAME_Z_TO_A: 'title:desc',
  };
  
  // Blog-related constants
  export const BLOG_POST_STATUS = {
    PUBLISHED: 'published',
    DRAFT: 'draft',
    SCHEDULED: 'scheduled',
  };
  
  export const BLOG_CATEGORIES = {
    MARKET_NEWS: 'market-news',
    BUYING_GUIDE: 'buying-guide',
    SELLING_TIPS: 'selling-tips',
    HOME_IMPROVEMENT: 'home-improvement',
    INVESTMENT: 'investment',
    NEIGHBORHOOD_GUIDES: 'neighborhood-guides',
  };
  
  // Form validation constants
  export const VALIDATION = {
    EMAIL: {
      REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      MESSAGE: 'Please enter a valid email address',
    },
    PHONE: {
      REGEX: /^[\+]?[1-9][\d]{0,15}$/,
      MESSAGE: 'Please enter a valid phone number',
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      MESSAGE: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
    },
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
      MESSAGE: 'Name must be between 2 and 50 characters',
    },
    MESSAGE: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 1000,
      MESSAGE: 'Message must be between 10 and 1000 characters',
    },
  };
  
  // API configuration
  export const API_CONFIG = {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    UPLOAD_TIMEOUT: 60000,
  };
  
  // Pagination constants
  export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 12,
    BLOG_PAGE_SIZE: 9,
    MAX_PAGE_SIZE: 100,
  };
  
  // Date and time constants
  export const DATE_FORMATS = {
    DISPLAY: 'MMM DD, YYYY',
    DISPLAY_WITH_TIME: 'MMM DD, YYYY hh:mm A',
    API: 'YYYY-MM-DD',
    TIME: 'HH:mm',
  };
  
  // Currency and localization
  export const CURRENCY = {
    DEFAULT: 'USD',
    SYMBOL: '$',
    LOCALE: 'en-US',
  };
  
  export const LOCALE = {
    DEFAULT: 'en-US',
    DATE_FORMAT: 'en-US',
    CURRENCY: 'USD',
  };
  
  // File upload constants
  export const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    MAX_IMAGES_PER_PROPERTY: 20,
    MAX_FILES_PER_UPLOAD: 5,
  };
  
  // Social media links
  export const SOCIAL_MEDIA = {
    FACEBOOK: 'https://facebook.com/estatepro',
    TWITTER: 'https://twitter.com/estatepro',
    INSTAGRAM: 'https://instagram.com/estatepro',
    LINKEDIN: 'https://linkedin.com/company/estatepro',
    YOUTUBE: 'https://youtube.com/estatepro',
  };
  
  // Feature flags
  export const FEATURE_FLAGS = {
    ENABLE_BLOG: true,
    ENABLE_ADMIN_PANEL: true,
    ENABLE_PROPERTY_COMPARISON: true,
    ENABLE_SAVED_SEARCHES: true,
    ENABLE_EMAIL_NOTIFICATIONS: true,
    ENABLE_SMS_NOTIFICATIONS: false,
    ENABLE_CHAT: true,
  };
  
  // Error messages
  export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'Please log in to continue.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UPLOAD_ERROR: 'Failed to upload file. Please try again.',
    DEFAULT: 'An unexpected error occurred. Please try again.',
  };
  
  // Success messages
  export const SUCCESS_MESSAGES = {
    PROPERTY_CREATED: 'Property listed successfully!',
    PROPERTY_UPDATED: 'Property updated successfully!',
    PROPERTY_DELETED: 'Property deleted successfully!',
    CONTACT_SENT: 'Your message has been sent successfully!',
    APPOINTMENT_SCHEDULED: 'Appointment scheduled successfully!',
    NEWSLETTER_SUBSCRIBED: 'Successfully subscribed to newsletter!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    PASSWORD_CHANGED: 'Password changed successfully!',
};
  

export const FIREBASE_CONFIG = {
  // These will come from environment variables
  API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
};

// User Roles and Permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  BROKER: 'broker',
  AGENT: 'agent',
  USER: 'user',
  GUEST: 'guest',
};

export const PERMISSIONS = {
  // Basic CRUD
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  
  // User Management
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  
  // Property Management
  MANAGE_PROPERTIES: 'manage_properties',
  MANAGE_OWN_PROPERTIES: 'manage_own_properties',
  APPROVE_PROPERTIES: 'approve_properties',
  FEATURE_PROPERTIES: 'feature_properties',
  
  // Content Management
  MANAGE_BLOG: 'manage_blog',
  MANAGE_MEDIA: 'manage_media',
  MANAGE_SETTINGS: 'manage_settings',
  
  // Business Operations
  MANAGE_APPOINTMENTS: 'manage_appointments',
  MANAGE_CONTACTS: 'manage_contacts',
  VIEW_ANALYTICS: 'view_analytics',
};

// Firebase Collections (Firestore)
export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  PROPERTIES: 'properties',
  BLOG_POSTS: 'blogPosts',
  CONTACTS: 'contacts',
  APPOINTMENTS: 'appointments',
  FAVORITES: 'favorites',
  MEDIA: 'media',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics',
};

// Firebase Storage Paths
export const STORAGE_PATHS = {
  PROPERTY_IMAGES: 'property-images',
  PROPERTY_DOCUMENTS: 'property-documents',
  USER_AVATARS: 'user-avatars',
  BLOG_IMAGES: 'blog-images',
  SITE_ASSETS: 'site-assets',
  TEMP_UPLOADS: 'temp-uploads',
};

// Firebase Security Rules (for reference)
export const FIREBASE_RULES = {
  // User access levels
  PUBLIC_READ: 'public_read',
  AUTHENTICATED_READ: 'authenticated_read',
  OWNER_READ: 'owner_read',
  ADMIN_READ: 'admin_read',
  
  // Write permissions
  OWNER_WRITE: 'owner_write',
  ADMIN_WRITE: 'admin_write',
  AGENT_WRITE: 'agent_write',
};

// Firebase Error Codes (for easy reference)
export const FIREBASE_ERRORS = {
  // Auth Errors
  AUTH_INVALID_EMAIL: 'auth/invalid-email',
  AUTH_USER_DISABLED: 'auth/user-disabled',
  AUTH_USER_NOT_FOUND: 'auth/user-not-found',
  AUTH_WRONG_PASSWORD: 'auth/wrong-password',
  AUTH_EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  AUTH_WEAK_PASSWORD: 'auth/weak-password',
  AUTH_NETWORK_FAILED: 'auth/network-request-failed',
  AUTH_TOO_MANY_REQUESTS: 'auth/too-many-requests',
  
  // Firestore Errors
  FIRESTORE_PERMISSION_DENIED: 'permission-denied',
  FIRESTORE_NOT_FOUND: 'not-found',
  FIRESTORE_UNAVAILABLE: 'unavailable',
};

// Real-time Database Paths (if using RTDB)
export const REALTIME_PATHS = {
  ONLINE_USERS: 'onlineUsers',
  NOTIFICATIONS: 'notifications',
  CHAT_MESSAGES: 'chatMessages',
  ACTIVITY_LOGS: 'activityLogs',
};

// Firebase Query Constants
export const FIRESTORE_QUERIES = {
  // Pagination limits
  PROPERTIES_PER_PAGE: 12,
  BLOG_POSTS_PER_PAGE: 9,
  USERS_PER_PAGE: 50,
  
  // Default ordering
  PROPERTIES_ORDER_BY: 'createdAt',
  BLOG_ORDER_BY: 'publishedAt',
  USERS_ORDER_BY: 'displayName',
};

// Cache and Performance
export const FIREBASE_CACHE = {
  DEFAULT_CACHE_SIZE: 100,
  MAX_CACHE_AGE: 5 * 60 * 1000, // 5 minutes
  PERSISTENCE_ENABLED: true,
};




  
  export default {
    APP_CONFIG,
    PROPERTY_TYPES,
    PROPERTY_STATUS,
    PROPERTY_FEATURES,
    PROPERTY_SORT_OPTIONS,
    BLOG_POST_STATUS,
    BLOG_CATEGORIES,
    VALIDATION,
    API_CONFIG,
    PAGINATION,
    DATE_FORMATS,
    CURRENCY,
    LOCALE,
    FILE_UPLOAD,
    SOCIAL_MEDIA,
    FEATURE_FLAGS,
    ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FIREBASE_CONFIG,
  USER_ROLES,
  PERMISSIONS,
  FIRESTORE_COLLECTIONS,
  STORAGE_PATHS,
  FIREBASE_RULES,
  FIREBASE_ERRORS,
  REALTIME_PATHS,
  FIRESTORE_QUERIES,
  FIREBASE_CACHE,
  };