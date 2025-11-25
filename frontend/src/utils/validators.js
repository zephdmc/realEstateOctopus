import { VALIDATION } from './constants';

// Base validation function
const createValidator = (validateFn, message) => {
  return (value) => {
    const result = validateFn(value);
    return {
      isValid: result === true || result === undefined,
      message: typeof result === 'string' ? result : message,
    };
  };
};

// Required field validation
export const required = createValidator(
  (value) => {
    if (value === null || value === undefined || value === '') {
      return false;
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return false;
    }
    
    return true;
  },
  'This field is required'
);

// Email validation
export const email = createValidator(
  (value) => {
    if (!value) return true; // Skip if empty (use with required if needed)
    return VALIDATION.EMAIL.REGEX.test(value);
  },
  VALIDATION.EMAIL.MESSAGE
);

// Phone number validation
export const phone = createValidator(
  (value) => {
    if (!value) return true;
    const cleanedPhone = value.replace(/[\s\-\(\)]/g, '');
    return VALIDATION.PHONE.REGEX.test(cleanedPhone);
  },
  VALIDATION.PHONE.MESSAGE
);

// Password validation
export const password = createValidator(
  (value) => {
    if (!value) return true;
    
    if (value.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      return `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`;
    }
    
    if (!VALIDATION.PASSWORD.REGEX.test(value)) {
      return VALIDATION.PASSWORD.MESSAGE;
    }
    
    return true;
  },
  VALIDATION.PASSWORD.MESSAGE
);

// Minimum length validation
export const minLength = (min) => 
  createValidator(
    (value) => {
      if (!value) return true;
      return value.length >= min;
    },
    `Must be at least ${min} characters`
  );

// Maximum length validation
export const maxLength = (max) => 
  createValidator(
    (value) => {
      if (!value) return true;
      return value.length <= max;
    },
    `Must be no more than ${max} characters`
  );

// Exact length validation
export const exactLength = (length) => 
  createValidator(
    (value) => {
      if (!value) return true;
      return value.length === length;
    },
    `Must be exactly ${length} characters`
  );

// Number validation
export const number = createValidator(
  (value) => {
    if (!value) return true;
    return !isNaN(Number(value));
  },
  'Must be a valid number'
);

// Minimum value validation
export const minValue = (min) => 
  createValidator(
    (value) => {
      if (!value) return true;
      return Number(value) >= min;
    },
    `Must be at least ${min}`
  );

// Maximum value validation
export const maxValue = (max) => 
  createValidator(
    (value) => {
      if (!value) return true;
      return Number(value) <= max;
    },
    `Must be no more than ${max}`
  );

// URL validation
export const url = createValidator(
  (value) => {
    if (!value) return true;
    
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  'Must be a valid URL'
);

// File type validation
export const fileType = (allowedTypes) => 
  createValidator(
    (file) => {
      if (!file) return true;
      return allowedTypes.includes(file.type);
    },
    `File type must be one of: ${allowedTypes.join(', ')}`
  );

// File size validation
export const fileSize = (maxSize) => 
  createValidator(
    (file) => {
      if (!file) return true;
      return file.size <= maxSize;
    },
    `File size must be less than ${maxSize / 1024 / 1024}MB`
  );

// Match field validation (for password confirmation, etc.)
export const match = (fieldName, fieldValue) => 
  createValidator(
    (value) => {
      return value === fieldValue;
    },
    `Must match ${fieldName}`
  );

// Custom regex validation
export const pattern = (regex, message) => 
  createValidator(
    (value) => {
      if (!value) return true;
      return regex.test(value);
    },
    message
  );

// Composite validators for common use cases
export const validators = {
  // Contact form validation
  contact: {
    name: [required, minLength(2), maxLength(50)],
    email: [required, email],
    phone: [phone],
    subject: [required, minLength(5), maxLength(100)],
    message: [required, minLength(10), maxLength(1000)],
  },

  // Property form validation
  property: {
    title: [required, minLength(5), maxLength(100)],
    description: [required, minLength(50), maxLength(5000)],
    price: [required, number, minValue(0)],
    area: [required, number, minValue(0)],
    bedrooms: [required, number, minValue(0), maxValue(20)],
    bathrooms: [required, number, minValue(0), maxValue(20)],
    location: {
      address: [required, minLength(5)],
      city: [required],
      state: [required],
      zipCode: [required],
    },
  },

  // User registration validation
  registration: {
    name: [required, minLength(2), maxLength(50)],
    email: [required, email],
    password: [required, password],
    agreeToTerms: [required],
  },

  // Login validation
  login: {
    email: [required, email],
    password: [required],
  },

  // Appointment form validation
  appointment: {
    name: [required, minLength(2), maxLength(50)],
    email: [required, email],
    phone: [required, phone],
    preferredDate: [required],
    preferredTime: [required],
  },
};

// Validation helper functions
export const validateField = (value, validators) => {
  if (!validators || !Array.isArray(validators)) {
    return { isValid: true };
  }

  for (const validator of validators) {
    const result = validator(value);
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true };
};

export const validateForm = (values, formValidators) => {
  const errors = {};

  Object.keys(formValidators).forEach(field => {
    const fieldValidators = formValidators[field];
    
    if (Array.isArray(fieldValidators)) {
      // Simple field validation
      const result = validateField(values[field], fieldValidators);
      if (!result.isValid) {
        errors[field] = result.message;
      }
    } else if (typeof fieldValidators === 'object') {
      // Nested object validation (e.g., location.address)
      const nestedErrors = validateForm(values[field] || {}, fieldValidators);
      if (Object.keys(nestedErrors).length > 0) {
        errors[field] = nestedErrors;
      }
    }
  });

  return errors;
};

export const isFormValid = (errors) => {
  if (!errors || typeof errors !== 'object') {
    return true;
  }

  // Recursively check for any errors
  const hasErrors = Object.keys(errors).some(key => {
    if (typeof errors[key] === 'string') {
      return true; // Found an error message
    }
    if (typeof errors[key] === 'object') {
      return !isFormValid(errors[key]); // Recursively check nested errors
    }
    return false;
  });

  return !hasErrors;
};

// Async validation support
export const asyncValidator = (validateAsyncFn, message = 'Validation failed') => {
  return async (value) => {
    try {
      const result = await validateAsyncFn(value);
      return {
        isValid: result === true,
        message: typeof result === 'string' ? result : message,
      };
    } catch (error) {
      return {
        isValid: false,
        message: error.message || message,
      };
    }
  };
};

// Example async validators
export const uniqueEmail = asyncValidator(
  async (email) => {
    // This would typically make an API call to check if email exists
    const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    
    if (data.exists) {
      return 'Email is already registered';
    }
    
    return true;
  },
  'Email check failed'
);

export const uniqueUsername = asyncValidator(
  async (username) => {
    const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
    const data = await response.json();
    
    if (data.exists) {
      return 'Username is already taken';
    }
    
    return true;
  },
  'Username check failed'
);

// Validation middleware for API responses
export const validateApiResponse = (schema) => {
  return (response) => {
    // This would use a schema validation library like Joi or Yup in production
    // For now, we'll assume the response is valid
    return response;
  };
};

export default {
  required,
  email,
  phone,
  password,
  minLength,
  maxLength,
  exactLength,
  number,
  minValue,
  maxValue,
  url,
  fileType,
  fileSize,
  match,
  pattern,
  validators,
  validateField,
  validateForm,
  isFormValid,
  asyncValidator,
  uniqueEmail,
  uniqueUsername,
  validateApiResponse,
};