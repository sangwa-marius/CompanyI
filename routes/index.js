const companyRoutes = require('./companyRoutes');
const departmentRoutes = require('./departmentRoutes');
const employeeRoutes = require('./employeeRoutes');
const projectRoutes = require('./projectRoutes');
const roleRoutes = require('./roleRoutes');
const userRoutes = require('./userRoutes');
const express =require('express');
const router = express.Router();

router.use('/auth',userRoutes);
router.use('/role',roleRoutes);
router.use('/company',companyRoutes);
router.use('/employee',employeeRoutes);
router.use('/project',projectRoutes);
router.use('/department',departmentRoutes);

module.exports = router;