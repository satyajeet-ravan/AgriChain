import { Router } from 'express';
import supabase from '../../config/supabase.js';
import { verifyToken, requireRole } from '../../middleware/auth.js';

const router = Router();

// Capitalize first letter: "grains" → "Grains"
function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

// Map a DB product row (with joined crop_variety + profiles) to the frontend shape
function formatCrop(row) {
  const cv = row.crop_variety || {};
  const prof = row.profiles || {};
  return {
    id: row.id,
    name: cv.variety || '',
    category: cap(cv.category) || '',
    subCategory: cv.sub_category || '',
    variety: cv.variety || '',
    variety_id: row.category, // the FK uuid
    price: Number(row.price_per_unit) || 0,
    unit: row.unit || 'kg',
    quantity: Number(row.quantity) || 0,
    farmerId: row.farmer_id,
    farmer: prof.full_name || '',
    location: prof.address || '',
    image: row.image_url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    rating: 0,
    reviews: 0,
    available: row.status === 'available',
    organic: false,
    description: row.description || '',
    approvalStatus: row.status === 'available' ? 'Approved' : 'Pending',
    minOrder: 1,
    harvestDate: row.harvest_date || '',
    createdAt: row.created_at,
  };
}

// Shared select query string for product joins
const PRODUCT_SELECT = '*, crop_variety(*), profiles(full_name, address)';

// GET /api/crops/featured — public, crops marked for landing page
router.get('/featured', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`${PRODUCT_SELECT}, featured`)
      .eq('featured', true)
      .eq('status', 'available')
      .order('updated_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Filter out blocked farmers
    const { data: blockedIds } = await supabase
      .from('profiles')
      .select('id')
      .eq('blocked', true);
    const blocked = new Set((blockedIds || []).map(r => r.id));

    res.json(data.filter(r => !blocked.has(r.farmer_id)).map(r => ({ ...formatCrop(r), featured: true })));
  } catch {
    res.status(500).json({ error: 'Failed to fetch featured crops.' });
  }
});

// GET /api/crops — public, with filters
router.get('/', async (req, res) => {
  const { search, category, organic, available, minPrice, maxPrice, sortBy, farmerId } = req.query;

  try {
    let query = supabase.from('products').select(PRODUCT_SELECT);

    if (farmerId) query = query.eq('farmer_id', farmerId);
    if (minPrice) query = query.gte('price_per_unit', Number(minPrice));
    if (maxPrice) query = query.lte('price_per_unit', Number(maxPrice));
    if (available === 'true') query = query.eq('status', 'available');

    // Sorting
    if (sortBy === 'price-asc') query = query.order('price_per_unit', { ascending: true });
    else if (sortBy === 'price-desc') query = query.order('price_per_unit', { ascending: false });
    else if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    let list = data.map(formatCrop);

    // Filter out blocked farmers
    const { data: blockedIds } = await supabase
      .from('profiles')
      .select('id')
      .eq('blocked', true);
    const blocked = new Set((blockedIds || []).map(r => r.id));
    list = list.filter(c => !blocked.has(c.farmerId));

    // Category filter (compare against the capitalized category name from crop_variety)
    if (category && category !== 'all') {
      list = list.filter(c => c.category === category);
    }

    // Text search across name, farmer, location, description
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.farmer.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    // Rating sort (not a DB column, sort in-app)
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);

    res.json(list);
  } catch {
    res.status(500).json({ error: 'Failed to fetch crops.' });
  }
});

// GET /api/crops/categories
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('crop_variety')
      .select('category');

    if (error) return res.status(500).json({ error: error.message });

    const unique = [...new Set(data.map(r => r.category))];
    const icons = { grains: '🌾', fruits: '🍎', vegetables: '🥦', spices: '🌶️', processed: '🫙', nuts: '🥜' };
    const categories = [
      { id: 'all', label: 'All', icon: '🌾' },
      ...unique.map(c => ({ id: cap(c), label: cap(c), icon: icons[c] || '🌿' })),
    ];
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// GET /api/crops/farmers
router.get('/farmers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, address')
      .in('role', ['Farmer', 'Both']);

    if (error) return res.status(500).json({ error: error.message });

    const farmers = data.map(p => ({
      id: p.id,
      name: p.full_name || '',
      location: p.address || '',
      crops: 0,
      rating: 0,
      image: '',
      verified: true,
      yearsActive: 0,
    }));
    res.json(farmers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch farmers.' });
  }
});

