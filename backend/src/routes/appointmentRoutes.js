import express from 'express';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.route('/')
  .post(createAppointment);

router.route('/availability/:agentId')
  .get(getAvailableSlots);

// Protected routes
router.route('/')
  .get(protect, getAppointments);

router.route('/:id')
  .get(protect, getAppointment)
  .put(protect, updateAppointment);

router.route('/:id/cancel')
  .put(protect, cancelAppointment);

export default router;