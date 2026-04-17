import * as express from 'express';
import * as employee from '../controllers/employeeController';
import auth from '../middleware/auth';
import validate from '../middleware/validator';
import { addEmployeeSchema, updateEmployeeByIdSchema } from '../validations/employeeValidations';

const router = express.Router();

router.get('/' ,auth, employee.getAllEmployees);
router.get('/:names',auth, employee.searchEmployeesByName);  // use query, not param
router.post('/',auth,validate(addEmployeeSchema), employee.addEmployee);
router.put('/:id',auth, validate(updateEmployeeByIdSchema), employee.updateEmployeeById)
router.delete('/:id',auth, employee.deleteEmployeeById);

export default router;
