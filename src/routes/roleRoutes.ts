import * as role from '../controllers/roleControllers';
import * as roleSchema from '../validations/roleValidations';
import auth from '../middleware/auth';
import validate from '../middleware/validator';
import express from 'express';

const router = express.Router();

router.get('/:companyId',auth,role.getCompanyRoles);
router.post('/',auth, validate(roleSchema.addRoleSchema),role.addRole);
router.put('/:id', auth, validate(roleSchema.updateRoleSchema),role.updateRoleById );
router.delete('/:id', auth,role.deleteRoleById);


export default router;