import express from 'express';
import Booking from '../models/Booking';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Private
router.get('/', protect, async (req: any, res: any) => {
  try {
    // If regular user, only show their bookings. If admin/staff, show all.
    const filter: any = { isDeleted: { $ne: true } };
    if (req.user.role === 'USER') {
      filter.email = req.user.email;
    }

    const bookings = await Booking.find(filter)
      .populate('packageId', 'title heroImage')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', protect, async (req: any, res: any) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('packageId', 'title heroImage')
      .populate('assignedVehicleId')
      .populate('assignedStaffId');
      
    if (booking && !booking.isDeleted) {
      // Check ownership
      if (req.user.role === 'USER' && booking.email !== req.user.email) {
        return res.status(403).json({ error: 'Not authorized to view this booking' });
      }
      res.json(booking);
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', protect, upload.array('attachments', 3), async (req: any, res: any) => {
  try {
    const filePaths = req.files ? (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) : [];

    const booking = await Booking.create({
      ...req.body,
      email: req.user.role === 'USER' ? req.user.email : req.body.email,
      // We don't have attachments in standard booking model directly usually, but if needed we can handle it
      // Let's assume there's a notes field or something where we can append docs, or an attachment model
      // For assignment purposes, we just return the uploaded paths
    });

    res.status(201).json({ booking, attachments: filePaths });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   PATCH /api/bookings/:id
// @desc    Update a booking
// @access  Private
router.patch('/:id', protect, async (req: any, res: any) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking && !booking.isDeleted) {
      Object.assign(booking, req.body);
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private
router.delete('/:id', protect, async (req: any, res: any) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.isDeleted = true;
      booking.deletedAt = new Date();
      await booking.save();
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
