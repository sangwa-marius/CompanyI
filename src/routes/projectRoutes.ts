import * as express from 'express';
import * as project from '../controllers/projectController';
import auth from '../middleware/auth';
import validate from '../middleware/validator';
import { addProjectSchema, updateProjectSchema } from '../validations/projectValidations';

const router = express.Router();

router.get('/get-all-company-projects/:companyId', auth, project.getAllCompanyProjects);
router.get('/get-project/:id', auth, project.getProjectById);
router.post('/add-project', auth, validate(addProjectSchema), project.addProject);
router.post('/add-member-to-project/:projectId', auth, project.addMemberToProject);
router.put('/update-project/:id', auth, validate(updateProjectSchema), project.updateProjectById);
router.delete('/delete-project/:id', auth, project.deleteProjectById);

export default router;
