const express = require('express');
const employee= require('../controllers/employeeController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const {addEmployeeSchema, updateEmployeeByIdSchema} = require('../validations/employeeValidations')

const router = express.Router();

/**
 * @swagger
 * /api/v1/employee:
 *   get:
 *     summary: Get All Employess
 *     tags:
 *       - Employees
 *     responses:
 *       200:
 *         description: Employees fetched successfully
 */
router.get('/employee', auth, employee.getAllEmployees);

/**
 * @swagger
 * /api/v1/employee/:search:
 *  get:
 *    summary: Get employees by names
 *    tags:
 *      - Employees
 *    parameters:
 *      - in: query
 *        name: name
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: OK          
 */

router.get('/:search', auth, employee.searchEmployeesByName);  // use query, not param

/**
 * @swagger
 * /api/v1/employee:
 *   post:
 *     summary: Add one Employee
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - names
 *               - email
 *               - age
 *               - salary
 *             properties:
 *               names:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               department:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *               hiredAt:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee added successfully
 */
router.post('/',auth,validate(addEmployeeSchema), employee.addEmployee);

/**
 * @swagger
 * /api/v1/employee/{id}:
 *   delete:
 *     summary: Delete one employee by names
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: names
 *         require: true
 *         schema:
 *           type: true
 *     responses:
 *       200:
 *         descrption: Employee deleted successfully
 */
router.put('/:id',auth, validate(updateEmployeeByIdSchema), employee.updateEmployeeById)
router.delete('/:id',auth, employee.deleteEmployeeById);

module.exports = router;
