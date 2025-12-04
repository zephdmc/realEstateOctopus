import React, { useEffect } from 'react';
import { WideContainer } from '../../components/layout/PageContainer';
import BlogGridHome from '../../components/blog/BlogHome'; // Make sure this import is correct
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { Link } from 'react-router-dom';

const FeaturedBlogPosts = ({ 
  title = "Featured Articles",
  subtitle = "Explore our latest insights and real estate expertise",
  className = "",
  limit = 3 // Changed to match BlogGridHome default
}) => {
  // Use the hook to fetch blog posts
  const {
    posts,
    loading,
    error,
    refetch
  } = useBlogPosts({ 
    page: 1,
    limit: limit,
    sort: 'newest',
    featured: true // Get featured posts
  });

  // Debug: Log what we're getting from the hook
  useEffect(() => {
    console.log('🔍 FeaturedBlogPosts Hook State:', {
      loading,
      error,
      postsCount: posts?.length || 0,
      totalItems: posts?.length || 0,
      limit
    });
  }, [posts, loading, error, limit]);

  // Handle retry
  const handleRetry = () => {
    refetch();
  };

  // If we have an error, show a simple error message
  if (error && posts.length === 0) {
    return (
      <section className={`py-2 md:py-16 bg-gradient-to-b from-gray-50 to-white ${className}`}>
        <WideContainer>
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Temporary Issue</h3>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <button 
                onClick={handleRetry}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </WideContainer>
      </section>
    );
  }

  return (
    <section className={`py-2 md:py-4 bg-gradient-to-b from-gray-50 to-white ${className}`}>
      <WideContainer>
        {/* BlogGridHome handles ALL display logic */}
        <BlogGridHome
          posts={posts}
          loading={loading}
          error={error}
          title={title}
          subtitle={subtitle}
          limit={limit}
          emptyMessage="Our latest articles are coming soon. Check back for expert real estate insights."
          showViewAll={true}
        />

        {/* Optional CTA Section - Only show if we have posts */}
        {!loading && posts && posts.length > 0 && (
          <div className="text-center  rounded-2xl border-2 border-red-600 mt-2">
            <div className="bg-gradient-to-r from-blue-600 to-red-700 rounded-2xl shadow-xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">
                Want More Real Estate Insights?
              </h3>
              <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Dive deeper into market trends, investment tips, and property guides in our full blog.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  to="/blog"
                  className="bg-white text-blue-600 px-8 py-4 border-b-2 border-red-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  View All Articles
                </Link>
                <Link
                  to="/home"
                  className="bg-transparent text-white px-8 py-4 border-b-2 border-red-600 rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Subscribe to Newsletter
                </Link>
              </div>
            </div>
          </div>
        )}
      </WideContainer>
    </section>
  );
};

export default FeaturedBlogPosts;