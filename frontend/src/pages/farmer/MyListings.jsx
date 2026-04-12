import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { cropsAPI } from '../../api/crops';
import { useAuth } from '../../utils/AuthContext';

export default function MyListings() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cropsAPI.getAll({ farmerId: user?.id })
      .then(data => setList(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  function toggleStatus(id) {
    const crop = list.find(c => c.id === id);
    if (!crop) return;
    cropsAPI.update(id, { available: !crop.available }).then(updated => {
      setList(prev => prev.map(c => c.id === id ? { ...c, ...updated, status: updated.available ? 'Active' : 'Inactive' } : c));
    });
  }

  function deleteCrop(id) {
    cropsAPI.remove(id).then(() => {
      setList(prev => prev.filter(c => c.id !== id));
    });
  }

  if (loading) {
    return <DashboardLayout><div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>Loading listings...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div className="page-title">My Crop Listings</div>
          <div className="page-subtitle">Manage all your crop listings</div>
        </div>
        <Link to="/farmer/add-crop" className="btn btn-primary">➕ Add New Crop</Link>
      </div>

      <div className="card">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Crop</th><th>Category</th><th>Price</th><th>Qty</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {list.map(crop => (
                <tr key={crop.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={crop.image} alt={crop.name} style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{crop.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{crop.organic ? '🌿 Organic' : '🌾 Conventional'}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{crop.category}</span></td>
                  <td><strong style={{ color: 'var(--primary)' }}>₹{crop.price}/{crop.unit}</strong></td>
                  <td>{crop.quantity}{crop.unit}</td>
                  <td>
                    <span className={`badge ${crop.available ? 'badge-success' : 'badge-danger'}`}>
                      {crop.available ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(crop.id)}>
                        {crop.available ? '⏸ Pause' : '▶ Activate'}
                      </button>
                      <button className="btn btn-sm" style={{ background: 'var(--orange-light)', color: 'var(--orange-dark)', border: '1px solid var(--orange-light)' }}>✏️</button>
                      <button className="btn btn-sm" style={{ background: '#fdf2f2', color: 'var(--danger)', border: '1px solid #fdf2f2' }} onClick={() => deleteCrop(crop.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>No listings yet. <Link to="/farmer/add-crop" style={{ color: 'var(--primary)' }}>Add your first crop</Link></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
