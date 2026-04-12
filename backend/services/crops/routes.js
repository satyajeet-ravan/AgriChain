import { Router } from 'express';
import { crops, categories, farmers, cropVarieties, varietyMap, getNextId } from './data.js';
import { users } from '../auth/data.js';
import { verifyToken, requireRole } from '../../middleware/auth.js';

const router = Router();

// GET /api/crops — public, with filters
router.get('/', (req, res) => {
  const { search, category, organic, available, minPrice, maxPrice, sortBy, farmerId } = req.query;
  let list = [...crops];

  if (farmerId) list = list.filter(c => c.farmerId === Number(farmerId));
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.farmer.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
  }
  if (category && category !== 'all') list = list.filter(c => c.category === category);
  if (organic === 'true') list = list.filter(c => c.organic);
  if (available === 'true') list = list.filter(c => c.available);
  if (minPrice) list = list.filter(c => c.price >= Number(minPrice));
  if (maxPrice) list = list.filter(c => c.price <= Number(maxPrice));

  if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'newest') list.sort((a, b) => b.id - a.id);

  // Enrich with variety info if variety_id exists
  const enriched = list.map(c => {
    if (c.variety_id && varietyMap[c.variety_id]) {
      const v = varietyMap[c.variety_id];
      return { ...c, category: v.category, subCategory: v.subCategory, variety: v.variety };
    }
    return c;
  });

  res.json(enriched);
});

// GET /api/crops/categories
router.get('/categories', (req, res) => {
  res.json(categories);
});

// GET /api/crops/farmers
router.get('/farmers', (req, res) => {
  res.json(farmers);
});

// GET /api/crops/varieties — grouped by category > subCategory
router.get('/varieties', (req, res) => {
  const grouped = {};
  for (const v of cropVarieties) {
    if (!grouped[v.category]) grouped[v.category] = {};
    if (!grouped[v.category][v.subCategory]) grouped[v.category][v.subCategory] = [];
    grouped[v.category][v.subCategory].push({ id: v.id, variety: v.variety });
  }
  res.json(grouped);
});

// GET /api/crops/:id
router.get('/:id', (req, res) => {
  const crop = crops.find(c => c.id === Number(req.params.id));
  if (!crop) return res.status(404).json({ error: 'Crop not found.' });
  if (crop.variety_id && varietyMap[crop.variety_id]) {
    const v = varietyMap[crop.variety_id];
    return res.json({ ...crop, category: v.category, subCategory: v.subCategory, variety: v.variety });
  }
  res.json(crop);
});

// POST /api/crops — farmer adds crop
router.post('/', verifyToken, requireRole('farmer'), (req, res) => {
  const { variety_id, quantity, unit, price, minOrder, description, harvestDate, organic, available } = req.body;
  if (!variety_id || !quantity || !price) {
    return res.status(400).json({ error: 'Variety, quantity, and price are required.' });
  }

  const varietyInfo = varietyMap[variety_id];
  if (!varietyInfo) {
    return res.status(400).json({ error: 'Invalid variety ID.' });
  }

  // Auto-populate location and farmer name from user profile
  const user = users.find(u => u.id === req.user.id);
  const farmerName = user?.name || 'Unknown Farmer';
  const farmerLocation = user?.location || '';

  const newCrop = {
    id: getNextId(),
    name: varietyInfo.variety,
    category: varietyInfo.category,
    subCategory: varietyInfo.subCategory,
    variety: varietyInfo.variety,
    variety_id,
    price: Number(price),
    unit: unit || 'kg',
    quantity: Number(quantity),
    farmerId: req.user.id,
    farmer: farmerName,
    location: farmerLocation,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    rating: 0,
    reviews: 0,
    available: available !== false,
    organic: organic || false,
    description: description || '',
    approvalStatus: 'Pending',
    minOrder: minOrder ? Number(minOrder) : 1,
    harvestDate: harvestDate || '',
  };
  crops.push(newCrop);
  res.status(201).json(newCrop);
});

// PUT /api/crops/:id
router.put('/:id', verifyToken, (req, res) => {
  const crop = crops.find(c => c.id === Number(req.params.id));
  if (!crop) return res.status(404).json({ error: 'Crop not found.' });

  if (req.user.role === 'farmer' && crop.farmerId !== req.user.id) {
    return res.status(403).json({ error: 'Not your crop listing.' });
  }

  const allowed = ['name', 'category', 'price', 'unit', 'quantity', 'description', 'organic', 'available', 'location'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) crop[key] = req.body[key];
  }

  if (req.user.role === 'admin' && req.body.approvalStatus) {
    crop.approvalStatus = req.body.approvalStatus;
  }

  res.json(crop);
});

// DELETE /api/crops/:id
router.delete('/:id', verifyToken, (req, res) => {
  const idx = crops.findIndex(c => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Crop not found.' });

  if (req.user.role === 'farmer' && crops[idx].farmerId !== req.user.id) {
    return res.status(403).json({ error: 'Not your crop listing.' });
  }

  crops.splice(idx, 1);
  res.json({ message: 'Crop deleted.' });
});

export default router;
