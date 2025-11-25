import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  size = 'medium',
  variant = 'default',
  disabled = false,
  error,
  success,
  helperText,
  required = false,
  fullWidth = true,
  prefix,
  suffix,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const variants = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
    warning: 'border-orange-500 focus:border-orange-500 focus:ring-orange-500',
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-4 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const currentVariant = error ? 'error' : success ? 'success' : variant;

  const inputClasses = `
    ${baseClasses}
    ${variants[currentVariant]}
    ${sizes[size]}
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
    ${(prefix || (icon && iconPosition === 'left')) ? 'pl-10' : ''}
    ${(suffix || (icon && iconPosition === 'right')) ? 'pr-10' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const renderIcon = () => {
    if (!icon) return null;

    const iconClasses = `
      absolute top-1/2 transform -translate-y-1/2
      ${iconPosition === 'left' ? 'left-3' : 'right-3'}
      ${error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-400'}
      ${sizes[size].includes('py-2') ? 'w-4 h-4' : 'w-5 h-5'}
    `.trim().replace(/\s+/g, ' ');

    if (typeof icon === 'string') {
      return <span className={iconClasses}>{icon}</span>;
    }
    
    return React.cloneElement(icon, { className: iconClasses });
  };

  return (
    <div className={`${widthClass} ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Prefix */}
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">{prefix}</span>
          </div>
        )}

        {/* Suffix */}
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">{suffix}</span>
          </div>
        )}

        {/* Icon */}
        {renderIcon()}

        {/* Input Element */}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
      </div>

      {/* Helper Text & Error Message */}
      {(helperText || error) && (
        <p className={`mt-1 text-sm ${
          error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Specialized input components
export const TextInput = forwardRef((props, ref) => (
  <Input ref={ref} type="text" {...props} />
));

export const EmailInput = forwardRef((props, ref) => (
  <Input ref={ref} type="email" {...props} />
));

export const PasswordInput = forwardRef((props, ref) => (
  <Input ref={ref} type="password" {...props} />
));

export const NumberInput = forwardRef((props, ref) => (
  <Input ref={ref} type="number" {...props} />
));

export const PhoneInput = forwardRef((props, ref) => (
  <Input ref={ref} type="tel" {...props} />
));

export const SearchInput = forwardRef((props, ref) => (
  <Input 
    ref={ref} 
    type="search" 
    icon={
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
    {...props} 
  />
));

export default Input;