import { Router } from 'express';
import { login, me, signup } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, signupSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/signup', validate(signupSchema), asyncHandler(signup));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.get('/me', protect, asyncHandler(me));

export default router;
