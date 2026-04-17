import * as department from '../controllers/departmentControllers';
import * as express from 'express';
import auth from '../middleware/auth';
import { addDepartmentSchema, updateDepartmentByIdSchema } from '../validations/departmentValidations';
import validate from '../middleware/validator';
const router = express.Router();

router.get('/',auth, department.getAllDepartments);
router.get('/:name',auth, department.getDepartmentsByName);
router.post('/', auth, validate(addDepartmentSchema), department.addDepartment);
router.put('/:id', auth, validate(updateDepartmentByIdSchema), department.updateDepartmentById);
router.delete('/:id',auth, department.deleteDepartmentById);

export default router;