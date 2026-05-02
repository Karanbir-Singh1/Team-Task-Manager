import { Router } from 'express';
import { listUsers } from '../controllers/user.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', protect, authorize('admin'), asyncHandler(listUsers));

export default router;
