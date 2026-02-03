const express = require('express');
const user = require('../controllers/authController')
const validate = require('../middleware/validator');
const regiseterSchema = require('../validations/userValidations')
const router = express.Router();
router.post('/register', validate(regiseterSchema), user.register);
router.post('/login', user.login)

module.exports = router
