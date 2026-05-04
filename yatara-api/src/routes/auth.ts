import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import { SelfRegisterRoles, UserRoles } from '../lib/constants';

const router = express.Router();

const generateToken = (id: string, email: string, role: string) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });
};

const buildUserResponse = (user: any, token?: string) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  avatar: user.avatar,
  phone: user.phone,
  ...(token ? { token } : {}),
});

// -------------------------------------------------------------
// @route   POST /api/auth/register
// @desc    Register a new user with role selection
// @access  Public
// -------------------------------------------------------------
router.post('/register', async (req: any, res: any) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password.' });
    }

    // Only allow self-registerable roles; default to TOURIST
    const requestedRole = role && (SelfRegisterRoles as readonly string[]).includes(role)
      ? role
      : 'TOURIST';

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Drivers and Hotel Managers start as PENDING_APPROVAL; Tourists are immediately ACTIVE
    const status = requestedRole === 'TOURIST' ? 'ACTIVE' : 'PENDING_APPROVAL';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || undefined,
      role: requestedRole,
      status,
      emailVerified: true, // simplified for demo
    });

    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(201).json(buildUserResponse(user, token));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// @route   POST /api/auth/login
// @desc    Auth user & return JWT + role for smart routing
// @access  Public
// -------------------------------------------------------------
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: { $ne: true },
    }).select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'DISABLED') {
      return res.status(403).json({ error: 'Your account has been deactivated. Please contact support.' });
    }

    // Best-effort last login update — non-blocking
    User.findByIdAndUpdate(user._id, { lastLogin: new Date() }).catch(() => {});

    const token = generateToken(user._id.toString(), user.email, user.role);
    res.json(buildUserResponse(user, token));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// @route   GET /api/auth/me
// @desc    Get current authenticated user profile
// @access  Private
// -------------------------------------------------------------
router.get('/me', protect, async (req: AuthRequest, res: any) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(buildUserResponse(user));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// @route   PATCH /api/auth/change-password
// @desc    Update own password
// @access  Private
// -------------------------------------------------------------
router.patch('/change-password', protect, async (req: AuthRequest, res: any) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide currentPassword and newPassword.' });
    }

    const user = await User.findById(req.user.id).select('+passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect.' });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
