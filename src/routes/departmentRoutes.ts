import * as department from '../controllers/departmentControllers';
import * as express from 'express';
import auth from '../middleware/auth';
import { addDepartmentSchema, updateDepartmentByIdSchema } from '../validations/departmentValidations';
import validate from '../middleware/validator';
const router = express.Router();

 
router.get('/get-company-departments/:company', department.getCompanyDepartments);
router.get('/get-department/:id', department.getDepartmentById);
router.post('/add-department',  validate(addDepartmentSchema), department.addDepartment);
router.put('/update-department/:id', validate(updateDepartmentByIdSchema), department.updateDepartmentById);
router.delete('/delete-department/:id', department.deleteDepartmentById);

export default router;