import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// -------------------------------------------------------------
// @route   GET /api/users
// @desc    List all users (admin/staff only)
// @access  Private — ADMIN, STAFF
// -------------------------------------------------------------
router.get('/', protect, authorize('ADMIN', 'STAFF'), async (req: any, res: any) => {
  try {
    const { role, status, search, page = 1, limit = 50 } = req.query;

    const filter: any = { isDeleted: { $ne: true } };
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ users, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// @route   POST /api/users
// @desc    Admin creates a demo/staff account with any role
// @access  Private — ADMIN only
// -------------------------------------------------------------
router.post('/', protect, authorize('ADMIN'), async (req: any, res: any) => {
  try {
    const { name, email, password, phone, role, status } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'name, email, password, and role are required.' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || undefined,
      role,
      status: status || 'ACTIVE',
      emailVerified: true,
    });

    const userObj = user.toObject() as any;
    delete userObj.passwordHash;
    res.status(201).json(userObj);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// @route   GET /api/users/pending
// @desc    Get all users pending approval (DRIVER, HOTEL_MANAGER)
// @access  Private — ADMIN, STAFF
// -------------------------------------------------------------
router.get('/pending', protect, authorize('ADMIN', 'STAFF'), async (req: any, res: any) => {
  try {
    const pending = await User.find({
      status: 'PENDING_APPROVAL',
      isDeleted: { $ne: true },
    }).select('-passwordHash').sort({ createdAt: -1 });

    res.json(pending);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
// -------------------------------------------------------------
router.get('/:id', protect, async (req: AuthRequest, res: any) => {
  try {
    // Users can only view their own profile unless they are ADMIN/STAFF
    const isAdminOrStaff = ['ADMIN', 'STAFF'].includes(req.user?.role);
    if (!isAdminOrStaff && req.user?.id !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized to view this profile.' });
    }

    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user || user.isDeleted) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// @route   PATCH /api/users/:id
// @desc    Update user (own profile fields; admin can also set role/status)
// @access  Private
// -------------------------------------------------------------
router.patch('/:id', protect, upload.single('avatar'), async (req: AuthRequest, res: any) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    const isOwner = req.user?.id === req.params.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Not authorized to update this profile.' });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Fields any authenticated user can update on their own profile
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.file) user.avatar = `/uploads/${req.file.filename}`;

    // Admin-only fields
    if (isAdmin) {
      if (req.body.role) user.role = req.body.role;
      if (req.body.status) user.status = req.body.status;
    }

    const updated = await user.save();
    const userObj = updated.toObject() as any;
    delete userObj.passwordHash;
    res.json(userObj);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// @route   PATCH /api/users/:id/approve
// @desc    Admin approves a pending service provider
// @access  Private — ADMIN only
// -------------------------------------------------------------
router.patch('/:id/approve', protect, authorize('ADMIN'), async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ error: 'User not found.' });
    }
    user.status = 'ACTIVE';
    await user.save();
    res.json({ message: `${user.name} (${user.role}) has been approved and is now ACTIVE.` });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// @route   PATCH /api/users/:id/reject
// @desc    Admin rejects a pending service provider
// @access  Private — ADMIN only
// -------------------------------------------------------------
router.patch('/:id/reject', protect, authorize('ADMIN'), async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ error: 'User not found.' });
    }
    user.status = 'REJECTED';
    await user.save();
    res.json({ message: `${user.name} has been rejected.` });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// @route   DELETE /api/users/:id
// @desc    Soft-delete user (admin only)
// @access  Private — ADMIN only
// -------------------------------------------------------------
router.delete('/:id', protect, authorize('ADMIN'), async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();
    res.json({ message: `${user.name}'s account has been deactivated.` });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
