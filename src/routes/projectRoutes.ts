import * as express from 'express';
import * as project from '../controllers/projectController';
import auth from '../middleware/auth';
import validate from '../middleware/validator';
import { addProjectSchema, updateProjectSchema } from '../validations/projectValidations';

const router = express.Router();

router.get('/',auth,project.getAllProjects);
router.get('/:name',auth, project.getProjectsByName);
router.post('/',auth,validate (addProjectSchema),project.addProject);
router.put('/:id',auth, validate(updateProjectSchema),project.updateProjectById);
router.delete('/:id',auth, project.deleteProjectById);

export default router;
