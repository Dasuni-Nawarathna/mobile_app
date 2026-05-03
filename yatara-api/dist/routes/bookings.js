"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Booking_1 = __importDefault(require("../models/Booking"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Private
router.get('/', auth_1.protect, async (req, res) => {
    try {
        // If regular user, only show their bookings. If admin/staff, show all.
        const filter = { isDeleted: { $ne: true } };
        if (req.user.role === 'USER') {
            filter.email = req.user.email;
        }
        const bookings = await Booking_1.default.find(filter)
            .populate('packageId', 'title heroImage')
            .sort('-createdAt');
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth_1.protect, async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id)
            .populate('packageId', 'title heroImage')
            .populate('assignedVehicleId')
            .populate('assignedStaffId');
        if (booking && !booking.isDeleted) {
            // Check ownership
            if (req.user.role === 'USER' && booking.email !== req.user.email) {
                return res.status(403).json({ error: 'Not authorized to view this booking' });
            }
            res.json(booking);
        }
        else {
            res.status(404).json({ error: 'Booking not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', auth_1.protect, upload_1.upload.array('attachments', 3), async (req, res) => {
    try {
        const filePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const booking = await Booking_1.default.create({
            ...req.body,
            email: req.user.role === 'USER' ? req.user.email : req.body.email,
            // We don't have attachments in standard booking model directly usually, but if needed we can handle it
            // Let's assume there's a notes field or something where we can append docs, or an attachment model
            // For assignment purposes, we just return the uploaded paths
        });
        res.status(201).json({ booking, attachments: filePaths });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   PATCH /api/bookings/:id
// @desc    Update a booking
// @access  Private
router.patch('/:id', auth_1.protect, async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id);
        if (booking && !booking.isDeleted) {
            Object.assign(booking, req.body);
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        }
        else {
            res.status(404).json({ error: 'Booking not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id);
        if (booking) {
            booking.isDeleted = true;
            booking.deletedAt = new Date();
            await booking.save();
            res.json({ message: 'Booking removed' });
        }
        else {
            res.status(404).json({ error: 'Booking not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