// GET /api/crops/varieties — grouped by category > subCategory
router.get('/varieties', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('crop_variety')
      .select('id, category, sub_category, variety')
      .order('category')
      .order('sub_category')
      .order('variety');

    if (error) return res.status(500).json({ error: error.message });

    const grouped = {};
    for (const v of data) {
      const cat = cap(v.category);
      if (!grouped[cat]) grouped[cat] = {};
      if (!grouped[cat][v.sub_category]) grouped[cat][v.sub_category] = [];
      grouped[cat][v.sub_category].push({ id: v.id, variety: v.variety });
    }
    res.json(grouped);
  } catch {
    res.status(500).json({ error: 'Failed to fetch varieties.' });
  }
});

// GET /api/crops/all — admin view all crops with featured flag
router.get('/all', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`${PRODUCT_SELECT}, featured`)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json(data.map(r => ({ ...formatCrop(r), featured: r.featured ?? false })));
  } catch {
    res.status(500).json({ error: 'Failed to fetch crops.' });
  }
});

// GET /api/crops/:id
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Crop not found.' });

    res.json(formatCrop(data));
  } catch {
    res.status(404).json({ error: 'Crop not found.' });
  }
});

// POST /api/crops — farmer adds crop
router.post('/', verifyToken, requireRole('farmer', 'both'), async (req, res) => {
  const { variety_id, quantity, unit, price, description, harvestDate, available } = req.body;

  if (!variety_id || !quantity || !price) {
    return res.status(400).json({ error: 'Variety, quantity, and price are required.' });
  }

  try {
    // Verify variety exists
    const { data: variety, error: vErr } = await supabase
      .from('crop_variety')
      .select('*')
      .eq('id', variety_id)
      .single();

    if (vErr || !variety) {
      return res.status(400).json({ error: 'Invalid variety ID.' });
    }

    const { data, error } = await req.supabase
      .from('products')
      .insert({
        farmer_id: req.user.id,
        category: variety_id,
        quantity: Number(quantity),
        unit: unit || 'kg',
        price_per_unit: Number(price),
        description: description || '',
        harvest_date: harvestDate || null,
        status: available === false ? 'unavailable' : 'available',
      })
      .select(PRODUCT_SELECT)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(formatCrop(data));
  } catch {
    res.status(500).json({ error: 'Failed to add crop.' });
  }
});

// PUT /api/crops/:id/featured — admin toggle featured
router.put('/:id/featured', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { featured } = req.body;
    const { data, error } = await req.supabase
      .from('products')
      .update({ featured: !!featured, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select(`${PRODUCT_SELECT}, featured`)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json({ ...formatCrop(data), featured: data.featured });
  } catch {
    res.status(500).json({ error: 'Failed to update featured status.' });
  }
});

// PUT /api/crops/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Fetch existing product to check ownership
    const { data: existing, error: fetchErr } = await supabase
      .from('products')
      .select('farmer_id')
      .eq('id', req.params.id)
      .single();

    if (fetchErr || !existing) return res.status(404).json({ error: 'Crop not found.' });

    if (req.user.role === 'farmer' && existing.farmer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not your crop listing.' });
    }

    const updates = {};
    if (req.body.price !== undefined) updates.price_per_unit = Number(req.body.price);
    if (req.body.quantity !== undefined) updates.quantity = Number(req.body.quantity);
    if (req.body.unit !== undefined) updates.unit = req.body.unit;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.harvestDate !== undefined) updates.harvest_date = req.body.harvestDate || null;
    if (req.body.available !== undefined) updates.status = req.body.available ? 'available' : 'unavailable';
    if (req.body.approvalStatus !== undefined && req.user.role === 'admin') {
      updates.status = req.body.approvalStatus === 'Approved' ? 'available' : 'unavailable';
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await req.supabase
      .from('products')
      .update(updates)
      .eq('id', req.params.id)
      .select(PRODUCT_SELECT)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(formatCrop(data));
  } catch {
    res.status(500).json({ error: 'Failed to update crop.' });
  }
});

// DELETE /api/crops/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Fetch existing product to check ownership
    const { data: existing, error: fetchErr } = await supabase
      .from('products')
      .select('farmer_id')
      .eq('id', req.params.id)
      .single();

    if (fetchErr || !existing) return res.status(404).json({ error: 'Crop not found.' });

    if (req.user.role === 'farmer' && existing.farmer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not your crop listing.' });
    }

    const { error } = await req.supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Crop deleted.' });
  } catch {
    res.status(500).json({ error: 'Failed to delete crop.' });
  }
});

export default router;
