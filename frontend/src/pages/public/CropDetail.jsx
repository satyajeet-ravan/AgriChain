import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { cropsAPI } from '../../api/crops';
import { cartAPI } from '../../api/cart';
import { useAuth } from '../../utils/AuthContext';

export default function CropDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMsg, setCartMsg] = useState('');

  function handleAddToCart() {
    if (!user) return navigate('/login');
    cartAPI.addItem(crop.id, 1)
      .then(() => { setCartMsg('Added to cart!'); setTimeout(() => setCartMsg(''), 2000); })
      .catch(() => { setCartMsg('Failed to add to cart.'); setTimeout(() => setCartMsg(''), 2000); });
  }

  useEffect(() => {
    cropsAPI.getById(id)
      .then(data => setCrop(data))
      .catch(() => setError('Crop not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PublicLayout>
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--gray)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
          <p>Loading crop details...</p>
        </div>
      </PublicLayout>
    );
  }

  if (error || !crop) {
    return (
      <PublicLayout>
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--gray)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--dark)' }}>Crop Not Found</h2>
          <p>The crop you're looking for doesn't exist or has been removed.</p>
          <Link to="/marketplace" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }}>← Back to Marketplace</Link>
        </div>
      </PublicLayout>
    );
  }

  const fullStars = Math.floor(crop.rating || 0);
  const stars = Array.from({ length: 5 }, (_, i) => i < fullStars ? '★' : '☆').join('');

  return (
    <PublicLayout>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
          {' / '}
          <Link to="/marketplace" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Marketplace</Link>
          {' / '}
          <span>{crop.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Image */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--off-white)' }}>
            <img src={crop.image} alt={crop.name} style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: '0.5rem' }}>
              {crop.organic && <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>🌿 Organic</span>}
              {!crop.available && <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>Out of Stock</span>}
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>{crop.category}</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '0.5rem' }}>{crop.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              <span style={{ color: '#f5a623' }}>{stars}</span>
              <span>{crop.rating}</span>
              <span>({crop.reviews} reviews)</span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>
              ₹{crop.price}<span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--gray)' }}>/{crop.unit}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '1.5rem' }}>
              📦 {crop.quantity} {crop.unit} available
              {crop.minOrder && <span> · Min order: {crop.minOrder} {crop.unit}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem', background: 'var(--off-white)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray)' }}>👨‍🌾 Farmer</span>
                <strong>{crop.farmer}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray)' }}>📍 Location</span>
                <strong>{crop.location}</strong>
              </div>
              {crop.harvestDate && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray)' }}>🗓 Harvest Date</span>
                  <strong>{crop.harvestDate}</strong>
                </div>
              )}
              {crop.variety && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray)' }}>🌱 Variety</span>
                  <strong>{crop.variety}</strong>
                </div>
              )}
            </div>

            {crop.description && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--dark)' }}>Description</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6, fontSize: '0.9rem' }}>{crop.description}</p>
              </div>
            )}

            {cartMsg && (
              <div style={{ marginBottom: '0.75rem', padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', background: cartMsg.includes('Failed') ? '#fdf2f2' : '#d4edda', color: cartMsg.includes('Failed') ? 'var(--danger)' : '#155724', fontWeight: 600, fontSize: '0.875rem' }}>
                {cartMsg}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {(user?.role === 'buyer' || user?.role === 'both') && crop.available && (
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAddToCart}>🛒 Add to Cart</button>
              )}
              <Link to="/marketplace" className="btn btn-outline btn-lg" style={{ flex: 1, textAlign: 'center' }}>← Back to Marketplace</Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
