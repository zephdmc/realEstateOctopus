import React from 'react';

const PageContainer = ({ 
  children,
  maxWidth = 'default',
  padding = 'default',
  background = 'default',
  className = '',
  ...props 
}) => {
  const maxWidthClasses = {
    default: 'max-w-7xl',
    wide: 'max-w-full',
    narrow: 'max-w-4xl',
    tight: 'max-w-2xl',
    full: 'max-w-none'
  };

  const paddingClasses = {
    none: 'px-0 py-0',
    tight: 'px-4 py-4 sm:px-6',
    default: 'px-4 py-8 sm:px-6 lg:px-8',
    relaxed: 'px-4 py-12 sm:px-6 lg:px-8',
    loose: 'px-4 py-16 sm:px-6 lg:px-8',
    section: 'px-4 py-20 sm:px-6 lg:px-8'
  };

  const backgroundClasses = {
    default: 'bg-white',
    gray: 'bg-gray-50',
    slate: 'bg-slate-50',
    blue: 'bg-blue-50',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    transparent: 'bg-transparent'
  };

  const containerClasses = `
    mx-auto
    ${maxWidthClasses[maxWidth]}
    ${paddingClasses[padding]}
    ${backgroundClasses[background]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

// Pre-styled page container variants
export const WideContainer = (props) => <PageContainer maxWidth="wide" {...props} />;
export const NarrowContainer = (props) => <PageContainer maxWidth="narrow" {...props} />;
export const TightContainer = (props) => <PageContainer maxWidth="tight" {...props} />;
export const FullWidthContainer = (props) => <PageContainer maxWidth="full" {...props} />;

export const SectionContainer = (props) => <PageContainer padding="section" {...props} />;
export const RelaxedContainer = (props) => <PageContainer padding="relaxed" {...props} />;
export const TightPaddingContainer = (props) => <PageContainer padding="tight" {...props} />;
export const NoPaddingContainer = (props) => <PageContainer padding="none" {...props} />;

export const GrayContainer = (props) => <PageContainer background="gray" {...props} />;
export const SlateContainer = (props) => <PageContainer background="slate" {...props} />;
export const BlueContainer = (props) => <PageContainer background="blue" {...props} />;
export const GradientContainer = (props) => <PageContainer background="gradient" {...props} />;
export const TransparentContainer = (props) => <PageContainer background="transparent" {...props} />;

// Specialized containers
export const HeroContainer = (props) => (
  <PageContainer 
    maxWidth="narrow" 
    padding="section" 
    background="transparent"
    className="text-center"
    {...props} 
  />
);

export const ContentContainer = (props) => (
  <PageContainer 
    maxWidth="narrow" 
    padding="relaxed" 
    {...props} 
  />
);

export const FormContainer = (props) => (
  <PageContainer 
    maxWidth="tight" 
    padding="relaxed" 
    {...props} 
  />
);

// Grid container for complex layouts
export const GridContainer = ({ 
  cols = 1,
  gap = 8,
  children,
  ...props 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gridGaps = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    12: 'gap-12'
  };

  return (
    <PageContainer {...props}>
      <div className={`grid ${gridCols[cols]} ${gridGaps[gap]}`}>
        {children}
      </div>
    </PageContainer>
  );
};

// Split container for two-column layouts
export const SplitContainer = ({ 
  reverse = false,
  gap = 16,
  leftContent,
  rightContent,
  leftWidth = '1/2',
  rightWidth = '1/2',
  verticalAlign = 'center',
  ...props 
}) => {
  const alignmentClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const widthClasses = {
    '1/3': 'lg:w-1/3',
    '2/5': 'lg:w-2/5',
    '1/2': 'lg:w-1/2',
    '3/5': 'lg:w-3/5',
    '2/3': 'lg:w-2/3'
  };

  return (
    <PageContainer {...props}>
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-${gap} ${alignmentClasses[verticalAlign]}`}>
        <div className={`w-full ${widthClasses[leftWidth]}`}>
          {leftContent}
        </div>
        <div className={`w-full ${widthClasses[rightWidth]}`}>
          {rightContent}
        </div>
      </div>
    </PageContainer>
  );
};

export default PageContainer;