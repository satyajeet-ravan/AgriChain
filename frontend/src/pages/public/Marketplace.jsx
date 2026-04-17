import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import CropCard from '../../components/CropCard/CropCard';
import { cropsAPI } from '../../api/crops';
import { cartAPI } from '../../api/cart';
import { useAuth } from '../../utils/AuthContext';
import './Marketplace.css';

export default function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartMsg, setCartMsg] = useState('');

  function handleAddToCart(crop) {
    if (!user) return navigate('/login');
    cartAPI.addItem(crop.id, 1)
      .then(() => { setCartMsg(`${crop.name} added to cart!`); setTimeout(() => setCartMsg(''), 2000); })
      .catch(() => { setCartMsg('Failed to add to cart.'); setTimeout(() => setCartMsg(''), 2000); });
  }
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({ organic: false, available: false, minPrice: '', maxPrice: '' });

  useEffect(() => {
    Promise.all([
      cropsAPI.getAll(),
      cropsAPI.getCategories(),
      cropsAPI.getFarmers(),
    ]).then(([cropsData, catsData, farmersData]) => {
      setCrops(cropsData);
      setCategories(catsData);
      setFarmers(farmersData);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...crops];
    if (search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.farmer.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory !== 'all') list = list.filter(c => c.category === activeCategory);
    if (filters.organic)   list = list.filter(c => c.organic);
    if (filters.available) list = list.filter(c => c.available);
    if (filters.minPrice)  list = list.filter(c => c.price >= Number(filters.minPrice));
    if (filters.maxPrice)  list = list.filter(c => c.price <= Number(filters.maxPrice));

    if (sortBy === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'newest')     list.sort((a, b) => b.id - a.id);
    return list;
  }, [crops, search, activeCategory, sortBy, filters]);

  function handleFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({ organic: false, available: false, minPrice: '', maxPrice: '' });
    setActiveCategory('all');
    setSearch('');
  }

  if (loading) {
    return (
      <PublicLayout>
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--gray)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
          <p>Loading marketplace...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Search */}
      <div className="marketplace-hero">
        <div className="container">
          <h1>🌾 Fresh Crops Marketplace</h1>
          <p>Browse thousands of crops directly from verified Indian farmers</p>
          <div className="marketplace-search-bar">
            <input
              placeholder="Search crops, farmers, or locations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button>🔍 Search</button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-tab${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="marketplace-layout">
          {/* Filter Sidebar */}
          <aside className="filter-sidebar">
            <div className="filter-header">
              <span className="filter-title">🔧 Filters</span>
              <span className="filter-clear" onClick={clearFilters}>Clear All</span>
            </div>

            <div className="filter-group">
              <div className="filter-group-label">Category</div>
              {categories.filter(c => c.id !== 'all').map(cat => (
                <div key={cat.id} className="filter-option">
                  <input type="checkbox" id={cat.id} checked={activeCategory === cat.id}
                    onChange={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)} />
                  <label htmlFor={cat.id}>{cat.icon} {cat.label}</label>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <div className="filter-group-label">Price Range (₹/unit)</div>
              <div className="price-range-inputs">
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => handleFilter('minPrice', e.target.value)} />
                <span className="price-sep">–</span>
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => handleFilter('maxPrice', e.target.value)} />
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-group-label">Quality</div>
              <div className="filter-option">
                <input type="checkbox" id="organic" checked={filters.organic} onChange={e => handleFilter('organic', e.target.checked)} />
                <label htmlFor="organic">🌿 Organic Only</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" id="avail" checked={filters.available} onChange={e => handleFilter('available', e.target.checked)} />
                <label htmlFor="avail">✅ Available Only</label>
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-group-label">Location</div>
              {['Punjab', 'Maharashtra', 'Karnataka', 'Gujarat', 'Kerala'].map(loc => (
                <div key={loc} className="filter-option">
                  <input type="checkbox" id={loc} />
                  <label htmlFor={loc}>📍 {loc}</label>
                </div>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="marketplace-products">
            <div className="marketplace-toolbar">
              <span className="results-count">{filtered.length} crops found</span>
              <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {cartMsg && (
              <div style={{ position: 'fixed', top: 80, right: 24, background: cartMsg.includes('Failed') ? 'var(--danger)' : 'var(--success)', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.875rem', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                {cartMsg}
              </div>
            )}

            {filtered.length > 0 ? (
              <div className="marketplace-grid">
                {filtered.map(crop => (
                  <CropCard key={crop.id} crop={crop} showActions onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--gray)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ marginBottom: '0.5rem' }}>No crops found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nearby Farmers */}
      <section className="nearby-farmers-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <div className="tag">Verified Farmers</div>
            <h2>Trade Directly with Top Farmers</h2>
          </div>
          <div className="farmers-grid">
            {farmers.map(f => (
              <div key={f.id} className="farmer-card">
                <img src={f.image} alt={f.name} />
                {f.verified && <div className="verified-badge">✓ Verified</div>}
                <div className="fc-name">{f.name}</div>
                <div className="fc-location">📍 {f.location}</div>
                <div className="fc-stats">
                  <span>🌾 {f.crops} crops</span>
                  <span>⭐ {f.rating}</span>
                  <span>🗓 {f.yearsActive}y</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
