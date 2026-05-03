import express from 'express';
import {
  listVehicles,
  createVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', listVehicles);
router.post('/', authMiddleware, roleMiddleware('ADMIN', 'STAFF', 'VEHICLE_OWNER'), createVehicle);
router.get('/:id', getVehicle);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN', 'STAFF', 'VEHICLE_OWNER'), updateVehicle);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), deleteVehicle);

export default router;
