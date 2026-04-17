import * as express from 'express';
const router = express.Router();
import * as company from '../controllers/companyControllers';
import auth from '../middleware/auth';
import validate from '../middleware/validator';
import { addCompanySchema, updateCompanyByIdSchema } from '../validations/companyValidations';

router.get('/',auth,company.getAllCompanies);
router.get('/:name',auth,company.getCompaniesByName);
router.post('/',auth,validate(addCompanySchema),company.addCompany);
router.put('/:id',auth,validate(updateCompanyByIdSchema),company.updateCompanyById);
router.delete('/:id',auth,company.deletecompanyById);

export default router;