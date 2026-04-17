import { Router } from 'express';
import supabase from '../../config/supabase.js';
import { verifyToken, requireRole } from '../../middleware/auth.js';

const router = Router();

const VALID_TYPES = ['fraud', 'quality', 'payment', 'delivery'];
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'];
const VALID_STATUSES = ['pending', 'investigating', 'resolved', 'dismissed'];

// Shared select with joins for reporter and reported user names
const REPORT_SELECT = `
  *,
  reporter:profiles!fk_reporter(full_name),
  reported:profiles!fk_reported_user(full_name)
`;

// Map a DB row to the shape the frontend expects
function formatReport(row) {
  return {
    id: row.id,
    type: row.type,
    reported_user_id: row.reported_user_id,
    reported_user_name: row.reported?.full_name || 'Unknown User',
    reporterId: row.reporter_id,
    reporter_name: row.reporter?.full_name || 'Unknown User',
    description: row.description,
    severity: row.severity,
    status: row.status,
    admin_notes: row.admin_notes || '',
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
  };
}

// GET /api/reports — admin sees all, regular users see only their own
router.get('/', verifyToken, async (req, res) => {
  try {
    let query = supabase
      .from('fraud_reports')
      .select(REPORT_SELECT)
      .order('created_at', { ascending: false });

    if (req.user.role !== 'admin') {
      query = query.eq('reporter_id', req.user.id);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    res.json({ fraudReports: data.map(formatReport) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
});

// POST /api/reports — any authenticated user
router.post('/', verifyToken, async (req, res) => {
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

  try {
    const { data, error } = await supabase
      .from('fraud_reports')
      .insert({
        reporter_id: req.user.id,
        reported_user_id,
        type,
        description,
        severity: severity || 'medium',
        status: 'pending',
        admin_notes: '',
      })
      .select(REPORT_SELECT)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(formatReport(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create report.' });
  }
});

// PUT /api/reports/:id/status — admin only
router.put('/:id/status', verifyToken, requireRole('admin'), async (req, res) => {
  const { status, admin_notes } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    // Build the update payload — only include fields that were provided
    const updates = {};
    if (status) updates.status = status;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    const { data, error } = await supabase
      .from('fraud_reports')
      .update(updates)
      .eq('id', req.params.id)
      .select(REPORT_SELECT)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Report not found.' });
      return res.status(500).json({ error: error.message });
    }

    res.json(formatReport(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update report.' });
  }
});

export default router;
