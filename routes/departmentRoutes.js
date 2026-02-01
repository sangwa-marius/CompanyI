const department = require('../controllers/departmentControllers');
const express = require('express');
const auth = require('../middleware/auth')
const router = express.Router();


router.get('/department', auth, department.getAllDepartments);
router.get('/department/:name', auth, department.getDepartmentsByName);
router.post('/department', auth, department.addDepartment);
router.put('/department/:name', auth, department.updateDepartmentByName);
router.delete('/department/:name', auth, department.deleteDepartmentByName);

module.exports = router;