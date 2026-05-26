import * as express from 'express';
const router = express.Router();
import * as company from '../controllers/companyControllers';
import auth from '../middleware/auth';
import validate from '../middleware/validator';
import { addCompanySchema, updateCompanyByIdSchema } from '../validations/companyValidations';

router.get('/get-all-companies',  company.getAllCompanies);
router.get('/get-your-companies', company.getYourCompanies)
router.get('get-company/:id', company.getCompany);
router.post('/add-company',  validate(addCompanySchema), company.addCompany);
router.put('/update-company/:id',  validate(updateCompanyByIdSchema), company.updateCompanyById);
router.delete('/delete-company/:id',  company.deletecompanyById);

export default router;