const role = require('../controllers/roleControllers');
const roleSchema = require('../validations/roleValidations');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/role:
 *   get:
 *     summary: Get all roles
 *     tags:
 *       - Roles
 *     responses:
 *       200:
 *         description: List of roles
 *       404: 
 *         description: Not found
 */

router.get('/',auth,role.getAllRoles);
/**
 * @swagger
 * /api/v1/role:
 *   post:
 *     summary: Add a role
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               permissons:
 *                 type: string
 *               company:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success       
 */

router.post('/',auth, validate(roleSchema.addRoleSchema),role.addRole);
/**
 * @swagger
 * /api/v1/role/{id}:
 *   put:
 *     summary: update role by id
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name: 
 *                 type: string
 *               permissions:
 *                 type: string
 *               company:
 *                 type: string
 * 
 *     responses:
 *         200:
 *           description: Role updated
 */
router.put('/:id', auth, validate(roleSchema.updateRoleSchema),role.updateRoleById );
/**
 * @swagger
 * /api/v1/role/{id}:
 *   delete:
 *     summary: Delete a role by id
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted
 */
router.delete('/:id', auth,role.deleteRoleById);


module.exports = router;