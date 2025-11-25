import { DATE_FORMATS, CURRENCY, PROPERTY_TYPES, PROPERTY_STATUS } from './constants';

// Date and time helpers
export const formatDate = (dateString, format = DATE_FORMATS.DISPLAY) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(format === DATE_FORMATS.DISPLAY_WITH_TIME && {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    });

    return formatter.format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return formatDate(dateString);
  }
};

export const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

// Currency and number formatting
export const formatCurrency = (amount, currency = CURRENCY.DEFAULT, locale = CURRENCY.LOCALE) => {
  if (amount === null || amount === undefined) return '';
  
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return formatter.format(Number(amount));
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${CURRENCY.SYMBOL}${Number(amount).toLocaleString()}`;
  }
};

export const formatNumber = (number, locale = CURRENCY.LOCALE) => {
  if (number === null || number === undefined) return '';
  
  try {
    return Number(number).toLocaleString(locale);
  } catch (error) {
    console.error('Number formatting error:', error);
    return number.toString();
  }
};

export const formatArea = (area, unit = 'sq ft') => {
  if (!area) return '';
  return `${formatNumber(area)} ${unit}`;
};

// String manipulation
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const truncate = (str, length = 100, suffix = '...') => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length).trim() + suffix;
};

export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Property-specific helpers
export const getPropertyTypeLabel = (type) => {
  const typeMap = {
    [PROPERTY_TYPES.HOUSE]: 'House',
    [PROPERTY_TYPES.APARTMENT]: 'Apartment',
    [PROPERTY_TYPES.CONDO]: 'Condo',
    [PROPERTY_TYPES.VILLA]: 'Villa',
    [PROPERTY_TYPES.COMMERCIAL]: 'Commercial',
    [PROPERTY_TYPES.LAND]: 'Land',
    [PROPERTY_TYPES.OTHER]: 'Other',
  };
  
  return typeMap[type] || capitalize(type);
};

export const getPropertyStatusLabel = (status) => {
  const statusMap = {
    [PROPERTY_STATUS.FOR_SALE]: 'For Sale',
    [PROPERTY_STATUS.FOR_RENT]: 'For Rent',
    [PROPERTY_STATUS.SOLD]: 'Sold',
    [PROPERTY_STATUS.RENTED]: 'Rented',
    [PROPERTY_STATUS.PENDING]: 'Pending',
  };
  
  return statusMap[status] || capitalize(status);
};

export const getPropertyStatusColor = (status) => {
  const colorMap = {
    [PROPERTY_STATUS.FOR_SALE]: 'green',
    [PROPERTY_STATUS.FOR_RENT]: 'blue',
    [PROPERTY_STATUS.SOLD]: 'gray',
    [PROPERTY_STATUS.RENTED]: 'purple',
    [PROPERTY_STATUS.PENDING]: 'orange',
  };
  
  return colorMap[status] || 'gray';
};

export const calculateMortgage = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }
  
  const monthlyPayment = 
    principal * 
    monthlyRate * 
    Math.pow(1 + monthlyRate, numberOfPayments) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return Math.round(monthlyPayment);
};

// URL and routing helpers
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const parseQueryString = (search) => {
  const params = new URLSearchParams(search);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

export const getFullUrl = (path) => {
  const baseUrl = process.env.REACT_APP_BASE_URL || window.location.origin;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// File and media helpers
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const getFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const isValidImageType = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file, maxSize = 10 * 1024 * 1024) => {
  return file.size <= maxSize;
};

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanedPhone);
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Performance and optimization helpers
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Local storage helpers with error handling
export const safeLocalStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

export const handleFirebaseError = (error) => {
  if (typeof error === 'string') return error;
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.code) {
    // Firebase error codes to user-friendly messages
    const errorMap = {
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/requires-recent-login': 'Please log in again to perform this action',
      'auth/provider-already-linked': 'This account is already linked with another provider',
      'auth/invalid-credential': 'Invalid login credentials',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email',
    };
    
    return errorMap[error.code] || error.message;
  }
  
  return 'An unexpected error occurred';
};

// Enhanced error handler that works with both Firebase and traditional errors
export const handleError = (error, fallbackMessage = 'An unexpected error occurred') => {
  console.error('Application error:', error);
  
  // First try Firebase errors
  const firebaseError = handleFirebaseError(error);
  if (firebaseError !== 'An unexpected error occurred') {
    return firebaseError;
  }
  
  // Then try traditional API errors
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return fallbackMessage;
};

// Format user display name for Firebase users
export const formatDisplayName = (user) => {
  if (!user) return 'User';
  
  if (user.displayName) return user.displayName;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  return user.email?.split('@')[0] || 'User';
};

// Check if user can perform action (role-based permissions)
export const canPerformAction = (user, action) => {
  const rolePermissions = {
    admin: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_properties', 'manage_blog'],
    agent: ['create', 'read', 'update', 'manage_properties', 'manage_own_properties'],
    broker: ['create', 'read', 'update', 'delete', 'manage_properties', 'manage_agents'],
    user: ['read', 'update_own', 'create_own'],
    guest: ['read'],
  };
  
  const userRole = user?.role || 'guest';
  return rolePermissions[userRole]?.includes(action) || false;
};


// Firebase user role checker
export const hasRole = (user, role) => {
  return user?.role === role;
};

export const isAdmin = (user) => {
  return hasRole(user, 'admin') || hasRole(user, 'super_admin');
};

export const isAgent = (user) => {
  return hasRole(user, 'agent') || isAdmin(user);
};


export const canManageProperty = (user, property = null) => {
  if (!user) return false;
  
  // Admins can manage all properties
  if (isAdmin(user)) return true;
  
  // Brokers can manage all properties
  if (hasRole(user, 'broker')) return true;
  
  // Agents can manage properties they own or are assigned to
  if (hasRole(user, 'agent')) {
    if (!property) return true; // Can create new properties
    return property.agentId === user.uid || property.createdBy === user.uid;
  }
  
  // Users can only manage their own properties
  if (property) {
    return property.createdBy === user.uid;
  }
  
  return false;
};


// Firebase storage helpers
export const getFirebaseFileUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) return path;
  
  // For Firebase Storage paths, you might need to construct the URL
  // This depends on how you're storing files in Firebase
  return path;
};

export const firebaseTimestampToDate = (timestamp) => {
  if (!timestamp) return null;
  
  // Handle Firebase Timestamp objects
  if (timestamp.toDate) {
    return timestamp.toDate();
  }
  
  // Handle regular date strings/objects
  return new Date(timestamp);
};

export const dateToFirebaseTimestamp = (date) => {
  if (!date) return null;
  
  // In Firestore, you'd use serverTimestamp() for writes
  // This is just for creating compatible date objects
  return new Date(date);
};

// Real estate specific Firebase helpers
export const formatPropertyForFirebase = (propertyData, user) => {
  const now = new Date().toISOString();
  
  return {
    ...propertyData,
    createdAt: propertyData.createdAt || now,
    updatedAt: now,
    createdBy: user?.uid,
    status: propertyData.status || 'draft',
    // Ensure numbers are stored as numbers
    price: Number(propertyData.price) || 0,
    bedrooms: Number(propertyData.bedrooms) || 0,
    bathrooms: Number(propertyData.bathrooms) || 0,
    area: Number(propertyData.area) || 0,
  };
};


export const parsePropertyFromFirebase = (firebaseData) => {
  if (!firebaseData) return null;
  
  // Convert Firebase Timestamps to Date objects
  const data = { ...firebaseData };
  
  if (data.createdAt && typeof data.createdAt.toDate === 'function') {
    data.createdAt = data.createdAt.toDate();
  }
  
  if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
    data.updatedAt = data.updatedAt.toDate();
  }
  
  return data;
};



export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isServerError = (error) => {
  return error.response && error.response.status >= 500;
};

export const isClientError = (error) => {
  return error.response && error.response.status >= 400 && error.response.status < 500;
};



export default {
  formatDate,
  formatRelativeTime,
  isValidDate,
  formatCurrency,
  formatNumber,
  formatArea,
  capitalize,
  titleCase,
  truncate,
  slugify,
  getPropertyTypeLabel,
  getPropertyStatusLabel,
  getPropertyStatusColor,
  calculateMortgage,
  buildQueryString,
  parseQueryString,
  getFullUrl,
  getFileExtension,
  getFileSize,
  isValidImageType,
  isValidFileSize,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  debounce,
  throttle,
  safeLocalStorage,
  handleError,
  isNetworkError,
  isServerError,
  isClientError,

   // New Firebase exports
   handleFirebaseError,
   formatDisplayName,
   canPerformAction,
   hasRole,
   isAdmin,
   isAgent,
   canManageProperty,
   getFirebaseFileUrl,
   firebaseTimestampToDate,
   dateToFirebaseTimestamp,
   formatPropertyForFirebase,
   parsePropertyFromFirebase,
};