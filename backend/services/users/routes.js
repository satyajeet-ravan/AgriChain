import { Router } from 'express';
import supabase from '../../config/supabase.js';
import { verifyToken, requireRole } from '../../middleware/auth.js';

const router = Router();

// Map a profiles row to the shape the frontend expects
function formatUser(row) {
  return {
    id: row.id,
    name: row.full_name || '',
    email: row.email || '',
    role: row.role?.toLowerCase() || '',
    phone: row.phone_no || '',
    location: row.address || '',
    dob: row.dob || '',
    joined: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    bio: '',
    avatar: '',
    verified: row.verified ?? false,
    blocked: row.blocked ?? false,
  };
}

// GET /api/users — admin only
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    const { role, search } = req.query;

    if (role && role !== 'All') {
      // profiles.role is an enum with capitalised values (Farmer, Buyer, Both, Admin)
      const dbRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      query = query.eq('role', dbRole);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    res.json(data.map(formatUser));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// GET /api/users/:id — admin only
router.get('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'User not found.' });
      return res.status(500).json({ error: error.message });
    }

    res.json(formatUser(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

// PUT /api/users/:id/status — admin only
router.put('/:id/status', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const updates = {};

    if (req.body.verified !== undefined) {
      updates.verified = req.body.verified;
    }

    if (req.body.status) {
      updates.verified = req.body.status === 'Verified';
      updates.blocked = req.body.status === 'Blocked';
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    // If blocking, fetch the user's role first to handle cascading effects
    if (updates.blocked) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.params.id)
        .single();

      const role = profile?.role?.toLowerCase() || '';
      if (role === 'farmer' || role === 'both') {
        // Set all their products to unavailable
        await supabase
          .from('products')
          .update({ status: 'unavailable', updated_at: new Date().toISOString() })
          .eq('farmer_id', req.params.id);

        // Cancel all their pending/ongoing orders
        await supabase
          .from('orders')
          .update({ status: 'rejected' })
          .eq('farmer_id', req.params.id)
          .in('status', ['requested', 'ongoing']);
      }
    }

    const { data, error } = await req.supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'User not found.' });
      return res.status(500).json({ error: error.message });
    }

    res.json(formatUser(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user status.' });
  }
});

export default router;
