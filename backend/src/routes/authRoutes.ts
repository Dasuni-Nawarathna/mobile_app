import express from 'express';
import { register, login, logout } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { email, password, firstName, lastName }
 * Returns: { user, token }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login and get JWT token
 * Body: { email, password }
 * Returns: { user, token }
 */
router.post('/login', login);

/**
 * POST /api/auth/logout
 * Logout (requires valid token)
 * Headers: { Authorization: 'Bearer <token>' }
 */
router.post('/logout', authMiddleware, logout);

export default router;
