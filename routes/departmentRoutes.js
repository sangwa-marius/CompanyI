const department = require('../controllers/departmentControllers');
const express = require('express');
const auth = require('../middleware/auth')
const departmentSchema = require('../validations/departmentValidations')
const validate = require('../middleware/validator')
const router = express.Router();

/**
 * @swagger
 * /api/v1/department:
 *   get:
 *     summary: Get all departments
 *     tags:
 *       - Departments
 *     responses:
 *       200:
 *         description: List of departments
 *       404: 
 *         description: Not found
 */

router.get('/',auth, department.getAllDepartments);

/**
 * @swagger
 * /api/v1/department/{name}:
 *   get:
 *     summary: Get departments by name
 *     tags:
 *       - Departments
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200: 
 *         description: List of departments
 *       404:
 *         description: Not found     
 */
router.get('/:name',auth, department.getDepartmentsByName);

/**
 * @swagger
 * /api/v1/department:
 *   post:
 *     summary: Add a department
 *     tags:
 *       - Departments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               company:
 *                 type: string
 *               manager:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success       
 */
router.post('/',auth, validate(departmentSchema.addDepartmentSchema), department.addDepartment);


/**
 * @swagger
 * /api/v1/department/{id}:
 *   put:
 *     summary: Update department
 *     tags:
 *       - Departments
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
 *               company:
 *                 type: string
 *               manage:
 *                 type: string
 * 
 *     responses:
 *         200:
 *           description: Department updated
 */
router.put('/:id',auth, validate(departmentSchema.updateDepartmentByIdSchema),department.updateDepartmentById);


/**
 * @swagger
 * /api/v1/department/{id}:
 *   delete:
 *     summary: Delete a department by id
 *     tags:
 *       - Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department deleted
 */
router.delete('/:id',auth, department.deleteDepartmentById);

module.exports = router;