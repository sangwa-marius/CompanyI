const express = require('express');
const router = express.Router();
const company = require('../controllers/companyControllers')
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const {addCompanySchema,updateCompanyById} = require('../validations/companyValidations')

router.get('/',auth,company.getAllCompanies);
router.get('/:name',auth,company.getCompaniesByName);
router.post('/',auth,validate(addCompanySchema),company.addCompany);
router.put('/:id',auth,validate(updateCompanyById),company.updateCompanyById);
router.delete('/:id',auth,company.deletecompanyById);

module.exports = router;