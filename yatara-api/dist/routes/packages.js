"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Package_1 = __importDefault(require("../models/Package"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// @route   GET /api/packages
// @desc    Get all packages
// @access  Public
router.get('/', async (req, res) => {
    try {
        const packages = await Package_1.default.find({ isDeleted: { $ne: true } });
        res.json(packages);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   GET /api/packages/:id
// @desc    Get package by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const pkg = await Package_1.default.findById(req.params.id);
        if (pkg && !pkg.isDeleted) {
            res.json(pkg);
        }
        else {
            res.status(404).json({ error: 'Package not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   POST /api/packages
// @desc    Create a package
// @access  Private
router.post('/', auth_1.protect, upload_1.upload.single('image'), async (req, res) => {
    try {
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }
        const pkg = await Package_1.default.create({
            ...req.body,
            heroImage: imagePath || req.body.heroImage
        });
        res.status(201).json(pkg);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   PATCH /api/packages/:id
// @desc    Update a package
// @access  Private
router.patch('/:id', auth_1.protect, upload_1.upload.single('image'), async (req, res) => {
    try {
        const pkg = await Package_1.default.findById(req.params.id);
        if (pkg && !pkg.isDeleted) {
            Object.assign(pkg, req.body);
            if (req.file) {
                pkg.heroImage = `/uploads/${req.file.filename}`;
            }
            const updatedPackage = await pkg.save();
            res.json(updatedPackage);
        }
        else {
            res.status(404).json({ error: 'Package not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   DELETE /api/packages/:id
// @desc    Delete a package
// @access  Private
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const pkg = await Package_1.default.findById(req.params.id);
        if (pkg) {
            pkg.isDeleted = true;
            pkg.deletedAt = new Date();
            await pkg.save();
            res.json({ message: 'Package removed' });
        }
        else {
            res.status(404).json({ error: 'Package not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
