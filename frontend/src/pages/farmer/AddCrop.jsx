import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { cropsAPI } from '../../api/crops';
import './AddCrop.css';

export default function AddCrop() {
  const [varieties, setVarieties] = useState({});
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [varietyId, setVarietyId] = useState('');
  const [form, setForm] = useState({ quantity: '', unit: 'kg', price: '', minOrder: '', description: '', harvestDate: '', organic: false, available: true });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cropsAPI.getVarieties().then(setVarieties).catch(() => {});
  }, []);

  const categoryList = Object.keys(varieties);
  const subCategoryList = category ? Object.keys(varieties[category] || {}) : [];
  const varietyList = category && subCategory ? (varieties[category]?.[subCategory] || []) : [];

  function handleChange(k, v) { setForm(p => ({ ...p, [k]: v })); }

  function resetForm() {
    setCategory('');
    setSubCategory('');
    setVarietyId('');
    setForm({ quantity: '', unit: 'kg', price: '', minOrder: '', description: '', harvestDate: '', organic: false, available: true });
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await cropsAPI.create({ variety_id: varietyId, ...form });
      setSaved(true);
      resetForm();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add crop.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="page-title">Add New Crop</div>
      <div className="page-subtitle">List your crop on the AgriChain marketplace</div>

      {saved && (
        <div className="save-success">
          ✅ Crop listed successfully! It will appear in the marketplace after admin approval.
        </div>
      )}
      {error && (
        <div style={{ background: '#fdf2f2', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>⚠️ {error}</div>
      )}

      <form onSubmit={handleSave} className="add-crop-form">
        <div className="two-col">
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <div className="card-header"><span className="card-title">🌾 Crop Details</span></div>
              <div className="form-group">
                <label>Category *</label>
                <select required value={category} onChange={e => { setCategory(e.target.value); setSubCategory(''); setVarietyId(''); }}>
                  <option value="">Select Category</option>
                  {categoryList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Sub-Category *</label>
                <select required value={subCategory} onChange={e => { setSubCategory(e.target.value); setVarietyId(''); }} disabled={!category}>
                  <option value="">Select Sub-Category</option>
                  {subCategoryList.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Variety *</label>
                <select required value={varietyId} onChange={e => setVarietyId(e.target.value)} disabled={!subCategory}>
                  <option value="">Select Variety</option>
                  {varietyList.map(v => <option key={v.id} value={v.id}>{v.variety}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={4} placeholder="Describe your crop quality, growing methods, etc." value={form.description} onChange={e => handleChange('description', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={form.organic} onChange={e => handleChange('organic', e.target.checked)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                  🌿 Organic Certified
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={form.available} onChange={e => handleChange('available', e.target.checked)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                  ✅ Available Now
                </label>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <div className="card-header"><span className="card-title">💰 Pricing & Quantity</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Quantity Available *</label>
                  <input type="number" required min="1" placeholder="500" value={form.quantity} onChange={e => handleChange('quantity', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select value={form.unit} onChange={e => handleChange('unit', e.target.value)}>
                    {['kg', 'quintal', 'ton', 'dozen', 'litre'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Price per {form.unit} (₹) *</label>
                  <input type="number" required min="1" placeholder="42" value={form.price} onChange={e => handleChange('price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Min. Order</label>
                  <input type="number" placeholder="10" value={form.minOrder} onChange={e => handleChange('minOrder', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Harvest Date</label>
                <input type="date" value={form.harvestDate} onChange={e => handleChange('harvestDate', e.target.value)} />
              </div>
              {form.price && form.quantity && (
                <div className="price-preview">
                  <span>📊 Estimated Value:</span>
                  <strong>₹{(Number(form.price) * Number(form.quantity)).toLocaleString()}</strong>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">📷 Crop Photos</span></div>
              <div className="image-upload-area">
                <div className="upload-placeholder">
                  <span style={{ fontSize: '2.5rem' }}>📸</span>
                  <p>Drop photos here or click to upload</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--gray-light)' }}>JPG, PNG up to 5MB each (max 5 photos)</p>
                  <input type="file" multiple accept="image/*" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: '0.5rem' }}>💡 High quality photos increase buyer trust and order rates by 3x</p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }}>Save Draft</button>
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2 }} disabled={loading}>
                {loading ? '⏳ Saving...' : '🌾 List Crop'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
