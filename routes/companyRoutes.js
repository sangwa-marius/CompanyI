const express = require('express');
const router = express.Router();
const company = require('../controllers/companyControllers')

router.post('/addCompany',company.addCompany);

module.exports = router;