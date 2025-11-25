import express from 'express';
import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  addComment,
  toggleLike,
  getRelatedPosts
} from '../controllers/blogController.js';
import { protect, requireAdmin } from '../middleware/firebaseAuth.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getBlogPosts);

router.route('/:idOrSlug')
  .get(getBlogPost);

router.route('/:id/related')
  .get(getRelatedPosts);

// Protected routes - Admin only for blog management
router.route('/')
  .post(protect, requireAdmin, createBlogPost);

router.route('/:id')
  .put(protect, requireAdmin, updateBlogPost)
  .delete(protect, requireAdmin, deleteBlogPost);

// Protected routes - Any authenticated user can comment and like
router.route('/:id/comments')
  .post(protect, addComment);

router.route('/:id/like')
  .post(protect, toggleLike);

export default router;