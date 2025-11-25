import { CURRENCY, PROPERTY_TYPES, PROPERTY_STATUS } from './constants';

// Currency formatting
export const formatPrice = (price, currency = CURRENCY.DEFAULT) => {
  if (price === null || price === undefined) return 'Price on request';
  
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return formatter.format(Number(price));
  } catch (error) {
    console.error('Price formatting error:', error);
    return `${CURRENCY.SYMBOL}${Number(price).toLocaleString()}`;
  }
};

export const formatPriceRange = (minPrice, maxPrice, currency = CURRENCY.DEFAULT) => {
  if (!minPrice && !maxPrice) return 'Price on request';
  if (!minPrice) return `Up to ${formatPrice(maxPrice, currency)}`;
  if (!maxPrice) return `From ${formatPrice(minPrice, currency)}`;
  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`;
};

export const formatPricePerSqFt = (price, area, currency = CURRENCY.DEFAULT) => {
  if (!price || !area) return '';
  const pricePerSqFt = Number(price) / Number(area);
  return `${formatPrice(pricePerSqFt, currency)}/sq ft`;
};

// Property-specific formatting
export const formatPropertyType = (type) => {
  const typeMap = {
    [PROPERTY_TYPES.HOUSE]: 'House',
    [PROPERTY_TYPES.APARTMENT]: 'Apartment',
    [PROPERTY_TYPES.CONDO]: 'Condo',
    [PROPERTY_TYPES.VILLA]: 'Villa',
    [PROPERTY_TYPES.COMMERCIAL]: 'Commercial',
    [PROPERTY_TYPES.LAND]: 'Land',
    [PROPERTY_TYPES.OTHER]: 'Other',
  };
  
  return typeMap[type] || type?.charAt(0).toUpperCase() + type?.slice(1) || 'Property';
};

export const formatPropertyStatus = (status) => {
  const statusMap = {
    [PROPERTY_STATUS.FOR_SALE]: 'For Sale',
    [PROPERTY_STATUS.FOR_RENT]: 'For Rent',
    [PROPERTY_STATUS.SOLD]: 'Sold',
    [PROPERTY_STATUS.RENTED]: 'Rented',
    [PROPERTY_STATUS.PENDING]: 'Pending',
  };
  
  return statusMap[status] || status?.charAt(0).toUpperCase() + status?.slice(1) || 'Available';
};

export const formatBedrooms = (count) => {
  if (!count && count !== 0) return '';
  return `${count} Bedroom${count !== 1 ? 's' : ''}`;
};

export const formatBathrooms = (count) => {
  if (!count && count !== 0) return '';
  return `${count} Bathroom${count !== 1 ? 's' : ''}`;
};

export const formatArea = (area, unit = 'sq ft') => {
  if (!area) return '';
  
  const areaNumber = Number(area);
  if (areaNumber >= 10000) {
    const acres = (areaNumber / 43560).toFixed(2);
    return `${acres} acre${acres !== '1.00' ? 's' : ''}`;
  }
  
  return `${areaNumber.toLocaleString()} ${unit}`;
};

export const formatYearBuilt = (year) => {
  if (!year) return '';
  return `Built in ${year}`;
};

// Address formatting
export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zipCode) parts.push(address.zipCode);
  if (address.country && address.country !== 'US') parts.push(address.country);
  
  return parts.join(', ');
};

export const formatShortAddress = (address) => {
  if (!address) return '';
  
  const parts = [];
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  
  return parts.join(', ');
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // US phone number formatting
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if format doesn't match
  return phoneNumber;
};

// Social media formatting
export const formatSocialMediaHandle = (platform, handle) => {
  if (!handle) return '';
  
  const platformFormats = {
    twitter: `@${handle.replace('@', '')}`,
    instagram: `@${handle.replace('@', '')}`,
    facebook: handle,
    linkedin: handle,
  };
  
  return platformFormats[platform] || handle;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  if (i === 0) return `${bytes} ${sizes[i]}`;
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Date and time formatting for display
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Date input formatting error:', error);
    return '';
  }
};

export const formatDateTimeForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error('DateTime input formatting error:', error);
    return '';
  }
};

// Number formatting with units
export const formatWithUnit = (value, unit, decimals = 0) => {
  if (value === null || value === undefined) return '';
  
  const numberValue = Number(value);
  if (isNaN(numberValue)) return '';
  
  return `${numberValue.toFixed(decimals)} ${unit}`;
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '';
  
  const numberValue = Number(value);
  if (isNaN(numberValue)) return '';
  
  return `${numberValue.toFixed(decimals)}%`;
};

// Mortgage calculation formatting
export const formatMonthlyPayment = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) {
    return formatPrice(principal / numberOfPayments);
  }
  
  const monthlyPayment = 
    principal * 
    monthlyRate * 
    Math.pow(1 + monthlyRate, numberOfPayments) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return formatPrice(Math.round(monthlyPayment));
};

// Distance formatting
export const formatDistance = (meters, unit = 'mi') => {
  if (!meters) return '';
  
  if (unit === 'mi') {
    const miles = meters * 0.000621371;
    return `${miles.toFixed(1)} mi`;
  } else {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)} km`;
  }
};

// Rating formatting
export const formatRating = (rating, max = 5) => {
  if (!rating) return 'No ratings';
  
  return `${Number(rating).toFixed(1)} / ${max}`;
};

// Compact number formatting (1K, 1M, etc.)
export const formatCompactNumber = (number) => {
  if (!number) return '0';
  
  const num = Number(number);
  if (isNaN(num)) return '0';
  
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return (num / 1000000).toFixed(1) + 'M';
  }
};

// Duration formatting
export const formatDuration = (minutes) => {
  if (!minutes) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

// URL formatting
export const formatUrlForDisplay = (url) => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// Text formatting for SEO
export const formatForMetaDescription = (text, maxLength = 160) => {
  if (!text) return '';
  
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // Truncate to max length
  if (cleanText.length <= maxLength) return cleanText;
  
  return cleanText.substring(0, maxLength - 3) + '...';
};

// Currency conversion formatting (simplified)
export const formatConvertedPrice = (price, fromCurrency, toCurrency, rate) => {
  if (!price || !rate) return formatPrice(price, fromCurrency);
  
  const convertedPrice = Number(price) * Number(rate);
  return formatPrice(convertedPrice, toCurrency);
};

export default {
  formatPrice,
  formatPriceRange,
  formatPricePerSqFt,
  formatPropertyType,
  formatPropertyStatus,
  formatBedrooms,
  formatBathrooms,
  formatArea,
  formatYearBuilt,
  formatAddress,
  formatShortAddress,
  formatPhoneNumber,
  formatSocialMediaHandle,
  formatFileSize,
  formatDateForInput,
  formatDateTimeForInput,
  formatWithUnit,
  formatPercentage,
  formatMonthlyPayment,
  formatDistance,
  formatRating,
  formatCompactNumber,
  formatDuration,
  formatUrlForDisplay,
  formatForMetaDescription,
  formatConvertedPrice,
};