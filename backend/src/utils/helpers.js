import { format, parseISO } from 'date-fns';

// Format currency
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

// Format date and time
export const formatDateTime = (date, dateFormat = 'MMM dd, yyyy', timeFormat = 'hh:mm a') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const formattedDate = format(dateObj, dateFormat);
  const formattedTime = format(dateObj, timeFormat);
  
  return `${formattedDate} at ${formattedTime}`;
};

// Generate slug from string
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Truncate text
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Generate random string
export const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic)
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone);
};

// Sanitize HTML
export const sanitizeHTML = (html) => {
  if (!html) return '';
  
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
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

// Parse query parameters
export const parseQueryParams = (query) => {
  const params = {};
  
  for (const [key, value] of Object.entries(query)) {
    if (value === 'true') params[key] = true;
    else if (value === 'false') params[key] = false;
    else if (!isNaN(value) && value !== '') params[key] = Number(value);
    else if (value) params[key] = value;
  }
  
  return params;
};

// Calculate pagination
export const calculatePagination = (page, limit, total) => {
  const currentPage = Math.max(1, parseInt(page) || 1);
  const pageSize = Math.max(1, parseInt(limit) || 10);
  const totalPages = Math.ceil(total / pageSize);
  const skip = (currentPage - 1) * pageSize;
  
  return {
    currentPage,
    pageSize,
    totalPages,
    skip,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

// Generate file name with timestamp
export const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");
  const slugifiedName = generateSlug(nameWithoutExtension);
  
  return `${slugifiedName}-${timestamp}.${extension}`;
};