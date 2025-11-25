// Application constants
export const APP_CONSTANTS = {
    // Pagination
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  
    // File upload
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOC_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  
    // Authentication
    JWT_EXPIRE: '30d',
    PASSWORD_RESET_EXPIRE: 10 * 60 * 1000, // 10 minutes
    EMAIL_VERIFICATION_EXPIRE: 24 * 60 * 60 * 1000, // 24 hours
  
    // Rate limiting
    RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 100,
    
    // Cache
    CACHE_TTL: 5 * 60, // 5 minutes
  };
  
  // Property constants
  export const PROPERTY_CONSTANTS = {
    TYPES: {
      HOUSE: 'house',
      APARTMENT: 'apartment',
      CONDO: 'condo',
      VILLA: 'villa',
      TOWNHOUSE: 'townhouse',
      LAND: 'land',
      COMMERCIAL: 'commercial'
    },
  
    STATUS: {
      FOR_SALE: 'for-sale',
      FOR_RENT: 'for-rent',
      SOLD: 'sold',
      RENTED: 'rented'
    },
  
    AMENITIES: [
      'swimming-pool',
      'garden',
      'garage',
      'balcony',
      'fireplace',
      'air-conditioning',
      'heating',
      'security-system',
      'elevator',
      'gym',
      'parking',
      'furnished',
      'pet-friendly'
    ],
  
    CURRENCIES: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    AREA_UNITS: ['sqft', 'sqm']
  };
  
  // Blog constants
  export const BLOG_CONSTANTS = {
    STATUS: {
      DRAFT: 'draft',
      PUBLISHED: 'published',
      ARCHIVED: 'archived'
    },
  
    CATEGORIES: [
      'market-news',
      'home-improvement',
      'investment',
      'neighborhood',
      'design-tips',
      'mortgage',
      'legal',
      'lifestyle'
    ],
  
    READ_TIME_WORDS_PER_MINUTE: 200
  };
  
  // User constants
  export const USER_CONSTANTS = {
    ROLES: {
      USER: 'user',
      AGENT: 'agent',
      ADMIN: 'admin'
    },
  
    PROFILE: {
      SPECIALTIES: [
        'residential',
        'commercial',
        'luxury',
        'investment',
        'rental',
        'new-construction'
      ]
    }
  };
  
  // Contact constants
  export const CONTACT_CONSTANTS = {
    TYPES: {
      GENERAL: 'general',
      PROPERTY_INQUIRY: 'property-inquiry',
      SUPPORT: 'support',
      PARTNERSHIP: 'partnership'
    },
  
    STATUS: {
      NEW: 'new',
      READ: 'read',
      REPLIED: 'replied',
      CLOSED: 'closed'
    },
  
    PRIORITY: {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high'
    },
  
    SOURCES: {
      WEBSITE: 'website',
      PHONE: 'phone',
      EMAIL: 'email',
      REFERRAL: 'referral'
    }
  };
  
  // Appointment constants
  export const APPOINTMENT_CONSTANTS = {
    TYPES: {
      VIEWING: 'viewing',
      VALUATION: 'valuation',
      CONSULTATION: 'consultation',
      SIGNING: 'signing'
    },
  
    STATUS: {
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
      NO_SHOW: 'no-show'
    },
  
    DURATION: {
      DEFAULT: 60, // minutes
      MIN: 15,
      MAX: 240
    },
  
    TIME_SLOTS: [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
    ]
  };
  
  // Email constants
  export const EMAIL_CONSTANTS = {
    TEMPLATES: {
      CONTACT_CONFIRMATION: 'contact-confirmation',
      CONTACT_NOTIFICATION: 'contact-notification',
      APPOINTMENT_CONFIRMATION_CLIENT: 'appointment-confirmation-client',
      APPOINTMENT_NOTIFICATION_AGENT: 'appointment-notification-agent',
      APPOINTMENT_CANCELLATION: 'appointment-cancellation',
      PASSWORD_RESET: 'password-reset',
      EMAIL_VERIFICATION: 'email-verification'
    },
  
    SUBJECTS: {
      CONTACT_CONFIRMATION: 'Thank you for contacting EliteProperties',
      PASSWORD_RESET: 'Password Reset Request - EliteProperties',
      APPOINTMENT_CONFIRMATION: 'Appointment Confirmation - EliteProperties'
    }
  };
  
  // Error messages
  export const ERROR_MESSAGES = {
    // Authentication
    UNAUTHORIZED: 'Not authorized to access this route',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    ACCOUNT_DEACTIVATED: 'Account has been deactivated',
  
    // Validation
    VALIDATION_FAILED: 'Validation failed',
    INVALID_EMAIL: 'Please provide a valid email',
    INVALID_PASSWORD: 'Password must be at least 6 characters long and contain uppercase, lowercase, and number',
  
    // Resources
    PROPERTY_NOT_FOUND: 'Property not found',
    BLOG_NOT_FOUND: 'Blog post not found',
    CONTACT_NOT_FOUND: 'Contact message not found',
    APPOINTMENT_NOT_FOUND: 'Appointment not found',
    USER_NOT_FOUND: 'User not found',
  
    // File upload
    FILE_TOO_LARGE: 'File too large. Maximum size is 10MB.',
    INVALID_FILE_TYPE: 'Invalid file type. Only images and documents are allowed.',
  
    // General
    INTERNAL_SERVER_ERROR: 'Internal server error',
    RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later.'
  };
  
  // Success messages
  export const SUCCESS_MESSAGES = {
    // General
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
  
    // Authentication
    REGISTER_SUCCESS: 'Registration successful',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    PASSWORD_RESET_SENT: 'Password reset email sent',
    PASSWORD_UPDATED: 'Password updated successfully',
    EMAIL_VERIFIED: 'Email verified successfully',
  
    // Contact
    CONTACT_CREATED: 'Thank you for your message. We will get back to you soon.',
  
    // Appointment
    APPOINTMENT_CREATED: 'Appointment scheduled successfully. Confirmation emails have been sent.',
    APPOINTMENT_CANCELLED: 'Appointment cancelled successfully'
  };
  
  export default {
    APP_CONSTANTS,
    PROPERTY_CONSTANTS,
    BLOG_CONSTANTS,
    USER_CONSTANTS,
    CONTACT_CONSTANTS,
    APPOINTMENT_CONSTANTS,
    EMAIL_CONSTANTS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
  };