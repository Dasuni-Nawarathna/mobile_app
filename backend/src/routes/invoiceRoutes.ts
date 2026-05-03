import express from 'express';
import {
  listInvoices,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
} from '../controllers/invoiceController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, listInvoices);
router.post('/', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), createInvoice);
router.get('/:id', authMiddleware, getInvoice);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), updateInvoice);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), deleteInvoice);

export default router;
