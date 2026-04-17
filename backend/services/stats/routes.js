import { Router } from 'express';
import supabase from '../../config/supabase.js';
import { verifyToken } from '../../middleware/auth.js';

const router = Router();

// Static team data — kept hardcoded
const teamMembers = [
  { name: 'Priya Menon', role: 'CEO & Co-Founder', bio: 'Former agri-economist with 10 years of rural development experience.', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
  { name: 'Arjun Iyer', role: 'CTO & Co-Founder', bio: 'Full-stack engineer passionate about using tech to solve rural challenges.', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
  { name: 'Sneha Rao', role: 'Head of Operations', bio: 'Logistics expert who built supply chains across 12 Indian states.', avatar: 'https://randomuser.me/api/portraits/women/56.jpg' },
  { name: 'Dev Kapoor', role: 'Head of Partnerships', bio: 'Connects farmers with enterprise buyers and government programs.', avatar: 'https://randomuser.me/api/portraits/men/78.jpg' },
];

// GET /api/stats/platform — public
router.get('/platform', async (req, res) => {
  try {
    const [farmers, buyers, crops, orders] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'Farmer'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'Buyer'),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
    ]);

    const farmerCount = (farmers.count || 0) + (await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'Both')).count || 0;
    const buyerCount = (buyers.count || 0);

    res.json([
      { label: 'Active Farmers', value: `${farmerCount.toLocaleString()}+`, icon: '\uD83D\uDC68\u200D\uD83C\uDF3E' },
      { label: 'Verified Buyers', value: `${buyerCount.toLocaleString()}+`, icon: '\uD83C\uDFEA' },
      { label: 'Crops Listed', value: `${(crops.count || 0).toLocaleString()}+`, icon: '\uD83C\uDF3E' },
      { label: 'Total Orders', value: `${(orders.count || 0).toLocaleString()}`, icon: '\uD83D\uDCE6' },
    ]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch platform stats.' });
  }
});

// GET /api/stats/team — public
router.get('/team', (req, res) => {
  res.json(teamMembers);
});

// GET /api/stats/admin — admin dashboard stats
router.get('/admin', verifyToken, async (req, res) => {
  try {
    const [users, crops, orders, revenue, pendingUsers, reports] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('price').eq('status', 'accepted'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verified', false).eq('blocked', false),
      supabase.from('fraud_reports').select('*', { count: 'exact', head: true }).in('status', ['pending', 'investigating']),
    ]);

    const totalRevenue = (revenue.data || []).reduce((sum, o) => sum + (Number(o.price) || 0), 0);

    // Format revenue for display
    let revenueDisplay;
    if (totalRevenue >= 10000000) {
      revenueDisplay = `\u20B9${(totalRevenue / 10000000).toFixed(1)} Cr`;
    } else if (totalRevenue >= 100000) {
      revenueDisplay = `\u20B9${(totalRevenue / 100000).toFixed(1)} L`;
    } else {
      revenueDisplay = `\u20B9${totalRevenue.toLocaleString()}`;
    }

    res.json({
      totalUsers: users.count || 0,
      totalCrops: crops.count || 0,
      totalOrders: orders.count || 0,
      totalRevenue: revenueDisplay,
      pendingApprovals: pendingUsers.count || 0,
      flaggedReports: reports.count || 0,
      activeDisputes: 0,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
});

export default router;
