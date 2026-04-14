import companyRoutes from './companyRoutes';
import departmentRoutes from './departmentRoutes';
import employeeRoutes from './employeeRoutes';
import projectRoutes from './projectRoutes';
import roleRoutes from './roleRoutes';
import userRoutes from './userRoutes';
import * as express from 'express';
const router = express.Router();

router.use('/auth',userRoutes);
router.use('/role',roleRoutes);
router.use('/company',companyRoutes);
router.use('/employee',employeeRoutes);
router.use('/project',projectRoutes);
router.use('/department',departmentRoutes);

export default router;