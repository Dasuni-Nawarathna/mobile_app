import express from 'express';
import {
  listBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} from '../controllers/bookingController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/bookings
 * List bookings (protected: users see own, staff/admin see all)
 */
router.get('/', authMiddleware, listBookings);

/**
 * POST /api/bookings
 * Create booking (authenticated users)
 */
router.post('/', authMiddleware, createBooking);

/**
 * GET /api/bookings/:id
 * Get single booking (protected)
 */
router.get('/:id', authMiddleware, getBooking);

/**
 * PUT /api/bookings/:id
 * Update booking (admin/staff)
 */
router.put('/:id', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), updateBooking);

/**
 * DELETE /api/bookings/:id
 * Cancel booking (admin/staff)
 */
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), deleteBooking);

/**
 * PUT /api/bookings/:id/status
 * Update booking status (admin/staff)
 */
router.put('/:id/status', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), updateBookingStatus);

export default router;
