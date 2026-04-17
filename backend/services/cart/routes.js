import { Router } from 'express';
import supabase from '../../config/supabase.js';
import { verifyToken, requireRole } from '../../middleware/auth.js';

// In-memory cart storage keyed by userId
const carts = {};
let nextId = 1;
function getNextId() { return nextId++; }

const router = Router();

// Fetch a single product from Supabase and format for cart enrichment
async function fetchCrop(cropId) {
  const { data } = await supabase
    .from('products')
    .select('*, crop_variety(*), profiles(full_name, address)')
    .eq('id', cropId)
    .single();

  if (!data) return null;
  const cv = data.crop_variety || {};
  const prof = data.profiles || {};
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  return {
    id: data.id,
    name: cv.variety || '',
    category: cap(cv.category) || '',
    price: Number(data.price_per_unit) || 0,
    unit: data.unit || 'kg',
    quantity: Number(data.quantity) || 0,
    farmerId: data.farmer_id,
    farmer: prof.full_name || '',
    location: prof.address || '',
    image: data.image_url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    available: data.status === 'available',
  };
}

// GET /api/cart
router.get('/', verifyToken, requireRole('buyer', 'both'), async (req, res) => {
  const userCart = carts[req.user.id] || [];
  const enriched = await Promise.all(
    userCart.map(async item => {
      const crop = await fetchCrop(item.cropId);
      return { ...item, crop };
    })
  );
  res.json(enriched);
});

// POST /api/cart
router.post('/', verifyToken, requireRole('buyer', 'both'), async (req, res) => {
  const { cropId, quantity } = req.body;
  if (!cropId) return res.status(400).json({ error: 'cropId is required.' });

  if (!carts[req.user.id]) carts[req.user.id] = [];
  const existing = carts[req.user.id].find(i => i.cropId === cropId);
  if (existing) {
    existing.quantity += (quantity || 1);
    const crop = await fetchCrop(existing.cropId);
    return res.json({ ...existing, crop });
  }

  const item = { id: getNextId(), cropId, quantity: quantity || 1 };
  carts[req.user.id].push(item);
  const crop = await fetchCrop(item.cropId);
  res.status(201).json({ ...item, crop });
});

// PUT /api/cart/:id
router.put('/:id', verifyToken, requireRole('buyer', 'both'), async (req, res) => {
  const userCart = carts[req.user.id] || [];
  const item = userCart.find(i => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Cart item not found.' });

  if (req.body.quantity !== undefined) item.quantity = Math.max(1, Number(req.body.quantity));
  const crop = await fetchCrop(item.cropId);
  res.json({ ...item, crop });
});

// DELETE /api/cart/:id
router.delete('/:id', verifyToken, requireRole('buyer', 'both'), (req, res) => {
  if (!carts[req.user.id]) return res.status(404).json({ error: 'Cart item not found.' });
  const idx = carts[req.user.id].findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Cart item not found.' });

  carts[req.user.id].splice(idx, 1);
  res.json({ message: 'Item removed from cart.' });
});

// DELETE /api/cart — clear entire cart
router.delete('/', verifyToken, requireRole('buyer', 'both'), (req, res) => {
  carts[req.user.id] = [];
  res.json({ message: 'Cart cleared.' });
});

export default router;
