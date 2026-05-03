import { Request, Response } from 'express';

/**
 * GET /api/bookings
 * List all bookings (role-based: users see own, staff/admin see all)
 */
export async function listBookings(req: Request, res: Response) {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const user = (req as any).user;

    // TODO: Connect to Booking model
    // const filter: any = { isDeleted: false };
    // if (user.role === 'USER') filter.email = user.email;
    // if (status) filter.status = status;

    // const bookings = await Booking.find(filter)
    //   .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    //   .limit(parseInt(limit as string))
    //   .sort({ createdAt: -1 });

    // Mock data
    const bookings = [
      {
        _id: '1',
        bookingNo: 'BK001',
        customerName: 'John Doe',
        status: 'CONFIRMED',
        totalAmount: 500,
      },
    ];

    res.json({
      data: bookings,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: bookings.length,
      },
    });
  } catch (error) {
    console.error('❌ Error listing bookings:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to list bookings',
      },
    });
  }
}

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function createBooking(req: Request, res: Response) {
  try {
    const { customerName, email, phone, packageId, dates, notes } = req.body;

    if (!customerName || !email || !phone || !packageId || !dates) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Missing required fields',
        },
      });
    }

    // TODO: Create booking in database
    // const booking = await Booking.create({
    //   customerName,
    //   email,
    //   phone,
    //   packageId,
    //   dates,
    //   notes,
    //   status: 'PENDING',
    // });

    const booking = {
      _id: 'new-booking',
      bookingNo: 'BK-' + Date.now(),
      customerName,
      email,
      status: 'PENDING',
    };

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to create booking',
      },
    });
  }
}

/**
 * GET /api/bookings/:id
 * Get a single booking by ID
 */
export async function getBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // TODO: Fetch booking from database
    // const booking = await Booking.findById(id);
    // if (!booking) {
    //   return res.status(404).json({ error: { status: 404, message: 'Booking not found' } });
    // }
    // if (user.role === 'USER' && booking.email !== user.email) {
    //   return res.status(403).json({ error: { status: 403, message: 'Access denied' } });
    // }

    const booking = {
      _id: id,
      bookingNo: 'BK001',
      customerName: 'John Doe',
      status: 'CONFIRMED',
    };

    res.json(booking);
  } catch (error) {
    console.error('❌ Error fetching booking:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to fetch booking',
      },
    });
  }
}

/**
 * PUT /api/bookings/:id
 * Update a booking
 */
export async function updateBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // TODO: Update booking in database
    // const booking = await Booking.findByIdAndUpdate(id, updates, { new: true });

    const booking = { _id: id, ...updates };

    res.json({
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    console.error('❌ Error updating booking:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to update booking',
      },
    });
  }
}

/**
 * DELETE /api/bookings/:id
 * Cancel a booking
 */
export async function deleteBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // TODO: Delete booking from database
    // const booking = await Booking.findByIdAndDelete(id);

    res.json({
      message: 'Booking cancelled successfully',
      id,
    });
  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to cancel booking',
      },
    });
  }
}

/**
 * PUT /api/bookings/:id/status
 * Update booking status
 */
export async function updateBookingStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: { status: 400, message: 'Status is required' },
      });
    }

    // TODO: Update status in database
    // const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

    res.json({
      message: 'Booking status updated',
      status,
    });
  } catch (error) {
    console.error('❌ Error updating status:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Failed to update booking status',
      },
    });
  }
}
