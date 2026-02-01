const express = require('express');
const router = express.Router();
const company = require('../controllers/companyControllers')
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const {addCompanySchema,updateCompanyById} = require('../validations/companyValidations')

router.get('/company',auth,company.getAllCompanies);
router.get('/company/:name',auth,company.getCompaniesByName);
router.post('/company',auth,validate(addCompanySchema),company.addCompany);
router.put('/company/:id',auth,validate(updateCompanyById),company.updateCompanyById);
router.delete('/company/:id',auth,company.deletecompanyById);

module.exports = router;