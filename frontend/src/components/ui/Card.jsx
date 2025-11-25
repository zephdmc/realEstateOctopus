import React from 'react';

const Card = ({
  children,
  variant = 'default',
  padding = 'medium',
  hover = false,
  bordered = true,
  shadow = 'medium',
  rounded = 'xl',
  className = '',
  ...props
}) => {
  const baseClasses = 'transition-all duration-200';
  
  const variants = {
    default: 'bg-white',
    elevated: 'bg-white',
    outlined: 'bg-transparent',
    filled: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100',
  };

  const paddings = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    xlarge: 'p-10',
  };

  const shadows = {
    none: 'shadow-none',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
    xlarge: 'shadow-xl',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  const borderClasses = bordered ? 'border border-gray-200' : 'border-0';
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-0.5' : '';

  const cardClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${paddings[padding]}
    ${shadows[shadow]}
    ${roundedClasses[rounded]}
    ${borderClasses}
    ${hoverClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card sub-components
const CardHeader = ({ 
  children, 
  className = '',
  withDivider = false,
  ...props 
}) => (
  <div 
    className={`${withDivider ? 'border-b border-gray-200 pb-4' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ 
  children, 
  as: Component = 'h3',
  className = '',
  ...props 
}) => (
  <Component 
    className={`text-lg font-semibold text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </Component>
);

const CardDescription = ({ 
  children, 
  className = '',
  ...props 
}) => (
  <p 
    className={`text-sm text-gray-600 mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({ 
  children, 
  className = '',
  ...props 
}) => (
  <div 
    className={`mt-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardFooter = ({ 
  children, 
  className = '',
  withDivider = false,
  ...props 
}) => (
  <div 
    className={`${withDivider ? 'border-t border-gray-200 pt-4' : 'mt-4'} ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Pre-styled card variants
export const ElevatedCard = (props) => <Card variant="elevated" shadow="large" {...props} />;
export const OutlinedCard = (props) => <Card variant="outlined" bordered={true} shadow="none" {...props} />;
export const FilledCard = (props) => <Card variant="filled" bordered={false} shadow="none" {...props} />;
export const GradientCard = (props) => <Card variant="gradient" bordered={false} shadow="medium" {...props} />;

// Compound component
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;