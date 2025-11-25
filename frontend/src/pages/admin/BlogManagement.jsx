import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Calendar, User, RefreshCw, Filter, AlertCircle, X, Image, Clock, Tag, LogIn, Upload, Cloud } from 'lucide-react';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { useAuth } from '../../contexts/AuthContext';
import { uploadService } from '../../services/uploadService';

const BlogManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [localFilters, setLocalFilters] = useState({});
  const [authError, setAuthError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    categories: [],
    tags: [],
    status: 'draft',
    featuredImage: {
      url: '',
      alt: '',
      cloudinaryId: '' // Updated to match your model
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    },
    readTime: 5
  });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const {
    posts: blogPosts,
    loading,
    error,
    deletePost,
    updateStatus,
    createPost,
    updatePost,
    refetch,
    pagination
  } = useBlogPosts(localFilters);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'market-news', label: 'Market News' },
    { value: 'home-improvement', label: 'Home Improvement' },
    { value: 'investment', label: 'Investment' },
    { value: 'neighborhood', label: 'Neighborhood' },
    { value: 'design-tips', label: 'Design Tips' },
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'legal', label: 'Legal' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  // Handle file upload using your upload service
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadProgress(0);
    setAuthError(null);

    try {
      // Validate file using your service
      const validation = uploadService.validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      });

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      console.log('📤 Uploading blog image:', file.name);

      // Upload using your service with progress tracking
      const response = await uploadService.uploadBlogImages(
        [file], 
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Based on your Upload model, the response should contain the uploaded file data
      const uploadedFile = response.data[0]; 
      
      console.log('✅ Upload response:', uploadedFile);

      // Map the response to match your featuredImage structure
      setNewPost(prev => ({
        ...prev,
        featuredImage: {
          url: uploadedFile.url,
          cloudinaryId: uploadedFile.cloudinaryId, // This matches your model's cloudinaryId
          alt: prev.featuredImage.alt || uploadedFile.originalName.split('.')[0] || 'Blog post image'
        }
      }));

      console.log('✅ Image uploaded successfully:', {
        url: uploadedFile.url,
        cloudinaryId: uploadedFile.cloudinaryId,
        originalName: uploadedFile.originalName
      });
      
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      setAuthError(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadLoading(false);
      setUploadProgress(0);
      // Clear the file input
      event.target.value = '';
    }
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.files = files;
      const changeEvent = new Event('change', { bubbles: true });
      Object.defineProperty(changeEvent, 'target', { value: fileInput });
      handleImageUpload({ target: fileInput });
    }
  };

  // Handle drag over
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setNewPost(prev => ({
      ...prev,
      featuredImage: {
        url: '',
        alt: '',
        cloudinaryId: ''
      }
    }));
  };

  // Update filters when search or filters change
  useEffect(() => {
    const filters = {};
    
    if (searchTerm) filters.search = searchTerm;
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (categoryFilter !== 'all') filters.category = categoryFilter;
    
    setLocalFilters(filters);
  }, [searchTerm, statusFilter, categoryFilter]);

  const handleDelete = (post) => {
    if (!user) {
      setAuthError('Please log in to delete posts');
      return;
    }
    if (!isAdmin) {
      setAuthError('Admin privileges required to delete posts');
      return;
    }
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await deletePost(selectedPost._id);
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
      if (error.status === 401) {
        setAuthError('Authentication failed. Please log in again.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (postId, newStatus) => {
    if (!user) {
      setAuthError('Please log in to update post status');
      return;
    }
    if (!isAdmin) {
      setAuthError('Admin privileges required to update post status');
      return;
    }
    
    setActionLoading(true);
    try {
      await updateStatus(postId, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      if (error.status === 401) {
        setAuthError('Authentication failed. Please log in again.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddPostClick = () => {
    if (!user) {
      setAuthError('Please log in to create blog posts');
      return;
    }
    if (!isAdmin) {
      setAuthError('Admin privileges required to create blog posts');
      return;
    }
    setShowAddModal(true);
    setAuthError(null);
  };

  const handleAddPost = async () => {
    if (!user) {
      setAuthError('Please log in to create a post');
      return;
    }
  
    if (!isAdmin) {
      setAuthError('Admin privileges required to create posts');
      return;
    }
  
    setActionLoading(true);
    try {
      const readTime = calculateReadTime(newPost.content);
      
      // Prepare post data with proper image structure matching your Blog model
      const postData = {
        title: newPost.title,
        content: newPost.content,
        excerpt: newPost.excerpt,
        categories: newPost.categories,
        tags: newPost.tags,
        status: newPost.status,
        featuredImage: newPost.featuredImage.url ? {
          url: newPost.featuredImage.url,
          alt: newPost.featuredImage.alt,
          cloudinaryId: newPost.featuredImage.cloudinaryId
        } : undefined,
        seo: newPost.seo,
        readTime,
        // Firebase author info will be added by the backend or hook
      };
  
      console.log('📝 Post data being sent:', JSON.stringify(postData, null, 2));
  
      await createPost(postData);
      setShowAddModal(false);
      resetNewPost();
      setAuthError(null);
    } catch (error) {
      console.error('Failed to create post:', error);
      if (error.status === 401) {
        setAuthError('Authentication failed. Please log in again.');
      } else if (error.status === 403) {
        setAuthError('Access denied. Admin privileges required.');
      } else {
        setAuthError('Failed to create post. Please try again.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const calculateReadTime = (content) => {
    if (!content) return 5;
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
  };

  const resetNewPost = () => {
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      categories: [],
      tags: [],
      status: 'draft',
      featuredImage: {
        url: '',
        alt: '',
        cloudinaryId: ''
      },
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      },
      readTime: 5
    });
    setTagInput('');
    setKeywordInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !newPost.tags.includes(tagInput.trim())) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !newPost.seo.keywords.includes(keywordInput.trim())) {
      setNewPost(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, keywordInput.trim()]
        }
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setNewPost(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(keyword => keyword !== keywordToRemove)
      }
    }));
  };

  const handleCategoryToggle = (category) => {
    setNewPost(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleViewPost = (post) => {
    window.location.href = `/blog/${post.slug || post._id}`;
  };

  const handleEditPost = (post) => {
    if (!user) {
      setAuthError('Please log in to edit posts');
      return;
    }
    if (!isAdmin) {
      setAuthError('Admin privileges required to edit posts');
      return;
    }
    
    setSelectedPost(post);
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      categories: post.categories || [],
      tags: post.tags || [],
      status: post.status,
      featuredImage: post.featuredImage || { url: '', alt: '', cloudinaryId: '' },
      seo: post.seo || {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      },
      readTime: post.readTime || 5
    });
    setShowAddModal(true);
    setAuthError(null);
  };

  const handleUpdatePost = async () => {
    if (!user || !isAdmin) {
      setAuthError('Admin privileges required to update posts');
      return;
    }

    setActionLoading(true);
    try {
      const readTime = calculateReadTime(newPost.content);
      
      const postData = {
        title: newPost.title,
        content: newPost.content,
        excerpt: newPost.excerpt,
        categories: newPost.categories,
        tags: newPost.tags,
        status: newPost.status,
        featuredImage: newPost.featuredImage.url ? {
          url: newPost.featuredImage.url,
          alt: newPost.featuredImage.alt,
          cloudinaryId: newPost.featuredImage.cloudinaryId
        } : undefined,
        seo: newPost.seo,
        readTime,
      };

      const result = await updatePost(selectedPost._id, postData);
      
      setShowAddModal(false);
      resetNewPost();
      setSelectedPost(null);
      setAuthError(null);
      
    } catch (error) {
      console.error('❌ updatePost failed:', error);
      if (error.status === 401) {
        setAuthError('Authentication failed. Please log in again.');
      } else if (error.status === 403) {
        setAuthError('Access denied. Admin privileges required.');
      } else {
        setAuthError(`Failed to update post: ${error.message}`);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadTime = (content) => {
    if (!content) return '5 min';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min`;
  };

  const handleRefresh = () => {
    refetch();
  };

  // Clear auth error when user logs in
  useEffect(() => {
    if (user) {
      setAuthError(null);
    }
  }, [user]);

  if (loading && blogPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Manage your blog posts and content</p>
        </div>
        <div className="flex items-center space-x-3">
          {user && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User size={16} />
              <span>{user.displayName || user.email}</span>
              {isAdmin && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Admin
                </span>
              )}
            </div>
          )}
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          
          {user && isAdmin ? (
            <button 
              onClick={handleAddPostClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>New Post</span>
            </button>
          ) : (
            <button 
              onClick={handleAddPostClick}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-not-allowed opacity-50"
              title={!user ? "Please log in" : "Admin access required"}
            >
              <Plus size={20} />
              <span>New Post</span>
            </button>
          )}
        </div>
      </div>

      {/* Authentication Error Display */}
      {authError && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-yellow-500" size={20} />
            <div>
              <h4 className="text-yellow-800 font-medium">Authentication Required</h4>
              <p className="text-yellow-600 text-sm">{authError}</p>
            </div>
          </div>
          {!user && (
            <button 
              onClick={() => window.location.href = '/login'}
              className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <LogIn size={16} />
              <span>Log In</span>
            </button>
          )}
        </div>
      )}

      {/* API Error Display */}
      {error && !authError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="text-red-500" size={20} />
          <div>
            <h4 className="text-red-800 font-medium">Error Loading Posts</h4>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
            <span>
              {pagination.totalItems > 0 ? `${pagination.totalItems} posts found` : 'No posts found'}
            </span>
            {loading && <RefreshCw size={16} className="animate-spin" />}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <div key={post._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Featured Image */}
            <div className="h-48 bg-gray-200 relative">
              {post.featuredImage?.url ? (
                <img
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
                {post.categories?.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full border border-blue-200"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600 font-medium">
                  {post.categories?.[0] || 'Uncategorized'}
                </span>
                <span className="text-sm text-gray-500">
                  {getReadTime(post.content)}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{post.authorName || 'Unknown Author'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span>👁️ {post.views || 0} views</span>
                  <span>💬 {post.comments?.length || 0} comments</span>
                  <span>❤️ {post.likes?.length || 0} likes</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-3">
                  {/* View Button - Navigates to blog post page */}
                  <button 
                    onClick={() => handleViewPost(post)}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm transition-colors disabled:opacity-50"
                    disabled={actionLoading}
                    title="View full post"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  
                  {/* Edit Button - Opens edit modal */}
                  <button 
                    onClick={() => handleEditPost(post)}
                    className="text-green-600 hover:text-green-800 flex items-center space-x-1 text-sm transition-colors disabled:opacity-50"
                    disabled={!user || !isAdmin || actionLoading}
                    title={!user ? "Please log in" : !isAdmin ? "Admin access required" : "Edit post"}
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  
                  <select
                    value={post.status}
                    onChange={(e) => handleStatusChange(post._id, e.target.value)}
                    disabled={!user || !isAdmin || actionLoading}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    title={!user ? "Please log in" : !isAdmin ? "Admin access required" : "Change status"}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Publish</option>
                    <option value="archived">Archive</option>
                  </select>
                </div>
                <button 
                  className="text-red-600 hover:text-red-800 flex items-center space-x-1 text-sm transition-colors disabled:opacity-50"
                  onClick={() => handleDelete(post)}
                  disabled={!user || !isAdmin || actionLoading}
                  title={!user ? "Please log in" : !isAdmin ? "Admin access required" : "Delete post"}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {blogPosts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or create a new post</p>
          <button 
            onClick={handleAddPostClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!user || !isAdmin}
            title={!user ? "Please log in" : !isAdmin ? "Admin access required" : "Create new post"}
          >
            Create Your First Post
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            disabled={pagination.currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Blog Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">
                {selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetNewPost();
                  setSelectedPost(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                disabled={actionLoading}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter blog post title"
                      disabled={actionLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of the post"
                      disabled={actionLoading}
                    />
                  </div>

                  {/* Featured Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image
                    </label>
                    
                    {/* Image Preview */}
                    {newPost.featuredImage.url ? (
                      <div className="mb-4">
                        <div className="relative">
                          <img
                            src={newPost.featuredImage.url}
                            alt={newPost.featuredImage.alt}
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                            disabled={uploadLoading}
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image Alt Text
                          </label>
                          <input
                            type="text"
                            value={newPost.featuredImage.alt}
                            onChange={(e) => setNewPost(prev => ({ 
                              ...prev, 
                              featuredImage: { ...prev.featuredImage, alt: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Description of the image for SEO"
                            disabled={actionLoading}
                          />
                        </div>
                      </div>
                    ) : (
                      /* Upload Area with Drag & Drop */
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        {uploadLoading ? (
                          <div className="space-y-3">
                            <RefreshCw size={32} className="animate-spin text-blue-600 mx-auto" />
                            <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Cloud size={48} className="text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 mb-2">
                              Drag and drop an image, or click to browse
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                              Supports JPG, PNG, WebP, GIF • Max 5MB
                            </p>
                            <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                              <Upload size={16} className="inline mr-2" />
                              Choose Image
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploadLoading || actionLoading}
                              />
                            </label>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newPost.status}
                      onChange={(e) => setNewPost(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={actionLoading}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryOptions.filter(opt => opt.value !== 'all').map(option => (
                        <label key={option.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newPost.categories.includes(option.value)}
                            onChange={() => handleCategoryToggle(option.value)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={actionLoading}
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a tag"
                        disabled={actionLoading}
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                        disabled={actionLoading}
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newPost.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                            disabled={actionLoading}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  rows="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your blog post content here..."
                  disabled={actionLoading}
                />
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-1" />
                  Estimated read time: {calculateReadTime(newPost.content)} minutes
                </div>
              </div>

              {/* SEO Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={newPost.seo.metaTitle}
                      onChange={(e) => setNewPost(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo, metaTitle: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SEO meta title"
                      disabled={actionLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={newPost.seo.metaDescription}
                      onChange={(e) => setNewPost(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo, metaDescription: e.target.value }
                      }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SEO meta description"
                      disabled={actionLoading}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a keyword"
                      disabled={actionLoading}
                    />
                    <button
                      onClick={addKeyword}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                      disabled={actionLoading}
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newPost.seo.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="ml-1 text-green-600 hover:text-green-800"
                          disabled={actionLoading}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetNewPost();
                  setSelectedPost(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={selectedPost ? handleUpdatePost : handleAddPost}
                disabled={!newPost.title || !newPost.excerpt || !newPost.content || actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {actionLoading && <RefreshCw size={16} className="animate-spin" />}
                <span>
                  {actionLoading 
                    ? (selectedPost ? 'Updating...' : 'Creating...') 
                    : (selectedPost ? 'Update Post' : 'Create Post')
                  }
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Delete Blog Post</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                onClick={confirmDelete}
                disabled={actionLoading}
              >
                {actionLoading && <RefreshCw size={16} className="animate-spin" />}
                <span>{actionLoading ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;