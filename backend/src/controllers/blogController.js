import Blog from '../models/Blog.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
export const getBlogPosts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 9,
    category,
    status = 'published',
    search,
    tag
  } = req.query;

  // Build filter object
  const filter = { status };

  if (category) filter.categories = category;
  if (tag) filter.tags = tag;
  
  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { excerpt: new RegExp(search, 'i') },
      { content: new RegExp(search, 'i') },
      { 'seo.keywords': new RegExp(search, 'i') }
    ];
  }

  // Execute query with pagination
  const posts = await Blog.find(filter)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  // Get total count for pagination
  const total = await Blog.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    },
    data: posts
  });
});

// @desc    Get single blog post
// @route   GET /api/blog/:idOrSlug
// @access  Public
export const getBlogPost = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  // Check if it's a valid ObjectId
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  
  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
  
  const post = await Blog.findOne(query);

  if (!post) {
    throw new ErrorResponse('Blog post not found', 404);
  }

  // Increment views
  await post.incrementViews();

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Private/Admin
export const createBlogPost = asyncHandler(async (req, res) => {
  console.log('📨 Received blog data:', JSON.stringify(req.body, null, 2));
  console.log('👤 User from auth:', req.user);
  
  try {
    // Generate slug from title before creating the blog post
    const generateSlug = (title) => {
      if (!title) return `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // Remove special characters
        .replace(/\s+/g, '-')        // Replace spaces with hyphens
        .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
        .replace(/^-+/, '')          // Remove leading hyphens
        .replace(/-+$/, '');         // Remove trailing hyphens
    };

    const slug = generateSlug(req.body.title);

    // Add Firebase user info as author and include the slug
    const blogData = {
      ...req.body,
      slug: slug, // Manually add the generated slug
      authorId: req.user.uid,
      authorName: req.user.displayName || 'Admin',
      authorEmail: req.user.email,
      authorAvatar: req.user.photoURL || '',
    };

    console.log('📝 Final blog data with slug:', JSON.stringify(blogData, null, 2));

    const post = await Blog.create(blogData);

    console.log('✅ Blog post created successfully:', post._id);
    
    res.status(201).json({
      success: true,
      data: post,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    console.error('❌ Blog creation error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.values(error.errors).forEach(err => {
        validationErrors[err.path] = {
          message: err.message,
          value: err.value,
          kind: err.kind
        };
      });
      
      console.error('❌ Detailed validation errors:', validationErrors);
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors,
        message: error.message
      });
    }
    
    // Handle duplicate key errors (like duplicate slug)
    if (error.code === 11000) {
      console.error('❌ Duplicate key error:', error.keyValue);
      
      // Regenerate slug with timestamp and retry once
      if (error.keyValue.slug) {
        console.log('🔄 Regenerating slug with timestamp...');
        const newSlug = `${req.body.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')}-${Date.now()}`;
        
        try {
          const blogDataWithNewSlug = {
            ...req.body,
            slug: newSlug,
            authorId: req.user.uid,
            authorName: req.user.displayName || 'Admin',
            authorEmail: req.user.email,
            authorAvatar: req.user.photoURL || '',
          };
          
          const post = await Blog.create(blogDataWithNewSlug);
          
          console.log('✅ Blog post created successfully with new slug:', post._id);
          
          return res.status(201).json({
            success: true,
            data: post,
            message: 'Blog post created successfully'
          });
        } catch (retryError) {
          console.error('❌ Retry failed:', retryError);
        }
      }
      
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry',
        details: error.keyValue,
        message: 'A post with this title or slug already exists'
      });
    }
    
    console.error('❌ Unexpected error:', error);
    throw error;
  }
});

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
export const updateBlogPost = asyncHandler(async (req, res) => {
  let post = await Blog.findById(req.params.id);

  if (!post) {
    throw new ErrorResponse('Blog post not found', 404);
  }

  // Since we're using requireAdmin middleware, no need to check ownership
  // Only admins can reach this point
  post = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: post,
    message: 'Blog post updated successfully'
  });
});

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
export const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    throw new ErrorResponse('Blog post not found', 404);
  }

  // Only admins can reach this point (protected by requireAdmin middleware)
  await Blog.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Blog post deleted successfully'
  });
});

// @desc    Add comment to blog post
// @route   POST /api/blog/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ErrorResponse('Comment content is required', 400);
  }

  const post = await Blog.findById(req.params.id);

  if (!post) {
    throw new ErrorResponse('Blog post not found', 404);
  }

  // Add comment with Firebase user info
  post.comments.push({
    userId: req.user.uid, // Firebase UID
    userName: req.user.displayName || 'Anonymous',
    userEmail: req.user.email,
    userAvatar: req.user.photoURL,
    content
  });

  await post.save();

  res.status(201).json({
    success: true,
    data: post.comments,
    message: 'Comment added successfully'
  });
});

// @desc    Like/unlike blog post
// @route   POST /api/blog/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    throw new ErrorResponse('Blog post not found', 404);
  }

  const likeIndex = post.likes.findIndex(like => like.userId === req.user.uid);

  if (likeIndex > -1) {
    // Unlike - remove from array
    post.likes.splice(likeIndex, 1);
  } else {
    // Like - add to array with user info
    post.likes.push({
      userId: req.user.uid,
      userName: req.user.displayName,
      userEmail: req.user.email
    });
  }

  await post.save();

  res.status(200).json({
    success: true,
    liked: likeIndex === -1, // true if just liked, false if just unliked
    likesCount: post.likes.length
  });
});

// @desc    Get related blog posts
// @route   GET /api/blog/:id/related
// @access  Public
export const getRelatedPosts = asyncHandler(async (req, res) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    throw new ErrorResponse('Blog post not found', 404);
  }

  const relatedPosts = await Blog.find({
    _id: { $ne: post._id },
    status: 'published',
    $or: [
      { categories: { $in: post.categories } },
      { tags: { $in: post.tags } }
    ]
  })
    .limit(4)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: relatedPosts.length,
    data: relatedPosts
  });
});