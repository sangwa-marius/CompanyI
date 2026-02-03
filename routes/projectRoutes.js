const express = require('express');
const project= require('../controllers/projectController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const {addProjectSchema, updateProjectSchema} = require('../validations/projectValidations')

const router = express.Router();

/**
 * @swagger
 * /api/v1/project:
 *   get:
 *     summary: Get all projects
 *     tags:
 *       - Projects
 *     responses:
 *       200:
 *         description: List of projects
 *       404: 
 *         description: Not found
 */

router.get('/',auth,project.getAllProjects)
/**
 * @swagger
 * /api/v1/project/{name}:
 *   get:
 *     summary: Get projects by name
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200: 
 *         description: List of projects
 *       404:
 *         description: Not found     
 */
router.get('/:name',auth, project.getProjectsByName);
/**
 * @swagger
 * /api/v1/project:
 *   post:
 *     summary: Add a project
 *     tags:
 *       - Projects
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
 *               members:
 *                 type: string
 *               status: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Success       
 */
router.post('/',auth,validate (addProjectSchema),project.addProject);
/**
 * @swagger
 * /api/v1/project/{id}:
 *   put:
 *     summary: Update project
 *     tags:
 *       - Projects
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
 *               members:
 *                 type: string
 *               status: 
 *                 type: string
 * 
 *     responses:
 *         200:
 *           description: Project updated
 */
router.put('/:id',auth, validate(updateProjectSchema),project.updateProjectById);
/**
 * @swagger
 * /api/v1/Project/{id}:
 *   delete:
 *     summary: Delete a department by id
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: project deleted
 */
router.delete('/:id',auth, project.deleteProjectById);

module.exports = router;
