const express = require('express');
const project= require('../controllers/projectController');

const router = express.Router();

router.post('/project',project.addProject);
router.get('/project',project.getAllProjects)

module.exports = router;
