import express from 'express';
import propertyRoutes from './propertyRoutes.js';
import blogRoutes from './blogRoutes.js';
import contactRoutes from './contactRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

// API routes
router.use('/properties', propertyRoutes);
router.use('/blog', blogRoutes);
router.use('/contact', contactRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);

export default router;