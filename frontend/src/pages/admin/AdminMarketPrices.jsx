import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { cropsAPI } from '../../api/crops';

export default function AdminMarketPrices() {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cropsAPI.getAllAdmin()
      .then(data => setCrops(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleFeatured(id, current) {
    cropsAPI.toggleFeatured(id, !current).then(updated => {
      setCrops(prev => prev.map(c => c.id === id ? { ...c, featured: updated.featured } : c));
    });
  }

  const featured = crops.filter(c => c.featured);
  const filtered = crops.filter(c => {
    const matchFilter = filter === 'All' ? true : filter === 'Featured' ? c.featured : !c.featured;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.farmer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) {
    return <DashboardLayout><div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>Loading crops...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="page-title">Live Market Prices</div>
      <div className="page-subtitle">Manage which crops appear in the "Live Market Prices" section on the landing page</div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Crops', value: crops.length, icon: '🌾' },
          { label: 'Featured', value: featured.length, icon: '⭐' },
          { label: 'Not Featured', value: crops.length - featured.length, icon: '📋' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      {featured.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <span className="card-title">Preview — Landing Page</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Shows top 4 featured crops</span>
          </div>
          <div style={{ background: '#1a1a2e', borderRadius: 'var(--radius-md)', padding: '1.25rem', maxWidth: 340 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#95d5b2', fontWeight: 600, marginBottom: '0.75rem' }}>
              <span>Live Market Prices</span>
              <span style={{ color: '#aaa' }}>Today</span>
            </div>
            {featured.slice(0, 4).map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem', color: '#eee' }}>
                <span>{c.category === 'Fruits' ? '🍎' : c.category === 'Vegetables' ? '🥦' : '🌾'} {c.name}</span>
                <span style={{ color: '#95d5b2', fontWeight: 600 }}>₹{c.price}/{c.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Search crops or farmers..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, padding: '0.5rem 1rem', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none' }} />
        {['All', 'Featured', 'Not Featured'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="card">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Crop</th><th>Farmer</th><th>Price</th><th>Featured</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={c.featured ? { background: 'rgba(46,125,50,0.04)' } : {}}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <img src={c.image} alt={c.name} style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{c.category}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{c.farmer}</td>
                  <td><strong style={{ color: 'var(--primary)' }}>₹{c.price}/{c.unit}</strong></td>
                  <td>
                    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!c.featured}
                        onChange={() => toggleFeatured(c.id, c.featured)}
                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      />
                      <span style={{
                        position: 'absolute', inset: 0, borderRadius: 24,
                        background: c.featured ? 'var(--primary)' : '#ccc',
                        transition: 'background 0.25s',
                      }} />
                      <span style={{
                        position: 'absolute', top: 2, left: c.featured ? 22 : 2,
                        width: 20, height: 20, borderRadius: '50%', background: '#fff',
                        transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>No crops found</div>
        )}
      </div>
    </DashboardLayout>
  );
}
