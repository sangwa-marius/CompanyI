import express from 'express';
import employee from '../controllers/employeeController';
import auth from '../middleware/auth';
import validate from '../middleware/validator';
import { addEmployeeSchema, updateEmployeeByIdSchema } from '../validations/employeeValidations';

const router = express.Router();

router.get('/get-employees/:company' ,auth, employee.getCompanyEmployees);
router.get('/get-employee/:id',auth, employee.getEmployeeById); 
router.post('/add-employee',auth,validate(addEmployeeSchema), employee.addEmployee);
router.put('/:id',auth, validate(updateEmployeeByIdSchema), employee.updateEmployeeById)
router.delete('/:id',auth, employee.deleteEmployeeById);

export default router;
