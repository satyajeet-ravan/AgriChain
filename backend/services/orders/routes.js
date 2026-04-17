import { Router } from 'express';
import supabase from '../../config/supabase.js';
import { verifyToken, requireRole } from '../../middleware/auth.js';

const router = Router();

const VALID_STATUSES = ['requested', 'ongoing', 'accepted', 'rejected'];

// Map DB status → frontend display status
const STATUS_DISPLAY = {
  requested: 'Pending',
  ongoing: 'Processing',
  accepted: 'Delivered',
  rejected: 'Rejected',
};

// Map frontend status → DB status (for filters and updates)
const STATUS_TO_DB = {
  Pending: 'requested',
  Processing: 'ongoing',
  Shipped: 'ongoing',
  Delivered: 'accepted',
  Rejected: 'rejected',
};

// Shared select with joins for buyer name, farmer name, and product info
const ORDER_SELECT = `
  *,
  farmer:profiles!fk_farmer(full_name),
  customer:profiles!fk_customers(full_name),
  product:products!fk_products(*, crop_variety(*))
`;

// Format a DB order row into the shape the frontend expects
function formatOrder(row) {
  const cv = row.product?.crop_variety || {};
  return {
    id: row.id,
    farmerId: row.farmer_id,
    buyerId: row.customer_id,
    farmer: row.farmer?.full_name || 'Unknown',
    buyer: row.customer?.full_name || 'Unknown',
    crop: cv.variety || 'Unknown',
    quantity: Number(row.quantity),
    amount: Number(row.price),
    status: STATUS_DISPLAY[row.status] || row.status,
    date: row.order_date ? new Date(row.order_date).toISOString().split('T')[0] : '',
    tracking: `TRCK${row.id.slice(-5)}`,
  };
}

// GET /api/orders/farmer — farmer's received orders
router.get('/farmer', verifyToken, requireRole('farmer', 'both'), async (req, res) => {
  try {
    let query = supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('farmer_id', req.user.id)
      .order('order_date', { ascending: false });

    const { status } = req.query;
    if (status && status !== 'All') {
      const dbStatus = STATUS_TO_DB[status];
      if (dbStatus) query = query.eq('status', dbStatus);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    res.json(data.map(formatOrder));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch farmer orders.' });
  }
});

// GET /api/orders/buyer — buyer's purchase orders
router.get('/buyer', verifyToken, requireRole('buyer', 'both'), async (req, res) => {
  try {
    let query = supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('customer_id', req.user.id)
      .order('order_date', { ascending: false });

    const { status } = req.query;
    if (status && status !== 'All') {
      const dbStatus = STATUS_TO_DB[status];
      if (dbStatus) query = query.eq('status', dbStatus);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    res.json(data.map(formatOrder));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch buyer orders.' });
  }
});

// GET /api/orders/all — admin view all orders
router.get('/all', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    let query = supabase
      .from('orders')
      .select(ORDER_SELECT)
      .order('order_date', { ascending: false });

    const { status } = req.query;
    if (status && status !== 'All') {
      const dbStatus = STATUS_TO_DB[status];
      if (dbStatus) query = query.eq('status', dbStatus);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    res.json(data.map(row => ({ ...formatOrder(row), type: 'Farmer→Buyer' })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// POST /api/orders — buyer places order
router.post('/', verifyToken, requireRole('buyer', 'both'), async (req, res) => {
  const { items } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Items are required.' });
  }

  try {
    const createdOrders = [];

    for (const item of items) {
      const { farmerId, cropId, quantity } = item;
      if (!farmerId || !cropId || !quantity) {
        return res.status(400).json({ error: 'Each item needs farmerId, cropId, and quantity.' });
      }

      // Fetch the product to verify stock and get price
      const { data: product, error: productErr } = await supabase
        .from('products')
        .select('*, crop_variety(*)')
        .eq('id', cropId)
        .single();

      if (productErr || !product) {
        return res.status(404).json({ error: `Product ${cropId} not found.` });
      }

      if (product.quantity < quantity) {
        const name = product.crop_variety?.variety || cropId;
        return res.status(400).json({
          error: `Insufficient stock for ${name}. Available: ${product.quantity}, Requested: ${quantity}`,
        });
      }

      const price = Number(product.price_per_unit) * quantity;

      const { data: order, error: insertErr } = await supabase
        .from('orders')
        .insert({
          customer_id: req.user.id,
          farmer_id: farmerId,
          product_id: cropId,
          quantity,
          price,
          status: 'requested',
        })
        .select(ORDER_SELECT)
        .single();

      if (insertErr) {
        return res.status(500).json({ error: insertErr.message });
      }

      createdOrders.push(formatOrder(order));
    }

    res.status(201).json(createdOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order.' });
  }
});

// PUT /api/orders/:id/status — update order status
router.put('/:id/status', verifyToken, async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required.' });

  // Map frontend status name to DB enum if needed
  const dbStatus = STATUS_TO_DB[status] || status.toLowerCase();
  if (!VALID_STATUSES.includes(dbStatus)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    // Fetch the order to check ownership
    const { data: existing, error: fetchErr } = await supabase
      .from('orders')
      .select('*, product:products!fk_products(quantity)')
      .eq('id', req.params.id)
      .single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Only farmer who owns the order or admin can update
    if (req.user.role !== 'admin' && existing.farmer_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the order farmer or admin can update status.' });
    }

    // When accepting, deduct quantity from product stock
    if (dbStatus === 'accepted' && existing.status !== 'accepted') {
      const currentStock = existing.product?.quantity ?? 0;
      const newStock = currentStock - existing.quantity;

      if (newStock < 0) {
        return res.status(400).json({ error: 'Insufficient product stock to accept this order.' });
      }

      const { error: stockErr } = await supabase
        .from('products')
        .update({ quantity: newStock })
        .eq('id', existing.product_id);

      if (stockErr) {
        return res.status(500).json({ error: 'Failed to update product stock.' });
      }
    }

    const { data: updated, error: updateErr } = await supabase
      .from('orders')
      .update({ status: dbStatus })
      .eq('id', req.params.id)
      .select(ORDER_SELECT)
      .single();

    if (updateErr) {
      return res.status(500).json({ error: updateErr.message });
    }

    res.json(formatOrder(updated));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

export default router;
