import express from 'express';
import {
  listPayments,
  createPayment,
  getPayment,
  updatePayment,
  deletePayment,
  checkPaymentStatus,
} from '../controllers/paymentController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, listPayments);
router.post('/', authMiddleware, createPayment);
router.get('/:id', authMiddleware, getPayment);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), updatePayment);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), deletePayment);
router.get('/:id/status', checkPaymentStatus);

export default router;
