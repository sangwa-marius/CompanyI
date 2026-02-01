const express = require('express');
const user = require('../controllers/authController')
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const regiseterSchema = require('../validations/userValidations')
const router = express.Router();
router.post('/register',auth, validate(regiseterSchema), user.register);
router.post('/login', user.login)

module.exports = router
