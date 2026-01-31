const express = require('express');
const router = express.Router();
const company = require('../controllers/companyControllers')
const auth = require('../middleware/auth')

router.get('/company',auth,company.getAllCompanies);
router.get('/company/:name',company.getCompaniesByName);
router.post('/company',company.addCompany);
router.put('/company/:name',company.updateCompanyByName);
router.delete('/company/:name',company.deletecompanyByName);

module.exports = router;