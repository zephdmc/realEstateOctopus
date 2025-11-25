// Environment-based configuration
const getEnvVar = (key, defaultValue = '') => {
    return process.env[key] || defaultValue;
  };
  
  // Application configuration
  export const APP_CONFIG = {
    // Basic app info
    NAME: getEnvVar('REACT_APP_NAME', 'EstatePro'),
    VERSION: getEnvVar('REACT_APP_VERSION', '1.0.0'),
    DESCRIPTION: getEnvVar('REACT_APP_DESCRIPTION', 'Premium Real Estate Platform'),
    
    // URLs
    BASE_URL: getEnvVar('REACT_APP_BASE_URL', window.location.origin),
    API_URL: getEnvVar('REACT_APP_API_URL', 'https://api.estatepro.com/v1'),
    STRAPI_URL: getEnvVar('REACT_APP_STRAPI_URL', 'https://cms.estatepro.com'),
    
    // Contact information
    SUPPORT_EMAIL: getEnvVar('REACT_APP_SUPPORT_EMAIL', 'support@estatepro.com'),
    SUPPORT_PHONE: getEnvVar('REACT_APP_SUPPORT_PHONE', '+1 (555) 123-4567'),
    CONTACT_EMAIL: getEnvVar('REACT_APP_CONTACT_EMAIL', 'info@estatepro.com'),
    
    // Business information
    COMPANY_NAME: getEnvVar('REACT_APP_COMPANY_NAME', 'EstatePro Real Estate'),
    COMPANY_ADDRESS: getEnvVar('REACT_APP_COMPANY_ADDRESS', '123 Main Street, New York, NY 10001'),
    OFFICE_HOURS: getEnvVar('REACT_APP_OFFICE_HOURS', 'Mon-Fri: 9:00 AM - 6:00 PM'),
  };
  
  // API configuration
  export const API_CONFIG = {
    // Timeouts
    TIMEOUT: parseInt(getEnvVar('REACT_APP_API_TIMEOUT', '30000')),
    UPLOAD_TIMEOUT: parseInt(getEnvVar('REACT_APP_UPLOAD_TIMEOUT', '60000')),
    
    // Retry configuration
    RETRY_ATTEMPTS: parseInt(getEnvVar('REACT_APP_RETRY_ATTEMPTS', '3')),
    RETRY_DELAY: parseInt(getEnvVar('REACT_APP_RETRY_DELAY', '1000')),
    
    // Cache configuration
    CACHE_DURATION: parseInt(getEnvVar('REACT_APP_CACHE_DURATION', '300000')), // 5 minutes
  };
  
  // Third-party services configuration
  export const SERVICES_CONFIG = {
    // Cloudinary
    CLOUDINARY: {
      CLOUD_NAME: getEnvVar('REACT_APP_CLOUDINARY_CLOUD_NAME'),
      UPLOAD_PRESET: getEnvVar('REACT_APP_CLOUDINARY_UPLOAD_PRESET'),
      API_KEY: getEnvVar('REACT_APP_CLOUDINARY_API_KEY'),
    },
    
    // Google Services
    GOOGLE: {
      MAPS_API_KEY: getEnvVar('REACT_APP_GOOGLE_MAPS_API_KEY'),
      ANALYTICS_ID: getEnvVar('REACT_APP_GOOGLE_ANALYTICS_ID'),
      TAG_MANAGER_ID: getEnvVar('REACT_APP_GOOGLE_TAG_MANAGER_ID'),
      SHEETS_API_URL: getEnvVar('REACT_APP_GOOGLE_SHEETS_API_URL'),
    },
    
    // Strapi CMS
    STRAPI: {
      API_TOKEN: getEnvVar('REACT_APP_STRAPI_API_TOKEN'),
    },
  };
  
  // Feature flags
  export const FEATURE_FLAGS = {
    // Core features
    ENABLE_BLOG: getEnvVar('REACT_APP_ENABLE_BLOG', 'true') === 'true',
    ENABLE_ADMIN_PANEL: getEnvVar('REACT_APP_ENABLE_ADMIN_PANEL', 'true') === 'true',
    ENABLE_USER_REGISTRATION: getEnvVar('REACT_APP_ENABLE_USER_REGISTRATION', 'true') === 'true',
    
    // Property features
    ENABLE_PROPERTY_COMPARISON: getEnvVar('REACT_APP_ENABLE_PROPERTY_COMPARISON', 'true') === 'true',
    ENABLE_SAVED_SEARCHES: getEnvVar('REACT_APP_ENABLE_SAVED_SEARCHES', 'true') === 'true',
    ENABLE_PROPERTY_ALERTS: getEnvVar('REACT_APP_ENABLE_PROPERTY_ALERTS', 'true') === 'true',
    
    // Communication features
    ENABLE_EMAIL_NOTIFICATIONS: getEnvVar('REACT_APP_ENABLE_EMAIL_NOTIFICATIONS', 'true') === 'true',
    ENABLE_SMS_NOTIFICATIONS: getEnvVar('REACT_APP_ENABLE_SMS_NOTIFICATIONS', 'false') === 'true',
    ENABLE_CHAT: getEnvVar('REACT_APP_ENABLE_CHAT', 'true') === 'true',
    
    // Advanced features
    ENABLE_MORTGAGE_CALCULATOR: getEnvVar('REACT_APP_ENABLE_MORTGAGE_CALCULATOR', 'true') === 'true',
    ENABLE_VIRTUAL_TOURS: getEnvVar('REACT_APP_ENABLE_VIRTUAL_TOURS', 'true') === 'true',
    ENABLE_AI_RECOMMENDATIONS: getEnvVar('REACT_APP_ENABLE_AI_RECOMMENDATIONS', 'false') === 'true',
  };
  
  // UI and theme configuration
  export const UI_CONFIG = {
    // Theme
    THEME: {
      PRIMARY_COLOR: getEnvVar('REACT_APP_PRIMARY_COLOR', '#2563eb'),
      SECONDARY_COLOR: getEnvVar('REACT_APP_SECONDARY_COLOR', '#64748b'),
      ACCENT_COLOR: getEnvVar('REACT_APP_ACCENT_COLOR', '#f59e0b'),
    },
    
    // Layout
    LAYOUT: {
      CONTAINER_MAX_WIDTH: getEnvVar('REACT_APP_CONTAINER_MAX_WIDTH', '1280px'),
      SIDEBAR_WIDTH: getEnvVar('REACT_APP_SIDEBAR_WIDTH', '280px'),
      HEADER_HEIGHT: getEnvVar('REACT_APP_HEADER_HEIGHT', '80px'),
    },
    
    // Responsive breakpoints
    BREAKPOINTS: {
      SM: '640px',
      MD: '768px',
      LG: '1024px',
      XL: '1280px',
      '2XL': '1536px',
    },
  };
  
  // Business rules and limits
  export const BUSINESS_RULES = {
    // Property limits
    PROPERTY: {
      MAX_IMAGES: parseInt(getEnvVar('REACT_APP_MAX_PROPERTY_IMAGES', '20')),
      MAX_TITLE_LENGTH: parseInt(getEnvVar('REACT_APP_MAX_TITLE_LENGTH', '100')),
      MAX_DESCRIPTION_LENGTH: parseInt(getEnvVar('REACT_APP_MAX_DESCRIPTION_LENGTH', '5000')),
      MIN_PRICE: parseInt(getEnvVar('REACT_APP_MIN_PROPERTY_PRICE', '0')),
      MAX_PRICE: parseInt(getEnvVar('REACT_APP_MAX_PROPERTY_PRICE', '100000000')),
    },
    
    // User limits
    USER: {
      MAX_SAVED_PROPERTIES: parseInt(getEnvVar('REACT_APP_MAX_SAVED_PROPERTIES', '50')),
      MAX_SAVED_SEARCHES: parseInt(getEnvVar('REACT_APP_MAX_SAVED_SEARCHES', '10')),
      SESSION_TIMEOUT: parseInt(getEnvVar('REACT_APP_SESSION_TIMEOUT', '86400000')), // 24 hours
    },
    
    // File upload limits
    UPLOAD: {
      MAX_FILE_SIZE: parseInt(getEnvVar('REACT_APP_MAX_FILE_SIZE', '10485760')), // 10MB
      MAX_TOTAL_SIZE: parseInt(getEnvVar('REACT_APP_MAX_TOTAL_UPLOAD_SIZE', '104857600')), // 100MB
      ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
    },
  };
  
  // Analytics and tracking configuration
  export const ANALYTICS_CONFIG = {
    ENABLED: getEnvVar('REACT_APP_ANALYTICS_ENABLED', 'true') === 'true',
    PROVIDERS: {
      GOOGLE_ANALYTICS: getEnvVar('REACT_APP_GOOGLE_ANALYTICS_ID') ? true : false,
      FACEBOOK_PIXEL: getEnvVar('REACT_APP_FACEBOOK_PIXEL_ID') ? true : false,
      HOTJAR: getEnvVar('REACT_APP_HOTJAR_ID') ? true : false,
    },
  };
  
  // Security configuration
  export const SECURITY_CONFIG = {
    // Password requirements
    PASSWORD: {
      MIN_LENGTH: parseInt(getEnvVar('REACT_APP_PASSWORD_MIN_LENGTH', '8')),
      REQUIRE_UPPERCASE: getEnvVar('REACT_APP_PASSWORD_REQUIRE_UPPERCASE', 'true') === 'true',
      REQUIRE_LOWERCASE: getEnvVar('REACT_APP_PASSWORD_REQUIRE_LOWERCASE', 'true') === 'true',
      REQUIRE_NUMBERS: getEnvVar('REACT_APP_PASSWORD_REQUIRE_NUMBERS', 'true') === 'true',
      REQUIRE_SYMBOLS: getEnvVar('REACT_APP_PASSWORD_REQUIRE_SYMBOLS', 'true') === 'true',
    },
    
    // Rate limiting
    RATE_LIMITING: {
      REQUESTS_PER_MINUTE: parseInt(getEnvVar('REACT_APP_RATE_LIMIT_REQUESTS', '60')),
      UPLOADS_PER_HOUR: parseInt(getEnvVar('REACT_APP_RATE_LIMIT_UPLOADS', '10')),
    },
  };
  
  // Internationalization configuration
  export const I18N_CONFIG = {
    DEFAULT_LOCALE: getEnvVar('REACT_APP_DEFAULT_LOCALE', 'en-US'),
    SUPPORTED_LOCALES: ['en-US', 'es-ES', 'fr-FR', 'de-DE'],
    CURRENCY: getEnvVar('REACT_APP_DEFAULT_CURRENCY', 'USD'),
    TIMEZONE: getEnvVar('REACT_APP_DEFAULT_TIMEZONE', 'America/New_York'),
  };
  
  // Environment detection
  export const isDevelopment = process.env.NODE_ENV === 'development';
  export const isProduction = process.env.NODE_ENV === 'production';
  export const isTest = process.env.NODE_ENV === 'test';
  
  // Configuration validation
  export const validateConfig = () => {
    const requiredVars = [
      'REACT_APP_API_URL',
      'REACT_APP_STRAPI_URL',
      'REACT_APP_STRAPI_API_TOKEN',
    ];
  
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
    if (missingVars.length > 0 && isProduction) {
      console.error('Missing required environment variables:', missingVars);
      throw new Error('Application configuration is incomplete');
    }
  
    if (missingVars.length > 0) {
      console.warn('Missing environment variables (development):', missingVars);
    }
  };
  
  // Export combined configuration
  export default {
    APP_CONFIG,
    API_CONFIG,
    SERVICES_CONFIG,
    FEATURE_FLAGS,
    UI_CONFIG,
    BUSINESS_RULES,
    ANALYTICS_CONFIG,
    SECURITY_CONFIG,
    I18N_CONFIG,
    isDevelopment,
    isProduction,
    isTest,
    validateConfig,
  };