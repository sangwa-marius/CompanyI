const department = require('../controllers/departmentControllers');
const express = require('express');
const auth = require('../middleware/auth')
const departmentSchema = require('../validations/departmentValidations')
const validate = require('../middleware/validator')
const router = express.Router();


router.get('/department', auth, department.getAllDepartments);
router.get('/department/:name', auth, department.getDepartmentsByName);
router.post('/department', auth, validate(departmentSchema.addDepartmentSchema), department.addDepartment);
router.put('/department/:id', auth, validate(departmentSchema.updateDepartmentByIdSchema),department.updateDepartmentById);
router.delete('/department/:id', auth, department.deleteDepartmentById);

module.exports = router;