import { validationResult } from 'express-validator';
import ErrorResponse from '../utils/ErrorResponse.js';

// Validation middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    throw new ErrorResponse('Validation failed', 400, errorMessages);
  }
  
  next();
};

// Sanitize input data
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    // Recursively trim string fields
    const trimStrings = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          trimStrings(obj[key]);
        }
      }
    };
    
    trimStrings(req.body);
  }
  next();
};

// Validate ObjectId
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ErrorResponse('Invalid ID format', 400);
  }
  
  next();
};