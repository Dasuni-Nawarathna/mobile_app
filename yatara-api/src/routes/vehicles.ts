import express from 'express';
import Vehicle from '../models/Vehicle';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// @route   GET /api/vehicles
// @desc    Get all vehicles
// @access  Public
router.get('/', async (req: any, res: any) => {
  try {
    const vehicles = await Vehicle.find({ isDeleted: { $ne: true } });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   GET /api/vehicles/:id
// @desc    Get vehicle by ID
// @access  Public
router.get('/:id', async (req: any, res: any) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle && !vehicle.isDeleted) {
      res.json(vehicle);
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   POST /api/vehicles
// @desc    Create a vehicle
// @access  Private
router.post('/', protect, upload.array('images', 5), async (req: any, res: any) => {
  try {
    const imagePaths = req.files ? (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) : [];

    const vehicle = await Vehicle.create({
      ...req.body,
      images: imagePaths.length > 0 ? imagePaths : req.body.images
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   PATCH /api/vehicles/:id
// @desc    Update a vehicle
// @access  Private
router.patch('/:id', protect, upload.array('images', 5), async (req: any, res: any) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle && !vehicle.isDeleted) {
      Object.assign(vehicle, req.body);
      
      if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        const imagePaths = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
        vehicle.images = [...vehicle.images, ...imagePaths];
      }

      const updatedVehicle = await vehicle.save();
      res.json(updatedVehicle);
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   DELETE /api/vehicles/:id
// @desc    Delete a vehicle
// @access  Private
router.delete('/:id', protect, async (req: any, res: any) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      vehicle.isDeleted = true;
      vehicle.deletedAt = new Date();
      await vehicle.save();
      res.json({ message: 'Vehicle removed' });
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
