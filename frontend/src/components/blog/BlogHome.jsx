import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, ArrowRight, TrendingUp } from 'lucide-react';

const BlogGridHome = ({ 
  posts = [], // Default to empty array
  loading = false, 
  error = null,
  className = "",
  title = "Latest Insights",
  subtitle = "Stay updated with our expert analysis and market trends",
  emptyMessage = "No blog posts available at the moment.",
  limit = 3,
  showViewAll = true
}) => {
  // Show loading state
  if (loading) {
    return (
      <div className={`py-2 md:py-12 ${className}`}>
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div className="mb-6 md:mb-0">
            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-64 mb-3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-80 animate-pulse"></div>
          </div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-xl flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`py-8 md:py-12 ${className}`}>
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
            <svg className="w-14 h-14 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Articles</h3>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!posts || posts.length === 0) {
    return (
      <div className={`py-8 md:py-12 ${className}`}>
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-10 max-w-md mx-auto">
            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600 mb-6">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Limit posts for homepage
    const displayPosts = posts.slice(0, limit);
    // const getPostUrl = () => {
    //     return `/blog/${post.slug || id || _id}`;
    //   };

  // Helper functions
  const getImageUrl = (featuredImage) => {
    if (!featuredImage) return '/images/blog-placeholder.jpg';
    
    if (typeof featuredImage === 'object' && featuredImage.url) {
      return featuredImage.url;
    }
    
    if (typeof featuredImage === 'string') {
      return featuredImage;
    }
    
    return '/images/blog-placeholder.jpg';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recent';
    }
  };

  return (
    <section className={`py-8 md:py-12 border-l-2 border-red-500 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center mb-3">
            <div className="w-12 h-1 bg-gradient-to-r from-red-200 to-red-500 rounded-full mr-3"></div>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Insights</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 text-lg max-w-2xl">{subtitle}</p>
        </div>
        
        {showViewAll && posts.length > limit && (
          <Link 
            to="/blog"
            className="group inline-flex items-center text-purple-600 font-semibold hover:text-purple-800 transition-colors"
          >
            View All Articles
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </Link>
        )}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayPosts.map((posts) => {
          const postId = posts._id || posts.id;
          const slug = posts.slug || postId || `post-${Math.random()}`;
          const titleText = posts.title || 'Untitled Post';
          const excerpt = posts.excerpt || posts.description || '';
          const imageUrl = getImageUrl(posts.featuredImage);
          
          // Handle author data
          const authorName = posts.author?.name || 
                            posts.authorName || 
                            (posts.author && typeof posts.author === 'string' ? posts.author : 'Our Team');
          const authorInitial = authorName.charAt(0).toUpperCase();
          
          // Handle categories
          const categories = Array.isArray(posts.categories) ? posts.categories : [];
          
          // Format date
          const dateString = posts.publishDate || posts.createdAt || posts.publishedAt;
          const formattedDate = formatDate(dateString);
          
          // Read time
          const readTime = posts.readTime || Math.max(3, Math.ceil((posts.content?.length || 0) / 2000));

          return (
            <article 
              key={postId}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 overflow-hidden"
            >
                  {/* <Link to={`/blog/${slug}`} className="block"> */}
                  <Link to={`/blog/${slug}`} className="block">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Featured Image */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-16 h-16 rounded-xl overflow-hidden">
                        <img 
                          src={imageUrl}
                          alt={titleText}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/images/blog-placeholder.jpg';
                          }}
                        />
                      </div>
                      {posts.featured && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                            <TrendingUp size={12} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Categories */}
                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {categories.slice(0, 1).map((category, idx) => {
                            const categoryName = typeof category === 'string' ? category : category.name;
                            return (
                              <span 
                                key={idx}
                                className="inline-block px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full"
                              >
                                {categoryName}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {titleText}
                      </h3>

                      {/* Excerpt */}
                      {excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {excerpt}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Author Avatar */}
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <span className="text-blue-700 text-xs font-bold">
                                {authorInitial}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {authorName}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="flex items-center text-xs text-gray-500">
                            <CalendarDays size={12} className="mr-1" />
                            {formattedDate}
                          </div>
                        </div>

                        {/* Read Time */}
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {readTime} min
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Read More Indicator */}
                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                          <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-800 transition-colors">
                              <Link to={`/blog/${slug}`}> 
                    <span>Read Full Article</span></Link>
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* CTA for Mobile */}
      {showViewAll && posts.length > limit && (
        <div className="mt-10 text-center lg:hidden">
          <Link 
            to="/blog"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-300 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            View All Articles
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default BlogGridHome;