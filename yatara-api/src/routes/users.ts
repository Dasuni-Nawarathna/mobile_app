import express from 'express';
import User from '../models/User';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', protect, async (req: any, res: any) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } }).select('-passwordHash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (user && !user.isDeleted) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   PATCH /api/users/:id
// @desc    Update user profile & avatar
// @access  Private
router.patch('/:id', protect, upload.single('avatar'), async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);

    if (user && !user.isDeleted) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      
      if (req.file) {
        user.avatar = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await user.save();
      
      // Don't return password hash
      const userObj = updatedUser.toObject();
      delete userObj.passwordHash;
      
      res.json(userObj);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Soft delete user
// @access  Private
router.delete('/:id', protect, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.isDeleted = true;
      user.deletedAt = new Date();
      await user.save();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
