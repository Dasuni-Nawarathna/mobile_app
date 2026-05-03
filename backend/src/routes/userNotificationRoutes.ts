import express from 'express';
import {
  listUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  listNotifications,
  createNotification,
  getNotification,
  updateNotification,
  deleteNotification,
} from '../controllers/userNotificationController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// ═══════════════════════════════════════════════════════════
// USER ROUTES
// ═══════════════════════════════════════════════════════════

router.get('/users', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), listUsers);
router.post('/users', authMiddleware, roleMiddleware('ADMIN'), createUser);
router.get('/users/:id', authMiddleware, getUser);
router.put('/users/:id', authMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware('ADMIN'), deleteUser);

// ═══════════════════════════════════════════════════════════
// NOTIFICATION ROUTES
// ═══════════════════════════════════════════════════════════

router.get('/notifications', authMiddleware, listNotifications);
router.post('/notifications', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), createNotification);
router.get('/notifications/:id', authMiddleware, getNotification);
router.put('/notifications/:id', authMiddleware, updateNotification);
router.delete('/notifications/:id', authMiddleware, roleMiddleware('ADMIN'), deleteNotification);

export default router;
