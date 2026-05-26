import * as express from 'express';
import {register, login, forgotPassword, resetPassword} from '../controllers/authController';
import validate from '../middleware/validator';
import regiseterSchema from '../validations/userValidations';

const router = express.Router();

router.post('/register', validate(regiseterSchema), register);
router.post('/login', login)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
