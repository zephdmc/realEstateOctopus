import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ 
  post, 
  variant = 'default', // 'default', 'featured', 'minimal'
  className = "" 
}) => {
  // Map your Blog model structure to the expected props
  const {
    _id, // MongoDB uses _id
    id = _id, // Fallback to _id if id doesn't exist
    title,
    excerpt,
    featuredImage,
    authorName, // From your Blog model
    authorAvatar, // From your Blog model
    author = { // Create author object from Blog model fields
      name: authorName,
      avatar: authorAvatar
    },
    createdAt, // From your Blog model
    publishDate = createdAt, // Fallback to createdAt
    readTime,
    categories,
    tags,
    featured = false,
    views = 0
  } = post;

  // Get image URL - handle both string and object formats
  const getImageUrl = () => {
    if (!featuredImage) return '/images/blog-placeholder.jpg';
    
    // If featuredImage is an object (from your Blog model)
    if (typeof featuredImage === 'object' && featuredImage.url) {
      return featuredImage.url;
    }
    
    // If featuredImage is a string
    if (typeof featuredImage === 'string') {
      return featuredImage;
    }
    
    return '/images/blog-placeholder.jpg';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'market-news': 'bg-blue-100 text-blue-800 border border-blue-200',
      'home-improvement': 'bg-green-100 text-green-800 border border-green-200',
      'investment': 'bg-purple-100 text-purple-800 border border-purple-200',
      'neighborhood': 'bg-orange-100 text-orange-800 border border-orange-200',
      'design-tips': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      'mortgage': 'bg-pink-100 text-pink-800 border border-pink-200',
      'legal': 'bg-red-100 text-red-800 border border-red-200',
      'lifestyle': 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const formatCategoryName = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Use slug for URL if available, otherwise use ID
  const getPostUrl = () => {
    return `/blog/${post.slug || id || _id}`;
  };

  if (variant === 'minimal') {
    return (
      <article className={`flex space-x-4 group ${className}`}>
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
          <img
            src={getImageUrl()}
            alt={title || 'Blog post'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/images/blog-placeholder.jpg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
            <Link to={getPostUrl()}>
              {title || 'Untitled Post'}
            </Link>
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(publishDate)} • {readTime || 5} min read
          </p>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
        <Link to={getPostUrl()} className="block">
          {/* Image */}
          <div className="relative h-64 bg-gray-200 overflow-hidden">
            <img
              src={getImageUrl()}
              alt={featuredImage?.alt || title || 'Blog post'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = '/images/blog-placeholder.jpg';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            
            {/* Featured Badge */}
            {featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Categories */}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.slice(0, 2).map(category => (
                  <span
                    key={category}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category)}`}
                  >
                    {formatCategoryName(category)}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3 line-clamp-2">
              {title || 'Untitled Post'}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-600 mb-4 line-clamp-3">
              {excerpt || 'No excerpt available...'}
            </p>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <img
                    src={author?.avatar || authorAvatar || '/images/avatar-placeholder.jpg'}
                    alt={author?.name || authorName || 'Author'}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      e.target.src = '/images/avatar-placeholder.jpg';
                    }}
                  />
                  <span>{author?.name || authorName || 'Unknown Author'}</span>
                </div>
                <span>{formatDate(publishDate)}</span>
              </div>
              <span>{readTime || 5} min read</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Default variant
  return (
    <article className={`bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 ${className}`}>
      <Link to={getPostUrl()} className="block">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={getImageUrl()}
            alt={featuredImage?.alt || title || 'Blog post'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/images/blog-placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          
          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.slice(0, 2).map(category => (
                <span
                  key={category}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category)}`}
                >
                  {formatCategoryName(category)}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3 line-clamp-2">
            {title || 'Untitled Post'}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 mb-4 line-clamp-3">
            {excerpt || 'No excerpt available...'}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img
                  src={author?.avatar || authorAvatar || '/images/avatar-placeholder.jpg'}
                  alt={author?.name || authorName || 'Author'}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.src = '/images/avatar-placeholder.jpg';
                  }}
                />
                <span>{author?.name || authorName || 'Unknown Author'}</span>
              </div>
              <span>•</span>
              <span>{formatDate(publishDate)}</span>
            </div>
            <span>{readTime || 5} min read</span>
          </div>

          {/* Additional Stats */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>👁️ {views || 0} views</span>
              <span>💬 {post.comments?.length || 0} comments</span>
              <span>❤️ {post.likes?.length || 0} likes</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;