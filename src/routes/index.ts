import companyRoutes from './companyRoutes';
import departmentRoutes from './departmentRoutes';
import employeeRoutes from './employeeRoutes';
import projectRoutes from './projectRoutes';
import userRoutes from './userRoutes';
import activityRoutes from './activityRoutes';
import express from 'express';
import auth from '../middleware/auth';
const router = express.Router();

router.use('/auth', userRoutes);
router.use(auth);
router.use('/company', companyRoutes);
router.use('/employee', employeeRoutes);
router.use('/project', projectRoutes);
router.use('/department', departmentRoutes);
router.use('/activity', activityRoutes);

export default router;