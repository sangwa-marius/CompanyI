const express = require('express');
const project= require('../controllers/projectController');

const router = express.Router();

router.get('/project',project.getAllProjects)
router.get('/project/:name', project.getProjectsByName);
router.post('/project',project.addProject);
router.put('/project/:name', project.updateProjectByname);
router.delete('/project/:name', project.deleteProjectByName);

module.exports = router;
