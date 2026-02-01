const role = require('../controllers/roleControllers');
const roleSchema = require('../validations/roleValidations');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const express = require('express');
const router = express.Router();

router.get('/',auth,role.getAllRoles);
router.post('/',auth, validate(roleSchema.addRoleSchema),role.addRole);
router.put('/:id', auth, validate(roleSchema.updateRoleSchema),role.updateRoleById );
router.delete('/:id', auth,role.deleteRoleById);

module.exports = router;