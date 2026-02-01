const role = require('../controllers/roleControllers');
const roleSchema = require('../validations/roleValidations');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const express = require('express');
const router = express.Router();

router.get('/role',auth,role.getAllRoles);
router.post('/role',auth, validate(roleSchema.addRoleSchema),role.addRole);
router.put('/role/:id', auth, validate(roleSchema.updateRoleSchema),role.updateRoleById );
router.delete('/router/:id', auth,role.deleteRoleById);

module.exports = router;