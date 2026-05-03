import express from 'express';
import {
  listPackages,
  createPackage,
  getPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/packages
 * List packages (public endpoint, shows published packages only)
 */
router.get('/', listPackages);

/**
 * POST /api/packages
 * Create package (admin/staff only)
 */
router.post('/', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), createPackage);

/**
 * GET /api/packages/:id
 * Get single package by ID
 */
router.get('/:id', getPackage);

/**
 * PUT /api/packages/:id
 * Update package (admin/staff only)
 */
router.put('/:id', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), updatePackage);

/**
 * DELETE /api/packages/:id
 * Delete package (admin only)
 */
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), deletePackage);

export default router;
