import { Router } from 'express';
import { platformStats, teamMembers, adminStats } from './data.js';
import { verifyToken } from '../../middleware/auth.js';

const router = Router();

// GET /api/stats/platform — public
router.get('/platform', (req, res) => {
  res.json(platformStats);
});

// GET /api/stats/team — public
router.get('/team', (req, res) => {
  res.json(teamMembers);
});

// GET /api/stats/admin — admin dashboard stats
router.get('/admin', verifyToken, (req, res) => {
  res.json(adminStats);
});

export default router;
