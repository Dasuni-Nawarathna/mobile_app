import express from 'express';
import Package from '../models/Package';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// @route   GET /api/packages
// @desc    Get all packages
// @access  Public
router.get('/', async (req: any, res: any) => {
  try {
    const packages = await Package.find({ isDeleted: { $ne: true } });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   GET /api/packages/:id
// @desc    Get package by ID
// @access  Public
router.get('/:id', async (req: any, res: any) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (pkg && !pkg.isDeleted) {
      res.json(pkg);
    } else {
      res.status(404).json({ error: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   POST /api/packages
// @desc    Create a package
// @access  Private
router.post('/', protect, upload.single('image'), async (req: any, res: any) => {
  try {
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const pkg = await Package.create({
      ...req.body,
      heroImage: imagePath || req.body.heroImage
    });

    res.status(201).json(pkg);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   PATCH /api/packages/:id
// @desc    Update a package
// @access  Private
router.patch('/:id', protect, upload.single('image'), async (req: any, res: any) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (pkg && !pkg.isDeleted) {
      Object.assign(pkg, req.body);
      
      if (req.file) {
        pkg.heroImage = `/uploads/${req.file.filename}`;
      }

      const updatedPackage = await pkg.save();
      res.json(updatedPackage);
    } else {
      res.status(404).json({ error: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   DELETE /api/packages/:id
// @desc    Delete a package
// @access  Private
router.delete('/:id', protect, async (req: any, res: any) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (pkg) {
      pkg.isDeleted = true;
      pkg.deletedAt = new Date();
      await pkg.save();
      res.json({ message: 'Package removed' });
    } else {
      res.status(404).json({ error: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
