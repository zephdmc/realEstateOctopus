import { body, param, query } from 'express-validator';

// Common validation rules
export const commonValidations = {
  objectId: (field = 'id') => 
    param(field)
      .isMongoId()
      .withMessage('Invalid ID format'),

  email: (field = 'email') =>
    body(field)
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),

  password: (field = 'password') =>
    body(field)
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  phone: (field = 'phone') =>
    body(field)
      .optional()
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage('Please provide a valid phone number'),

  price: (field = 'price') =>
    body(field)
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),

  coordinates: (latField = 'lat', lngField = 'lng') => [
    body(latField)
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body(lngField)
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180')
  ]
};

// Property validation rules
export const propertyValidations = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters'),

    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),

    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),

    body('type')
      .isIn(['house', 'apartment', 'condo', 'villa', 'townhouse', 'land', 'commercial'])
      .withMessage('Invalid property type'),

    body('status')
      .optional()
      .isIn(['for-sale', 'for-rent', 'sold', 'rented'])
      .withMessage('Invalid property status'),

    body('location.address')
      .trim()
      .notEmpty()
      .withMessage('Address is required'),

    body('location.city')
      .trim()
      .notEmpty()
      .withMessage('City is required'),

    body('location.state')
      .trim()
      .notEmpty()
      .withMessage('State is required'),

    body('location.zipCode')
      .trim()
      .notEmpty()
      .withMessage('ZIP code is required'),

    body('specifications.bedrooms')
      .isInt({ min: 0 })
      .withMessage('Bedrooms must be a non-negative integer'),

    body('specifications.bathrooms')
      .isFloat({ min: 0 })
      .withMessage('Bathrooms must be a non-negative number'),

    body('specifications.area')
      .isFloat({ min: 0 })
      .withMessage('Area must be a positive number')
  ],

  update: [
    commonValidations.objectId('id'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters'),

    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
  ]
};

// Blog validation rules
export const blogValidations = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be between 5 and 200 characters'),

    body('excerpt')
      .trim()
      .isLength({ min: 10, max: 300 })
      .withMessage('Excerpt must be between 10 and 300 characters'),

    body('content')
      .trim()
      .isLength({ min: 50 })
      .withMessage('Content must be at least 50 characters long'),

    body('categories')
      .optional()
      .isArray()
      .withMessage('Categories must be an array'),

    body('status')
      .optional()
      .isIn(['draft', 'published', 'archived'])
      .withMessage('Invalid status')
  ],

  comment: [
    body('content')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Comment must be between 1 and 1000 characters')
  ]
};

// Contact validation rules
export const contactValidations = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),

    commonValidations.email('email'),

    body('subject')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Subject must be between 5 and 200 characters'),

    body('message')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Message must be between 10 and 2000 characters')
  ]
};

// Appointment validation rules
export const appointmentValidations = {
  create: [
    body('property')
      .isMongoId()
      .withMessage('Valid property ID is required'),

    body('client.name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Client name must be between 2 and 100 characters'),

    commonValidations.email('client.email'),

    body('client.phone')
      .trim()
      .notEmpty()
      .withMessage('Client phone is required'),

    body('date')
      .isISO8601()
      .withMessage('Valid date is required')
      .custom((value) => {
        const appointmentDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (appointmentDate < today) {
          throw new Error('Appointment date cannot be in the past');
        }
        return true;
      }),

    body('time')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Valid time format is required (HH:MM)')
  ]
};

// User validation rules
export const userValidations = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),

    commonValidations.email('email'),

    commonValidations.password('password'),

    body('role')
      .optional()
      .isIn(['user', 'agent', 'admin'])
      .withMessage('Invalid role')
  ],

  login: [
    commonValidations.email('email'),
    body('password').notEmpty().withMessage('Password is required')
  ],

  updatePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    commonValidations.password('newPassword')
  ]
};

// Query parameter validation
export const queryValidations = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],

  propertyFilters: [
    query('type')
      .optional()
      .isIn(['house', 'apartment', 'condo', 'villa', 'townhouse', 'land', 'commercial'])
      .withMessage('Invalid property type'),
    
    query('status')
      .optional()
      .isIn(['for-sale', 'for-rent', 'sold', 'rented'])
      .withMessage('Invalid property status'),
    
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum price must be a positive number'),
    
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum price must be a positive number'),
    
    query('bedrooms')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Bedrooms must be a non-negative integer'),
    
    query('bathrooms')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Bathrooms must be a non-negative number')
  ]
};