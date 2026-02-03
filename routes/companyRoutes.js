const express = require('express');
const router = express.Router();
const company = require('../controllers/companyControllers')
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const {addCompanySchema, updateCompanyByIdSchema} = require('../validations/companyValidations')
/**
 * @swagger
 * /api/v1/company:
 *   get:
 *     summary: Get all companies
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: List of all companies
 *       404:
 *         description: Not found
 *     
 */
router.get('/',auth,company.getAllCompanies);

/**
 * @swagger
 * /api/v1/company/{name}:
 *   get:
 *     summary: search companies by name
 *     tags: 
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: true
 *     responses: 
 *       200:
 *         description: List of companies
 *       404:
 *         description: Not found
 */
router.get('/:name',company.getCompaniesByName);


/**
 * @swagger
 * /api/v1/company:
 *   post:
 *     summary: Add a company
 *     tags:
 *       - Companies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code: 
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string     
 *     responses:
 *       201:
 *         description: Company added
 */
router.post('/',auth,validate(addCompanySchema),company.addCompany);

/**
 * @swagger
 * /api/v1/company/{id}:
 *   put:
 *     summary: Update a company by id
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *               code: 
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated          
 */



router.put('/:id',auth,validate(updateCompanyByIdSchema),company.updateCompanyById);

/**
 * @swagger
 * /api/v1/company/{id}:
 *   delete:
 *     summary: Delete a company by id
 *     tags: 
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: true
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404: 
 *         description: Not found
 *    
 *    
 */

router.delete('/:id',auth,company.deletecompanyById);

module.exports = router;