import * as express from 'express';
import {register, login, forgotPassword} from '../controllers/authController';
import validate from '../middleware/validator';
import regiseterSchema from '../validations/userValidations';

const router = express.Router();

router.post('/register', validate(regiseterSchema), register);
router.post('/login', login)
router.post('/forgot-password', forgotPassword);

export default router;
