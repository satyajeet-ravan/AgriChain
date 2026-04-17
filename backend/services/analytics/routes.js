import { Router } from 'express';
import supabase from '../../config/supabase.js';
import { verifyToken } from '../../middleware/auth.js';

const router = Router();

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Build last 6 months labels and zero-filled revenue array
function buildMonthlyBuckets() {
  const now = new Date();
  const months = [];
  const keys = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(MONTH_NAMES[d.getMonth()]);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return { months, keys, revenue: new Array(6).fill(0) };
}

// Aggregate accepted orders into monthly revenue buckets
function fillMonthlyRevenue(orders, buckets) {
  for (const o of orders) {
    const d = new Date(o.order_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const idx = buckets.keys.indexOf(key);
    if (idx !== -1) buckets.revenue[idx] += Number(o.price) || 0;
  }
}

// Aggregate accepted orders into top crops list
function buildTopCrops(orders, limit = 5) {
  const map = {};
  for (const o of orders) {
    const name = o.product?.crop_variety?.variety || 'Unknown';
    if (!map[name]) map[name] = { name, sales: 0, revenue: 0 };
    map[name].sales += Number(o.quantity) || 0;
    map[name].revenue += Number(o.price) || 0;
  }
  return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

const ORDER_SELECT = '*, product:products!fk_products(*, crop_variety(*)), customer:profiles!fk_customers(full_name)';

// GET /api/analytics/farmer
router.get('/farmer', verifyToken, async (req, res) => {
  try {
    const farmerId = req.user.id;

    // All orders for this farmer
    const { data: allOrders, error: ordErr } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('farmer_id', farmerId)
      .order('order_date', { ascending: false });

    if (ordErr) return res.status(500).json({ error: ordErr.message });

    const acceptedOrders = allOrders.filter(o => o.status === 'accepted');

    // Active listings count
    const { count: listedCrops, error: cropErr } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('farmer_id', farmerId)
      .eq('status', 'available');

    if (cropErr) return res.status(500).json({ error: cropErr.message });

    const totalEarnings = acceptedOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);

    const stats = {
      totalEarnings,
      activeOrders: allOrders.filter(o => o.status === 'requested' || o.status === 'ongoing').length,
      listedCrops: listedCrops || 0,
      avgRating: 0,
      reviews: 0,
      conversionRate: allOrders.length > 0 ? Math.round((acceptedOrders.length / allOrders.length) * 100) : 0,
    };

    const buckets = buildMonthlyBuckets();
    fillMonthlyRevenue(acceptedOrders, buckets);

    const topCrops = buildTopCrops(acceptedOrders);

    res.json({
      stats,
      monthlyRevenue: buckets.revenue,
      months: buckets.months,
      topCrops,
      weeklyEngagement: [0, 0, 0, 0, 0, 0, 0],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch farmer analytics.' });
  }
});

// GET /api/analytics/earnings
router.get('/earnings', verifyToken, async (req, res) => {
  try {
    const farmerId = req.user.id;

    const { data: acceptedOrders, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('farmer_id', farmerId)
      .eq('status', 'accepted')
      .order('order_date', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const totalEarnings = acceptedOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const platformFeeRate = 0.02;
    const totalFees = Math.round(totalEarnings * platformFeeRate);

    // Build transactions: each accepted order is a credit, with a matching fee debit
    const transactions = [];
    for (const o of acceptedOrders) {
      const cropName = o.product?.crop_variety?.variety || 'Unknown';
      const buyerName = o.customer?.full_name || 'Buyer';
      const amount = Number(o.price) || 0;
      const date = o.order_date ? new Date(o.order_date).toISOString().split('T')[0] : '';

      transactions.push({
        id: `TXN-${o.id.slice(-6)}`,
        userId: farmerId,
        description: `Payment for ${cropName} (${o.quantity}kg) from ${buyerName}`,
        amount,
        date,
        type: 'credit',
      });

      const fee = Math.round(amount * platformFeeRate);
      if (fee > 0) {
        transactions.push({
          id: `FEE-${o.id.slice(-6)}`,
          userId: farmerId,
          description: `Platform fee (${platformFeeRate * 100}%)`,
          amount: -fee,
          date,
          type: 'debit',
        });
      }
    }

    const buckets = buildMonthlyBuckets();
    fillMonthlyRevenue(acceptedOrders, buckets);

    res.json({
      transactions,
      totalEarnings,
      totalFees,
      netEarnings: totalEarnings - totalFees,
      monthlyRevenue: buckets.revenue,
      months: buckets.months,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch earnings.' });
  }
});

// GET /api/analytics/admin
router.get('/admin', verifyToken, async (req, res) => {
  try {
    const { data: acceptedOrders, error } = await supabase
      .from('orders')
      .select('*, product:products!fk_products(*, crop_variety(*))')
      .eq('status', 'accepted')
      .order('order_date', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const buckets = buildMonthlyBuckets();
    fillMonthlyRevenue(acceptedOrders, buckets);

    const topCrops = buildTopCrops(acceptedOrders);

    res.json({
      monthlyRevenue: buckets.revenue,
      months: buckets.months,
      topCrops,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin analytics.' });
  }
});

export default router;
