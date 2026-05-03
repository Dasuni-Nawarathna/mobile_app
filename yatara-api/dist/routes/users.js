"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const users = await User_1.default.find({ isDeleted: { $ne: true } }).select('-passwordHash');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-passwordHash');
        if (user && !user.isDeleted) {
            res.json(user);
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   PATCH /api/users/:id
// @desc    Update user profile & avatar
// @access  Private
router.patch('/:id', auth_1.protect, upload_1.upload.single('avatar'), async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
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
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   DELETE /api/users/:id
// @desc    Soft delete user
// @access  Private
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (user) {
            user.isDeleted = true;
            user.deletedAt = new Date();
            await user.save();
            res.json({ message: 'User removed' });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
