const express = require('express');
const project= require('../controllers/projectController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const {addProjectSchema, updateProjectSchema} = require('../validations/projectValidations')

const router = express.Router();

router.get('/project',auth,project.getAllProjects)
router.get('/project/:name',auth, project.getProjectsByName);
router.post('/project',auth,validate (addProjectSchema),project.addProject);
router.put('/project/:id',auth, validate(updateProjectSchema),project.updateProjectById);
router.delete('/project/:id',auth, project.deleteProjectById);

module.exports = router;
