import express from 'express';
import {
  listPartners,
  createPartner,
  getPartner,
  updatePartner,
  deletePartner,
} from '../controllers/partnerController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', listPartners);
router.post('/', authMiddleware, createPartner);
router.get('/:id', getPartner);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), updatePartner);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), deletePartner);

export default router;
