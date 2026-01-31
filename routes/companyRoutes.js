const express = require('express');
const router = express.Router();
const company = require('../controllers/companyControllers')

router.get('/company',company.getAllCompanies);
router.get('/company',company.getCompaniesByName);
router.post('company',company.addCompany);
router.put('/company',company.updateCompanyByName)

module.exports = router;