import { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from './useApi';

export const useBlogPosts = (filters = {}, autoFetch = true) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9
  });

  const { get, post, put, del } = useApi();
  const requestInProgressRef = useRef(false);
  const lastRequestTimeRef = useRef(0);

  // Simple debounce function
  const debounceRequest = (callback, delay = 1000) => {
    return (...args) => {
      const now = Date.now();
      if (now - lastRequestTimeRef.current < delay) {
        console.log('⏳ Skipping request - too soon after last request');
        return Promise.reject('Request skipped: Rate limited');
      }
      lastRequestTimeRef.current = now;
      return callback(...args);
    };
  };

  // Fetch blog posts - SIMPLIFIED
  const fetchPosts = useCallback(async (customFilters = {}) => {
    // Prevent multiple simultaneous requests
    if (requestInProgressRef.current) {
      console.log('⏳ Request already in progress, skipping');
      return;
    }

    try {
      requestInProgressRef.current = true;
      setLoading(true);
      setError(null);
      
      const mergedFilters = { ...filters, ...customFilters };
      const queryParams = new URLSearchParams();
      
      // Add filter parameters
      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      // Add cache-busting parameter with random value
      queryParams.append('_t', Date.now() + Math.random());
      
      console.log('📡 Fetching blog posts with filters:', mergedFilters);
      
      const response = await get(`/blog?${queryParams.toString()}`);
      
      console.log('📥 API Response:', response);
      
      if (response.success) {
        const postsData = response.data.data || response.data.posts || response.data || [];
        console.log('✅ Received posts:', postsData.length);
        
        setPosts(postsData);
        
        setPagination({
          currentPage: response.data.pagination?.page || response.data.currentPage || 1,
          totalPages: response.data.pagination?.pages || response.data.totalPages || 1,
          totalItems: response.data.pagination?.total || response.data.total || response.data.totalItems || 0,
          itemsPerPage: response.data.pagination?.limit || response.data.itemsPerPage || 9
        });
        
        return postsData;
      } else {
        throw new Error(response.message || 'Failed to fetch blog posts');
      }
    } catch (err) {
      console.error('❌ Error fetching blog posts:', err);
      
      // Only show error if it's not a rate limit skip
      if (err.message !== 'Request skipped: Rate limited') {
        // Check if it's a rate limit error
        if (err.response?.status === 429) {
          setError('Too many requests. Please wait a moment before trying again.');
        } else {
          setError(err.message || 'Failed to load blog posts. Please try again.');
        }
      }
      
      throw err;
    } finally {
      setLoading(false);
      requestInProgressRef.current = false;
    }
  }, [get, filters]);

  // Fetch single post
  const fetchPost = useCallback(async (identifier) => {
    if (!identifier) {
      setError('No post identifier provided');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await get(`/blog/${identifier}`);
      
      if (response.success) {
        return response.data.data || response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch blog post');
      }
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError(err.message || 'Failed to load blog post');
      return null;
    } finally {
      setLoading(false);
    }
  }, [get]);

  // Create new blog post
  const createPost = useCallback(async (postData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await post('/blog', postData);
      
      if (response.success) {
        const newPost = response.data.data || response.data;
        setPosts(prev => [newPost, ...prev]);
        return newPost;
      } else {
        throw new Error(response.message || 'Failed to create blog post');
      }
    } catch (err) {
      setError(err.message || 'Failed to create blog post');
      console.error('Error creating blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [post]);

  // Update blog post
  const updatePost = useCallback(async (postId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const response = await put(`/blog/${postId}`, updates);
      
      if (response.success) {
        const updatedPost = response.data.data || response.data;
        
        setPosts(prev => 
          prev.map(post => post._id === postId ? updatedPost : post)
        );
        return updatedPost;
      } else {
        throw new Error(response.message || 'Failed to update blog post');
      }
    } catch (err) {
      setError(err.message || 'Failed to update blog post');
      console.error('Error updating blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  // Delete blog post
  const deletePost = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await del(`/blog/${postId}`);
      
      if (response.success) {
        setPosts(prev => prev.filter(post => post._id !== postId));
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete blog post');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete blog post');
      console.error('Error deleting blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [del]);

  // Update post status
  const updateStatus = useCallback(async (postId, status) => {
    try {
      if (!postId) {
        throw new Error('Post ID is required for status update');
      }
      const response = await updatePost(postId, { status });
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update post status');
      console.error('Error in updateStatus:', err);
      throw err;
    }
  }, [updatePost]);

  // Toggle post featured status
  const toggleFeatured = useCallback(async (postId, featured) => {
    try {
      const response = await updatePost(postId, { featured });
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update featured status');
      throw err;
    }
  }, [updatePost]);

  // Search blog posts
  const searchPosts = useCallback(async (searchTerm, searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      await fetchPosts({ ...searchFilters, search: searchTerm });
    } catch (err) {
      setError(err.message || 'Failed to search blog posts');
      console.error('Error searching blog posts:', err);
      throw err;
    }
  }, [fetchPosts]);

  // Get posts by category
  const getPostsByCategory = useCallback(async (categorySlug, limit = 10) => {
    try {
      const response = await get(`/blog?category=${categorySlug}&limit=${limit}`);
      
      if (response.success) {
        return response.data.data || response.data.posts || [];
      } else {
        throw new Error(response.message || 'Failed to fetch posts by category');
      }
    } catch (err) {
      console.error('Error fetching posts by category:', err);
      throw err;
    }
  }, [get]);

  // Get posts by tag
  const getPostsByTag = useCallback(async (tagSlug, limit = 10) => {
    try {
      const response = await get(`/blog?tag=${tagSlug}&limit=${limit}`);
      
      if (response.success) {
        return response.data.data || response.data.posts || [];
      } else {
        throw new Error(response.message || 'Failed to fetch posts by tag');
      }
    } catch (err) {
      console.error('Error fetching posts by tag:', err);
      throw err;
    }
  }, [get]);

  // Get featured posts
  const getFeaturedPosts = useCallback(async (limit = 6) => {
    await fetchPosts({ 
      featured: true, 
      limit: limit,
      status: 'published' 
    });
  }, [fetchPosts]);

  // Get recent posts
  const getRecentPosts = useCallback(async (limit = 5) => {
    await fetchPosts({ 
      limit: limit,
      sort: '-createdAt',
      status: 'published' 
    });
  }, [fetchPosts]);

  // Refetch posts with current filters
  const refetch = useCallback(() => {
    return fetchPosts(filters);
  }, [fetchPosts, filters]);

  // Initial fetch - only once
  useEffect(() => {
    if (autoFetch && !requestInProgressRef.current) {
      // Use setTimeout to avoid race conditions
      const timer = setTimeout(() => {
        fetchPosts(filters);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [autoFetch]); // Remove filters dependency to prevent re-fetching

  return {
    // State
    posts,
    loading,
    error,
    pagination,
    
    // Core Actions
    fetchPosts,
    fetchPost,
    createPost,
    deletePost,
    toggleFeatured,
    updateStatus,
    refetch,
    updatePost,
    
    // Optional Actions
    searchPosts,
    getPostsByCategory,
    getPostsByTag,
    getFeaturedPosts,
    getRecentPosts,
    
    // Pagination helpers
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    itemsPerPage: pagination.itemsPerPage,
    
    // Utility
    hasPosts: posts.length > 0,
    isEmpty: !loading && posts.length === 0
  };
};

// Hook for single blog post
export const useBlogPost = (identifier) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { get } = useApi();

  const fetchPost = useCallback(async (id) => {
    if (!id) {
      setError('No post identifier provided');
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await get(`/blog/${id}`);
      
      if (response.success) {
        const postData = response.data.data || response.data;
        setPost(postData);
        return postData;
      } else {
        throw new Error(response.message || 'Failed to fetch blog post');
      }
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError(err.message || 'Failed to load blog post');
      return null;
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    if (identifier) {
      fetchPost(identifier);
    } else {
      setLoading(false);
    }
  }, [identifier, fetchPost]);

  const refetch = useCallback(() => {
    if (identifier) {
      fetchPost(identifier);
    }
  }, [identifier, fetchPost]);

  return {
    post,
    loading,
    error,
    refetch,
    exists: !!post && !loading
  };
};

export default useBlogPosts;