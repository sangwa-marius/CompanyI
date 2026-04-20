import * as express from 'express';
const router = express.Router();
import * as company from '../controllers/companyControllers';
import auth from '../middleware/auth';
import validate from '../middleware/validator';
import { addCompanySchema, updateCompanyByIdSchema } from '../validations/companyValidations';

router.get('/get-all-companies',auth,company.getAllCompanies);
router.get('get-company/:id',auth,company.getCompany);
router.post('/add-company',auth,validate(addCompanySchema),company.addCompany);
router.put('/update-company/:id',auth,validate(updateCompanyByIdSchema),company.updateCompanyById);
router.delete('/delete-company/:id',auth,company.deletecompanyById);

export default router;