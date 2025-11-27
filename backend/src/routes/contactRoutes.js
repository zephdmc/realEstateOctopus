import express from 'express';
import {
  getContactMessages,
  getContactMessage,
  createContactMessage,
  updateContactMessage,
  addNote,
  getContactStats
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.route('/')
  .post(createContactMessage);

// Admin routes
router.route('/')
  .get(protect, authorize('admin'), getContactMessages);

router.route('/stats')
  .get(protect, authorize('admin'), getContactStats);

router.route('/:id')
  .get(protect, authorize('admin'), getContactMessage)
  .put(protect, authorize('admin'), updateContactMessage);

router.route('/:id/notes')
  .post(protect, authorize('admin'), addNote);

export default router;