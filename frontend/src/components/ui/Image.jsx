import React, { useState, useRef } from 'react';

const Image = ({
  src,
  alt,
  width,
  height,
  aspectRatio,
  objectFit = 'cover',
  rounded = 'none',
  shadow = 'none',
  hover = false,
  fallbackSrc = '/images/placeholder-image.jpg',
  lazy = true,
  priority = false,
  className = '',
  overlay,
  onLoad,
  onError,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef(null);

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  const objectFitClasses = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  const hoverClasses = hover ? 'transition-transform duration-300 hover:scale-105' : '';

  const handleLoad = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setError(true);
    }
    setLoaded(true);
    onError?.(e);
  };

  const aspectRatioClass = aspectRatio ? `aspect-${aspectRatio}` : '';
  const dimensionsClass = width || height ? '' : 'w-full h-full';

  const imageClasses = `
    ${dimensionsClass}
    ${aspectRatioClass}
    ${roundedClasses[rounded]}
    ${shadowClasses[shadow]}
    ${objectFitClasses[objectFit]}
    ${hoverClasses}
    ${!loaded && !error ? 'bg-gray-200 animate-pulse' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const wrapperClasses = `
    relative overflow-hidden
    ${roundedClasses[rounded]}
    ${dimensionsClass}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={wrapperClasses} style={{ width, height }}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={imageClasses}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          {overlay}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Failed to load image</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Pre-styled image variants
export const RoundedImage = (props) => <Image rounded="xl" {...props} />;
export const CircularImage = (props) => <Image rounded="full" {...props} />;
export const ElevatedImage = (props) => <Image shadow="lg" rounded="xl" {...props} />;
export const HoverImage = (props) => <Image hover {...props} />;

// Aspect ratio variants
export const SquareImage = (props) => <Image aspectRatio="square" {...props} />;
export const VideoImage = (props) => <Image aspectRatio="video" {...props} />;
export const PortraitImage = (props) => <Image aspectRatio="portrait" {...props} />;
export const LandscapeImage = (props) => <Image aspectRatio="landscape" {...props} />;

// Responsive image component
export const ResponsiveImage = ({ 
  srcSet, 
  sizes, 
  sources = [],
  ...props 
}) => {
  return (
    <picture>
      {sources.map((source, index) => (
        <source
          key={index}
          media={source.media}
          srcSet={source.srcSet}
          type={source.type}
        />
      ))}
      <Image src={props.src} {...props} />
    </picture>
  );
};

// Lazy image with intersection observer
export const LazyImage = ({ threshold = 0.1, ...props }) => {
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={imgRef}>
      {inView ? <Image {...props} /> : <Image {...props} src={undefined} />}
    </div>
  );
};

export default Image;