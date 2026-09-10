import express from 'express';
const router = express.Router();
import { getLandingStats, getDashboardPreview } from '../controllers/publicController';

router.get('/stats', getLandingStats);
router.get('/dashboard-preview', getDashboardPreview);

export default router;
