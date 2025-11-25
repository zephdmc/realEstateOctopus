import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { NarrowContainer } from '../../components/layout/PageContainer';
import BlogPostComponent from '../../components/blog/BlogPost';
import BlogSidebar from '../../components/blog/BlogSidebar';
import RelatedPosts from '../../components/blog/RelatedPosts';
import { useBlogPost, useBlogPosts } from '../../hooks/useBlogPosts';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BlogPost = () => {
  const { id } = useParams();
  
  // Debug logging (remove in production)
  console.log('🔍 BlogPost - ID from URL:', id);

  // Single post data
  const { post, loading: postLoading, error: postError } = useBlogPost(id);
  
  // Related posts data
  const { posts: allPosts, fetchPosts, loading: relatedLoading } = useBlogPosts({ limit: 10 }, false);

  // Fetch related posts when component mounts
  React.useEffect(() => {
    fetchPosts({ limit: 10 });
  }, [fetchPosts]);

  // Process related posts
  const relatedPosts = React.useMemo(() => 
    allPosts?.filter(p => p._id !== id).slice(0, 3) || [], 
    [allPosts, id]
  );

  // Static data for sidebar
  const categories = [
    { name: 'Market News', slug: 'market-news', count: 24 },
    { name: 'Buying Guide', slug: 'buying-guide', count: 18 },
    { name: 'Selling Tips', slug: 'selling-tips', count: 15 }
  ];

  const tags = [
    { name: 'real estate', slug: 'real-estate', count: 45 },
    { name: 'market trends', slug: 'market-trends', count: 32 },
    { name: 'home buying', slug: 'home-buying', count: 28 }
  ];

  // Loading state
  if (postLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" text="Loading blog post..." />
            <p className="mt-4 text-gray-600">Please wait while we load the content</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (postError || !post) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <NarrowContainer>
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📄</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {postError 
                  ? `We encountered an error: ${postError}` 
                  : "The blog post you're looking for doesn't exist or may have been removed."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/blog"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium shadow-sm"
                >
                  Back to Blog
                </Link>
                <Link
                  to="/"
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition duration-200 font-medium shadow-sm"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </NarrowContainer>
        </div>
      </MainLayout>
    );
  }

  // Success state
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content - Blog Post */}
            <div className="flex-1">
              <NarrowContainer>
                {/* Breadcrumb Navigation */}
                <nav className="mb-8">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>›</span>
                    <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
                    <span>›</span>
                    <span className="text-gray-900 font-medium truncate">{post.title}</span>
                  </div>
                </nav>

                {/* Blog Post Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <BlogPostComponent post={post} />
                </div>

                {/* Related Posts Section */}
                <div className="mt-12">
                  <RelatedPosts
                    posts={relatedPosts}
                    currentPostId={post._id}
                    title="Related Articles"
                    subtitle="Continue reading with these related posts"
                  />
                </div>
              </NarrowContainer>
            </div>

            {/* Sidebar - Desktop */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24">
                <BlogSidebar
                  recentPosts={allPosts?.slice(0, 3) || []}
                  categories={categories}
                  tags={tags}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar for mobile - at bottom */}
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <BlogSidebar
              recentPosts={allPosts?.slice(0, 3) || []}
              categories={categories}
              tags={tags}
              mobileLayout={true}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogPost;