const department = require('../controllers/departmentControllers');
const express = require('express');
const auth = require('../middleware/auth')
const departmentSchema = require('../validations/departmentValidations')
const validate = require('../middleware/validator')
const router = express.Router();


router.get('/', auth, department.getAllDepartments);
router.get('/:name', auth, department.getDepartmentsByName);
router.post('/', auth, validate(departmentSchema.addDepartmentSchema), department.addDepartment);
router.put('/:id', auth, validate(departmentSchema.updateDepartmentByIdSchema),department.updateDepartmentById);
router.delete('/:id', auth, department.deleteDepartmentById);

module.exports = router;