"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Invoice_1 = __importDefault(require("../models/Invoice"));
const Payment_1 = __importDefault(require("../models/Payment"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// --- INVOICES ---
// @route   GET /api/finance/invoices
// @desc    Get all invoices
// @access  Private
router.get('/invoices', auth_1.protect, async (req, res) => {
    try {
        const invoices = await Invoice_1.default.find({ isDeleted: { $ne: true } })
            .populate('bookingId', 'bookingNo customerName')
            .sort('-createdAt');
        res.json(invoices);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   POST /api/finance/invoices
// @desc    Create invoice
// @access  Private
router.post('/invoices', auth_1.protect, upload_1.upload.single('document'), async (req, res) => {
    try {
        const invoice = await Invoice_1.default.create(req.body);
        // If a document was uploaded, we'd handle it here
        const filePath = req.file ? `/uploads/${req.file.filename}` : null;
        res.status(201).json({ invoice, document: filePath });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   PATCH /api/finance/invoices/:id
// @desc    Update invoice
// @access  Private
router.patch('/invoices/:id', auth_1.protect, async (req, res) => {
    try {
        const invoice = await Invoice_1.default.findById(req.params.id);
        if (invoice && !invoice.isDeleted) {
            Object.assign(invoice, req.body);
            const updated = await invoice.save();
            res.json(updated);
        }
        else {
            res.status(404).json({ error: 'Invoice not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// --- PAYMENTS ---
// @route   GET /api/finance/payments
// @desc    Get all payments
// @access  Private
router.get('/payments', auth_1.protect, async (req, res) => {
    try {
        const payments = await Payment_1.default.find({ isDeleted: { $ne: true } })
            .populate('bookingId', 'bookingNo customerName')
            .sort('-createdAt');
        res.json(payments);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   POST /api/finance/payments
// @desc    Record payment
// @access  Private
router.post('/payments', auth_1.protect, upload_1.upload.single('receipt'), async (req, res) => {
    try {
        const payment = await Payment_1.default.create(req.body);
        const receiptPath = req.file ? `/uploads/${req.file.filename}` : null;
        res.status(201).json({ payment, receipt: receiptPath });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
