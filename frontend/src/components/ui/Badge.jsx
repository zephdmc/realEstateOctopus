import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  rounded = 'full',
  dot = false,
  showDot = false,
  dotColor,
  onRemove,
  removable = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium transition-colors duration-200';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-600 text-white',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-orange-100 text-orange-800',
    info: 'bg-cyan-100 text-cyan-800',
    light: 'bg-gray-50 text-gray-600 border border-gray-200',
    dark: 'bg-gray-800 text-white',
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-blue-400',
    secondary: 'bg-gray-400',
    success: 'bg-green-400',
    danger: 'bg-red-400',
    warning: 'bg-orange-400',
    info: 'bg-cyan-400',
    light: 'bg-gray-400',
    dark: 'bg-gray-400',
  };

  const currentDotColor = dotColor || dotColors[variant];
  const dotSize = size === 'small' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  const badgeClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${roundedClasses[rounded]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.();
  };

  // Dot-only variant
  if (dot) {
    return (
      <span
        className={`inline-block ${dotSize} ${currentDotColor} rounded-full ${className}`}
        {...props}
      />
    );
  }

  return (
    <span className={badgeClasses} {...props}>
      {/* Leading Dot */}
      {(showDot || dotColor) && (
        <span className={`mr-1.5 ${dotSize} ${currentDotColor} rounded-full`} />
      )}
      
      {/* Content */}
      {children}
      
      {/* Remove Button */}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className="ml-1.5 inline-flex items-center p-0.5 rounded-sm hover:bg-black hover:bg-opacity-10 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-current"
          aria-label="Remove badge"
        >
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
};

// Pre-styled badge variants
export const PrimaryBadge = (props) => <Badge variant="primary" {...props} />;
export const SuccessBadge = (props) => <Badge variant="success" {...props} />;
export const DangerBadge = (props) => <Badge variant="danger" {...props} />;
export const WarningBadge = (props) => <Badge variant="warning" {...props} />;
export const InfoBadge = (props) => <Badge variant="info" {...props} />;
export const LightBadge = (props) => <Badge variant="light" {...props} />;
export const DarkBadge = (props) => <Badge variant="dark" {...props} />;

// Status badges
export const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    active: { variant: 'success', children: 'Active' },
    inactive: { variant: 'secondary', children: 'Inactive' },
    pending: { variant: 'warning', children: 'Pending' },
    approved: { variant: 'success', children: 'Approved' },
    rejected: { variant: 'danger', children: 'Rejected' },
    draft: { variant: 'default', children: 'Draft' },
    published: { variant: 'success', children: 'Published' },
    featured: { variant: 'primary', children: 'Featured' },
    sold: { variant: 'dark', children: 'Sold' },
    'for-sale': { variant: 'success', children: 'For Sale' },
    'for-rent': { variant: 'info', children: 'For Rent' },
  };

  const config = statusConfig[status] || { variant: 'default', children: status };
  
  return <Badge variant={config.variant} {...props}>{config.children}</Badge>;
};

// Dot badge
export const DotBadge = (props) => <Badge dot {...props} />;

export default Badge;