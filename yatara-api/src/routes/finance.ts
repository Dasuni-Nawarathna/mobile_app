import express from 'express';
import Invoice from '../models/Invoice';
import Payment from '../models/Payment';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// --- INVOICES ---

// @route   GET /api/finance/invoices
// @desc    Get all invoices
// @access  Private
router.get('/invoices', protect, async (req: any, res: any) => {
  try {
    const invoices = await Invoice.find({ isDeleted: { $ne: true } })
      .populate('bookingId', 'bookingNo customerName')
      .sort('-createdAt');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   POST /api/finance/invoices
// @desc    Create invoice
// @access  Private
router.post('/invoices', protect, upload.single('document'), async (req: any, res: any) => {
  try {
    const invoice = await Invoice.create(req.body);
    // If a document was uploaded, we'd handle it here
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    res.status(201).json({ invoice, document: filePath });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   PATCH /api/finance/invoices/:id
// @desc    Update invoice
// @access  Private
router.patch('/invoices/:id', protect, async (req: any, res: any) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (invoice && !invoice.isDeleted) {
      Object.assign(invoice, req.body);
      const updated = await invoice.save();
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// --- PAYMENTS ---

// @route   GET /api/finance/payments
// @desc    Get all payments
// @access  Private
router.get('/payments', protect, async (req: any, res: any) => {
  try {
    const payments = await Payment.find({ isDeleted: { $ne: true } })
      .populate('bookingId', 'bookingNo customerName')
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// @route   POST /api/finance/payments
// @desc    Record payment
// @access  Private
router.post('/payments', protect, upload.single('receipt'), async (req: any, res: any) => {
  try {
    const payment = await Payment.create(req.body);
    const receiptPath = req.file ? `/uploads/${req.file.filename}` : null;
    
    res.status(201).json({ payment, receipt: receiptPath });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
