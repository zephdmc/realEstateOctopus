// import express from 'express';
// import {
//   getProperties,
//   getProperty,
//   createProperty,
//   updateProperty,
//   deleteProperty,
//   getFeaturedProperties,
//   getPropertiesByAgent,
//   getMyProperties
// } from '../controllers/propertyController.js';
// import { protect, requireAdmin, optionalAuth } from '../middleware/firebaseAuth.js';

// const router = express.Router();

// // Public routes - SPECIFIC ROUTES FIRST
// router.get('/', getProperties);
// router.get('/featured', getFeaturedProperties);
// router.get('/agent/:agentId', getPropertiesByAgent);

// // Protected admin routes - SPECIFIC ROUTES FIRST
// router.get('/my/properties', protect, requireAdmin, getMyProperties); // ← This should work now

// // Parameterized routes - THESE GO LAST
// router.get('/:id', getProperty);

// // Other protected routes
// router.post('/', protect, requireAdmin, createProperty);
// router.put('/:id', protect, requireAdmin, updateProperty);
// router.delete('/:id', protect, requireAdmin, deleteProperty);

// export default router;


import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  getPropertiesByAgent,
  getMyProperties,
  searchProperties,
  quickSearch,
  filterProperties
} from '../controllers/propertyController.js';
import { protect, requireAdmin, optionalAuth } from '../middleware/firebaseAuth.js';

const router = express.Router();

// Public routes - SPECIFIC ROUTES FIRST
router.get('/', getProperties); // Gets all properties with optional filters
router.get('/featured', getFeaturedProperties);
router.get('/agent/:agentId', getPropertiesByAgent);

// Search and Filter routes - DEDICATED ENDPOINTS
router.get('/search', quickSearch); // Quick search (single query parameter)
router.get('/search/advanced', searchProperties); // Advanced search with multiple filters
router.get('/filter', filterProperties); // Filter-only endpoint (no general search)

// Protected admin routes - SPECIFIC ROUTES FIRST  
router.get('/my/properties', protect, requireAdmin, getMyProperties);

// Parameterized routes - THESE GO LAST
router.get('/:id', getProperty);

// Other protected routes
router.post('/', protect, requireAdmin, createProperty);
router.put('/:id', protect, requireAdmin, updateProperty);
router.delete('/:id', protect, requireAdmin, deleteProperty);

export default router;