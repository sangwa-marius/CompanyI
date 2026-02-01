const express = require('express');
const project= require('../controllers/projectController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const {addProjectSchema, updateProjectSchema} = require('../validations/projectValidations')

const router = express.Router();

router.get('/',auth,project.getAllProjects)
router.get('/:name',auth, project.getProjectsByName);
router.post('/',auth,validate (addProjectSchema),project.addProject);
router.put('/:id',auth, validate(updateProjectSchema),project.updateProjectById);
router.delete('/:id',auth, project.deleteProjectById);

module.exports = router;
