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
router.get('/' , employee.getAllEmployees);

/**
 * @swagger
 * /api/v1/employee/{names}:
 *  get:
 *    summary: Get employees by names
 *    tags:
 *      - Employees
 *    parameters:
 *      - in: path
 *        name: names
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successfully retrieved employees
 *      
 */

router.get('/:names', employee.searchEmployeesByName);  // use query, not param

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
router.post('/',validate(addEmployeeSchema), employee.addEmployee);

/**
 * @swagger
 * /api/v1/employee/{id}:
 *   put:
 *     summary: Update an employee by id
 *     tags:
 *       - Employees  
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
router.put('/:id', validate(updateEmployeeByIdSchema), employee.updateEmployeeById)

/**
 * @swagger
 * /api/v1/employee/{id}:
 *   delete:
 *     summary: Delete one employee by names
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         require: true
 *         schema:
 *           type: true
 *     responses:
 *       200:
 *         descrption: Employee deleted successfully
 */
router.delete('/:id', employee.deleteEmployeeById);

module.exports = router;
