import * as express from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController';
import validate from '../middleware/validator';
import { regiseterSchema, loginSchema, forgotPasswordSchema } from '../validations/userValidations';
import authLimiter from '../middleware/rateLimiter';

const router = express.Router();

router.post('/register', validate(regiseterSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
