import express from 'express';
import { logActivity, getRecentActivities, getAllActivities } from '../controllers/activityController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/log', auth, logActivity);
router.get('/recent', auth, getRecentActivities);
router.get('/all', auth, getAllActivities);

export default router;
