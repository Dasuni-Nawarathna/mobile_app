"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// @route   GET /api/vehicles
// @desc    Get all vehicles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle_1.default.find({ isDeleted: { $ne: true } });
        res.json(vehicles);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   GET /api/vehicles/:id
// @desc    Get vehicle by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle_1.default.findById(req.params.id);
        if (vehicle && !vehicle.isDeleted) {
            res.json(vehicle);
        }
        else {
            res.status(404).json({ error: 'Vehicle not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   POST /api/vehicles
// @desc    Create a vehicle
// @access  Private
router.post('/', auth_1.protect, upload_1.upload.array('images', 5), async (req, res) => {
    try {
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const vehicle = await Vehicle_1.default.create({
            ...req.body,
            images: imagePaths.length > 0 ? imagePaths : req.body.images
        });
        res.status(201).json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   PATCH /api/vehicles/:id
// @desc    Update a vehicle
// @access  Private
router.patch('/:id', auth_1.protect, upload_1.upload.array('images', 5), async (req, res) => {
    try {
        const vehicle = await Vehicle_1.default.findById(req.params.id);
        if (vehicle && !vehicle.isDeleted) {
            Object.assign(vehicle, req.body);
            if (req.files && req.files.length > 0) {
                const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
                vehicle.images = [...vehicle.images, ...imagePaths];
            }
            const updatedVehicle = await vehicle.save();
            res.json(updatedVehicle);
        }
        else {
            res.status(404).json({ error: 'Vehicle not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   DELETE /api/vehicles/:id
// @desc    Delete a vehicle
// @access  Private
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const vehicle = await Vehicle_1.default.findById(req.params.id);
        if (vehicle) {
            vehicle.isDeleted = true;
            vehicle.deletedAt = new Date();
            await vehicle.save();
            res.json({ message: 'Vehicle removed' });
        }
        else {
            res.status(404).json({ error: 'Vehicle not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
