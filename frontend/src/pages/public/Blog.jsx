import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { WideContainer, GridContainer } from '../../components/layout/PageContainer';
import BlogGrid from '../../components/blog/BlogGrid';
import BlogSidebar from '../../components/blog/BlogSidebar';
import { useBlogPosts } from '../../hooks/useBlogPosts';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Memoize filters to prevent unnecessary changes
  const filters = useMemo(() => ({
    page: parseInt(searchParams.get('page')) || 1,
    limit: 9,
    category: searchParams.get('category') || '',
    tag: searchParams.get('tag') || '',
    search: searchParams.get('search') || ''
  }), [
    searchParams.get('page'),
    searchParams.get('category'),
    searchParams.get('tag'), 
    searchParams.get('search')
  ]);

  // Use blog posts with single filters object
  const {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    pagination
  } = useBlogPosts(filters);

  // Memoize static data
  const categories = useMemo(() => [
    { name: 'Market News', slug: 'market-news', count: 24 },
    { name: 'Buying Guide', slug: 'buying-guide', count: 18 },
    { name: 'Selling Tips', slug: 'selling-tips', count: 15 },
    { name: 'Home Improvement', slug: 'home-improvement', count: 12 },
    { name: 'Investment', slug: 'investment', count: 8 }
  ], []);

  const tags = useMemo(() => [
    { name: 'real estate', slug: 'real-estate', count: 45 },
    { name: 'market trends', slug: 'market-trends', count: 32 },
    { name: 'home buying', slug: 'home-buying', count: 28 },
    { name: 'investment', slug: 'investment', count: 25 },
    { name: 'mortgage', slug: 'mortgage', count: 22 },
    { name: 'interior design', slug: 'interior-design', count: 18 }
  ], []);

  // Memoize derived data - add loading check
  const recentPosts = useMemo(() => {
    if (loading) return [];
    return posts?.slice(0, 3) || [];
  }, [posts, loading]);

  const popularPosts = useMemo(() => {
    if (loading) return [];
    return posts?.slice(3, 6) || [];
  }, [posts, loading]);

  // Memoize callback functions
  const handlePageChange = useCallback((page) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchParams]);

  const handleFilterChange = useCallback((newFilters) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams();
      
      // Add page if not present
      if (!newFilters.page) {
        newParams.set('page', '1');
      }
      
      // Add all filters that have values
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          newParams.set(key, value.toString());
        }
      });
      
      return newParams;
    });
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams({ page: '1' }));
  }, [setSearchParams]);

  // Memoize active filters check
  const hasActiveFilters = useMemo(() => 
    filters.category || filters.tag || filters.search, 
    [filters]
  );

  // Memoize filter display data
  const activeFilterDisplay = useMemo(() => {
    const display = [];
    
    if (filters.category) {
      display.push({
        type: 'category',
        label: `Category: ${categories.find(c => c.slug === filters.category)?.name || filters.category}`,
        bgColor: 'bg-blue-100 text-blue-800'
      });
    }
    
    if (filters.tag) {
      display.push({
        type: 'tag',
        label: `Tag: ${tags.find(t => t.slug === filters.tag)?.name || filters.tag}`,
        bgColor: 'bg-green-100 text-green-800'
      });
    }
    
    if (filters.search) {
      display.push({
        type: 'search',
        label: `Search: "${filters.search}"`,
        bgColor: 'bg-yellow-100 text-yellow-800'
      });
    }
    
    return display;
  }, [filters, categories, tags]);

  // Debug logging
  useEffect(() => {
    console.log('📊 Blog Component State:', {
      postsCount: posts?.length,
      loading,
      error,
      filters,
      currentPage,
      totalPages
    });
  }, [posts, loading, error, filters, currentPage, totalPages]);

  return (
    <MainLayout>
      <WideContainer>
        {/* Header */}
        <div className="relative py-16 mb-12 overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl border border-orange-100">
  {/* Background Design Elements */}
  <div className="absolute inset-0">
    {/* Strip Lines */}
    <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-orange-200/40 to-transparent animate-pulse"></div>
    <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-amber-200/30 to-transparent animate-pulse delay-75"></div>
    
    {/* Signal Waves */}
    <div className="absolute top-1/3 left-0 w-full">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-orange-300/30 to-transparent animate-pulse"></div>
    </div>
    <div className="absolute bottom-1/4 right-0 w-2/3">
      <div className="h-0.5 bg-gradient-to-l from-transparent via-amber-300/40 to-transparent animate-pulse delay-150"></div>
    </div>
    
    {/* Floating Elements */}
    <div className="absolute top-20 left-16 w-6 h-6 border-2 border-orange-300/50 rounded-lg transform rotate-45 animate-float"></div>
    <div className="absolute bottom-24 right-20 w-8 h-8 border-2 border-amber-300/40 rounded-full animate-float delay-200"></div>
    <div className="absolute top-32 right-1/4 w-4 h-4 bg-orange-400/20 rounded-sm transform rotate-12 animate-ping"></div>
    
    {/* Connection Dots */}
    <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
    <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
    
    {/* Decorative Corner Accents */}
    <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-orange-300/50 rounded-tl-lg"></div>
    <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-amber-300/50 rounded-br-lg"></div>
    
    {/* Gradient Orbs */}
    <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full blur-2xl opacity-40"></div>
    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full blur-2xl opacity-30"></div>
  </div>

  {/* Content */}
  <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
    {/* Badge */}
    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200 shadow-sm mb-6">
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
      <span className="text-sm font-semibold text-orange-700 uppercase tracking-wide">Latest Insights</span>
    </div>
    
    {/* Main Heading */}
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
      Real Estate <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Blog</span>
    </h1>
    
    {/* Description */}
    <div className="relative inline-block max-w-2xl mb-6">
      <div className="absolute -inset-3 bg-white/30 rounded-2xl transform rotate-1 blur-sm"></div>
      <p className="relative text-xl text-gray-700 leading-relaxed bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/30 shadow-sm">
        Expert insights, market trends, and tips for buyers, sellers, and investors in the real estate market.
      </p>
    </div>

    {/* Active Filters Display */}
    {hasActiveFilters && (
      <div className="relative mt-8 flex flex-wrap gap-3 justify-center">
        <div className="absolute -inset-4 bg-white/40 rounded-2xl blur-sm"></div>
        <div className="relative flex flex-wrap gap-3 justify-center bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 shadow-sm">
          {activeFilterDisplay.map((filter, index) => (
            <span 
              key={`${filter.type}-${index}`}
              className={`${filter.bgColor} px-4 py-2 rounded-full text-sm font-medium border border-white/50 shadow-sm hover:scale-105 transition-transform duration-200`}
            >
              {filter.label}
            </span>
          ))}
          <button
            onClick={clearFilters}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-200 hover:scale-105 transition-all duration-200 flex items-center gap-1"
          >
            Clear All <span className="text-lg">×</span>
          </button>
        </div>
      </div>
    )}

    {/* Decorative Bottom Elements */}
    <div className="flex justify-center items-center space-x-3 mt-8">
      <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse delay-75"></div>
      <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping delay-150"></div>
    </div>
  </div>
</div>

        <GridContainer cols={2} gap={8}>
          {/* Main Content */}
          <div className="lg:col-span-3">
            <BlogGrid
              posts={posts || []}
              loading={loading}
              error={error}
              currentPage={currentPage || filters.page}
              totalPages={totalPages || pagination?.totalPages || 1}
              totalItems={totalItems || pagination?.totalItems || 0}
              onPageChange={handlePageChange}
              showFeatured={true}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BlogSidebar
                recentPosts={recentPosts}
                categories={categories}
                tags={tags}
                popularPosts={popularPosts}
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </GridContainer>
      </WideContainer>
    </MainLayout>
  );
};

export default Blog;