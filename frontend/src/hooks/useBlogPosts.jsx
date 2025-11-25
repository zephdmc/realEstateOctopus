import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

export const useBlogPosts = (filters = {}, autoFetch = true) => { // ADD autoFetch parameter
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9
  });

  const { get, post, put, del } = useApi();

  // Fetch blog posts with filters - FIXED URL
  const fetchPosts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      
      // Add filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      // FIXED: Use correct endpoint - remove "/posts"
      const response = await get(`/blog?${queryParams.toString()}`);
      
      if (response.success) {
        console.log('📥 Received posts response:', response.data);
        
        // FIXED: Handle different response structures
        const postsData = response.data.data || response.data.posts || response.data || [];
        setPosts(postsData);
        
        // FIXED: Handle different pagination structures
        setPagination({
          currentPage: response.data.pagination?.page || response.data.currentPage || 1,
          totalPages: response.data.pagination?.pages || response.data.totalPages || 1,
          totalItems: response.data.pagination?.total || response.data.total || response.data.totalItems || 0,
          itemsPerPage: response.data.pagination?.limit || response.data.itemsPerPage || 9
        });
      } else {
        throw new Error(response.message || 'Failed to fetch blog posts');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  }, [get]);

  // Fetch single post by ID or slug - FIXED URL
  const fetchPost = useCallback(async (identifier) => {
    try {
      setLoading(true);
      setError(null);

      // FIXED: Use correct endpoint - remove "/posts"
      const response = await get(`/blog/${identifier}`);
      
      if (response.success) {
        return response.data.data || response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch blog post');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the blog post');
      console.error('Error fetching blog post:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [get]);

  // Create new blog post - THIS IS CORRECT
  const createPost = useCallback(async (postData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await post('/blog', postData);
      
      if (response.success) {
        // Add the new post to the list
        const newPost = response.data.data || response.data;
        setPosts(prev => [newPost, ...prev]);
        return newPost;
      } else {
        throw new Error(response.message || 'Failed to create blog post');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the blog post');
      console.error('Error creating blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [post]);

  // Update blog post - FIXED ID FIELD
const updatePost = useCallback(async (postId, updates) => {
  try {
    setLoading(true);
    setError(null);

    console.log('🔄 updatePost called:', { postId, updates });

    // FIXED: Use correct endpoint
    const response = await put(`/blog/${postId}`, updates);
    
    console.log('📨 Full API Response:', response);
    console.log('📊 Response success:', response.success);
    console.log('📦 Response data:', response.data);
    
    if (response.success) {
      const updatedPost = response.data.data || response.data;
      
      console.log('✅ Post updated successfully:', updatedPost);
      console.log('🔍 Checking title match:', {
        sentTitle: updates.title,
        returnedTitle: updatedPost.title,
        match: updates.title === updatedPost.title
      });
      
      // FIXED: Use _id instead of id for MongoDB
      setPosts(prev => 
        prev.map(post => {
          console.log('🔍 Comparing IDs:', { 
            postId, 
            post_id: post._id, 
            match: post._id === postId 
          });
          return post._id === postId ? updatedPost : post;
        })
      );
      return updatedPost;
    } else {
      console.log('❌ API returned success: false');
      throw new Error(response.message || 'Failed to update blog post');
    }
  } catch (err) {
    setError(err.message || 'An error occurred while updating the blog post');
    console.error('Error updating blog post:', err);
    throw err;
  } finally {
    setLoading(false);
  }
}, [put]);

  // Delete blog post - FIXED ID FIELD
  const deletePost = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🗑️ Deleting post:', postId);

      // FIXED: Use correct endpoint
      const response = await del(`/blog/${postId}`);
      
      if (response.success) {
        // FIXED: Use _id instead of id for MongoDB
        setPosts(prev => prev.filter(post => post._id !== postId));
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete blog post');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the blog post');
      console.error('Error deleting blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [del]);

  // Update post status (publish, draft, etc.) - FIXED
  const updateStatus = useCallback(async (postId, status) => {
    try {
      console.log('🔄 updateStatus called:', { postId, status });
      
      if (!postId) {
        throw new Error('Post ID is required for status update');
      }

      const response = await updatePost(postId, { status });
      return response;
    } catch (err) {
      setError(err.message || 'An error occurred while updating post status');
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
      setError(err.message || 'An error occurred while updating featured status');
      throw err;
    }
  }, [updatePost]);

  // Search blog posts - FIXED URL
  const searchPosts = useCallback(async (searchTerm, searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Use the main fetch with search filter instead of separate endpoint
      await fetchPosts({ ...searchFilters, search: searchTerm });
    } catch (err) {
      setError(err.message || 'An error occurred while searching blog posts');
      console.error('Error searching blog posts:', err);
      throw err;
    }
  }, [fetchPosts]);

  // Get posts by category - FIXED URL
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
      return [];
    }
  }, [get]);

  // Get posts by tag - FIXED URL
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
      return [];
    }
  }, [get]);

  // Remove unimplemented functions or comment them out
  const getFeaturedPosts = useCallback(async () => {
    console.warn('getFeaturedPosts not implemented in backend');
    return [];
  }, []);

  const getRecentPosts = useCallback(async () => {
    console.warn('getRecentPosts not implemented in backend');
    return [];
  }, []);

  const getRelatedPosts = useCallback(async () => {
    console.warn('getRelatedPosts not implemented in backend');
    return [];
  }, []);

  const getCategories = useCallback(async () => {
    console.warn('getCategories not implemented in backend');
    return [];
  }, []);

  const getTags = useCallback(async () => {
    console.warn('getTags not implemented in backend');
    return [];
  }, []);

  // Refetch posts with current filters
  const refetch = useCallback(() => {
    fetchPosts(filters);
  }, [fetchPosts, filters]);

  // Initial fetch and when filters change - ADD autoFetch check
  useEffect(() => {
    if (autoFetch) {
      fetchPosts(filters);
    }
  }, [fetchPosts, filters, autoFetch]); // ADD autoFetch dependency

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

// Hook for single blog post - FIXED URL
export const useBlogPost = (identifier) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { get } = useApi();

  const fetchPost = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useBlogPost - Fetching post:', id);

      // FIXED: Use correct endpoint
      const response = await get(`/blog/${id}`);
      
      console.log('📄 useBlogPost - API Response:', response);
      
      if (response.success) {
        const postData = response.data.data || response.data;
        console.log('✅ useBlogPost - Post data received:', postData);
        setPost(postData);
      } else {
        console.log('❌ useBlogPost - API returned error:', response.message);
        throw new Error(response.message || 'Failed to fetch blog post');
      }
    } catch (err) {
      console.error('💥 useBlogPost - Error:', err);
      setError(err.message || 'An error occurred while fetching the blog post');
    } finally {
      setLoading(false);
      console.log('🏁 useBlogPost - Loading complete');
    }
  }, [get]);

  useEffect(() => {
    console.log('🚀 useBlogPost - useEffect triggered with identifier:', identifier);
    if (identifier) {
      fetchPost(identifier);
    } else {
      console.log('⚠️ useBlogPost - No identifier provided');
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