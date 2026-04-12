import { Router } from 'express';
import { fraudReports, getNextId } from './data.js';
import { users } from '../auth/data.js';
import { verifyToken, requireRole } from '../../middleware/auth.js';

const router = Router();

const VALID_TYPES = ['fraud', 'quality', 'payment', 'delivery'];
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'];
const VALID_STATUSES = ['pending', 'investigating', 'resolved', 'dismissed'];

// GET /api/reports — admin sees all, regular users see only their own
router.get('/', verifyToken, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ fraudReports });
  }
  const own = fraudReports.filter(r => r.reporterId === req.user.id);
  res.json({ fraudReports: own });
});

// POST /api/reports — any authenticated user
router.post('/', verifyToken, (req, res) => {
  const { reported_user_id, type, description, severity } = req.body;
  if (!reported_user_id || !type || !description) {
    return res.status(400).json({ error: 'reported_user_id, type, and description are required.' });
  }
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` });
  }
  if (severity && !VALID_SEVERITIES.includes(severity)) {
    return res.status(400).json({ error: `Invalid severity. Must be one of: ${VALID_SEVERITIES.join(', ')}` });
  }

  const reportedUser = users.find(u => u.id === Number(reported_user_id));
  const reporter = users.find(u => u.id === req.user.id);

  const report = {
    id: getNextId(),
    type,
    reported_user_id: Number(reported_user_id),
    reported_user_name: reportedUser?.name || 'Unknown User',
    reporterId: req.user.id,
    reporter_name: reporter?.name || 'Unknown User',
    description,
    severity: severity || 'medium',
    status: 'pending',
    admin_notes: '',
    date: new Date().toISOString().split('T')[0],
  };
  fraudReports.push(report);
  res.status(201).json(report);
});

// PUT /api/reports/:id/status — admin only
router.put('/:id/status', verifyToken, requireRole('admin'), (req, res) => {
  const report = fraudReports.find(r => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found.' });

  const { status, admin_notes } = req.body;
  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    report.status = status;
  }
  if (admin_notes !== undefined) {
    report.admin_notes = admin_notes;
  }

  res.json(report);
});

export default router;
