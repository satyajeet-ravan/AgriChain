import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatsCard from '../../components/StatsCard/StatsCard';
import { ordersAPI } from '../../api/orders';
import { cropsAPI } from '../../api/crops';

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ordersAPI.getBuyerOrders().catch(() => []),
      cropsAPI.getAll().catch(() => []),
    ]).then(([ordersData, cropsData]) => {
      setOrders(ordersData);
      setCrops(cropsData);
    }).finally(() => setLoading(false));
  }, []);

  const statusBadge = s => s === 'Delivered' ? 'badge-success' : s === 'Shipped' ? 'badge-info' : 'badge-warning';

  if (loading) {
    return <DashboardLayout><div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>Loading dashboard...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="page-title">Buyer Dashboard</div>
      <div className="page-subtitle">Welcome back! Here's your procurement overview.</div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <StatsCard icon="🛒" label="Total Orders" value={String(orders.length)} change="8 this month" changeType="up" color="var(--primary)" bg="var(--accent-light)" />
        <StatsCard icon="💰" label="Total Spent" value={`₹${(orders.reduce((s, o) => s + (o.amount || 0), 0) / 1000).toFixed(0)}K`} change="12% vs last month" changeType="up" color="var(--orange)" bg="var(--orange-light)" />
        <StatsCard icon="🚚" label="In Transit" value={String(orders.filter(o => o.status === 'Shipped').length)} color="var(--info)" bg="#d1ecf1" />
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <span className="card-title">📦 Recent Orders</span>
            <Link to="/buyer/orders" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>View All</Link>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Crop</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 4).map(o => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong><div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{o.date}</div></td>
                    <td>{o.crop}<div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>👨‍🌾 {o.farmer}</div></td>
                    <td><strong style={{ color: 'var(--primary)' }}>₹{o.amount.toLocaleString()}</strong></td>
                    <td><span className={`badge ${statusBadge(o.status)}`}>{o.status}</span></td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">🌾 Recommended For You</span>
            <Link to="/marketplace" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Browse All</Link>
          </div>
          {crops.slice(0, 4).map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <img src={c.image} alt={c.name} style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>👨‍🌾 {c.farmer} · 📍 {c.location}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>₹{c.price}/{c.unit}</div>
                <Link to="/marketplace" className="btn btn-primary btn-sm" style={{ marginTop: '0.25rem' }}>Buy</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header"><span className="card-title">⚡ Quick Actions</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {[
            { icon: '🛒', label: 'View Cart', link: '/buyer/cart', color: 'var(--primary)', bg: 'var(--accent-light)' },
            { icon: '📦', label: 'My Orders', link: '/buyer/orders', color: 'var(--info)', bg: '#d1ecf1' },
            { icon: '🛒', label: 'Marketplace', link: '/marketplace', color: 'var(--orange)', bg: 'var(--orange-light)' },
          ].map(a => (
            <Link key={a.label} to={a.link} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: a.bg, textDecoration: 'none', transition: 'all 0.2s', border: '1px solid rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '1.75rem' }}>{a.icon}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: a.color }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
