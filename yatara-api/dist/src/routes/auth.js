"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
const generateToken = (id, email, role) => {
    return jsonwebtoken_1.default.sign({ id, email, role }, process.env.JWT_SECRET, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d'),
    });
};
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please add all required fields (name, email, password)' });
        }
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'A user with this email already exists. Please log in.' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const user = await User_1.default.create({
            name,
            email,
            passwordHash,
            phone,
            role: 'USER',
            status: 'ACTIVE',
            emailVerified: true // Set true for demo purposes
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id.toString(), user.email, user.role),
            });
        }
        else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide both email and password' });
        }
        const user = await User_1.default.findOne({ email, isDeleted: { $ne: true } }).select('+passwordHash');
        if (user && (await bcryptjs_1.default.compare(password, user.passwordHash))) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id.toString(), user.email, user.role),
            });
        }
        else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
