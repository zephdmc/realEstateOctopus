// Custom error response class
class ErrorResponse extends Error {
    constructor(message, statusCode, details = null) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  
    // Static method to create validation error
    static validationError(details) {
      return new ErrorResponse('Validation failed', 400, details);
    }
  
    // Static method to create not found error
    static notFound(resource = 'Resource') {
      return new ErrorResponse(`${resource} not found`, 404);
    }
  
    // Static method to create unauthorized error
    static unauthorized(message = 'Not authorized') {
      return new ErrorResponse(message, 401);
    }
  
    // Static method to create forbidden error
    static forbidden(message = 'Access forbidden') {
      return new ErrorResponse(message, 403);
    }
  
    // Static method to create conflict error
    static conflict(message = 'Resource conflict') {
      return new ErrorResponse(message, 409);
    }
  
    // Convert to JSON for response
    toJSON() {
      return {
        success: false,
        error: this.message,
        statusCode: this.statusCode,
        details: this.details,
        ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
      };
    }
  }
  
  export default ErrorResponse;