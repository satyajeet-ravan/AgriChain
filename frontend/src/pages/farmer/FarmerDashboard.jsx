import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatsCard from '../../components/StatsCard/StatsCard';
import { analyticsAPI } from '../../api/analytics';
import { ordersAPI } from '../../api/orders';
import './FarmerDashboard.css';

function MiniBar({ months, values }) {
  const max = Math.max(...values);
  return (
    <div className="mini-bar-chart">
      {values.map((v, i) => (
        <div key={i} className="mini-bar-wrap" title={`${months[i]}: ₹${v.toLocaleString()}`}>
          <div className="mini-bar" style={{ height: `${(v / max) * 100}%` }} />
          <span className="mini-bar-label">{months[i].slice(0, 1)}</span>
        </div>
      ))}
    </div>
  );
}

export default function FarmerDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.getFarmerAnalytics().catch(() => null),
      ordersAPI.getFarmerOrders().catch(() => []),
    ]).then(([analyticsData, ordersData]) => {
      setAnalytics(analyticsData);
      setOrders(ordersData);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <DashboardLayout><div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>Loading dashboard...</div></DashboardLayout>;
  }

  const stats = analytics?.stats || {};
  const recentOrders = orders.slice(0, 4);

  return (
    <DashboardLayout>
      <div className="page-title">Farmer Dashboard</div>
      <div className="page-subtitle">Welcome back! Here's your farm overview.</div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        <StatsCard icon="💰" label="Total Earnings" value={`₹${(stats.totalEarnings || 0).toLocaleString()}`} change="18% this month" changeType="up" color="var(--primary)" bg="var(--accent-light)" />
        <StatsCard icon="📦" label="Active Orders" value={String(stats.activeOrders || 0)} change="3 new today" changeType="up" color="var(--info)" bg="#d1ecf1" />
        <StatsCard icon="🌾" label="Listed Crops" value={String(stats.listedCrops || 0)} color="var(--orange)" bg="var(--orange-light)" />
        <StatsCard icon="⭐" label="Avg. Rating" value={String(stats.avgRating || 0)} change={`from ${stats.reviews || 0} reviews`} color="var(--warning)" bg="#fff3cd" />
      </div>

      <div className="two-col">
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📈 Monthly Revenue</span>
            <span className="badge badge-success">2025</span>
          </div>
          {analytics?.monthlyRevenue && analytics?.months ? (
            <MiniBar months={analytics.months} values={analytics.monthlyRevenue} />
          ) : (
            <div style={{ color: 'var(--gray)', padding: '2rem', textAlign: 'center' }}>No data</div>
          )}
          {analytics?.monthlyRevenue && (
            <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '0.5rem' }}>Peak month: December (₹{Math.max(...(analytics.monthlyRevenue || [0])).toLocaleString()})</div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📦 Recent Orders</span>
            <a href="/farmer/orders" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>View All</a>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Order</th><th>Buyer</th><th>Crop</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>
                    <td>{o.buyer}</td>
                    <td>{o.crop}</td>
                    <td><strong style={{ color: 'var(--primary)' }}>₹{o.amount.toLocaleString()}</strong></td>
                    <td><span className={`badge ${o.status === 'Delivered' ? 'badge-success' : o.status === 'Processing' ? 'badge-warning' : o.status === 'Shipped' ? 'badge-info' : 'badge-primary'}`}>{o.status}</span></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)', padding: '2rem' }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }} className="two-col">
        {/* Top Crops */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🌾 Top Performing Crops</span>
          </div>
          {(analytics?.topCrops || []).map(crop => (
            <div key={crop.name} className="crop-performance-row">
              <span className="cp-name">{crop.name}</span>
              <div className="cp-bar-wrap">
                <div className="cp-bar" style={{ width: `${(crop.sales / 4200) * 100}%` }} />
              </div>
              <span className="cp-revenue">₹{crop.revenue.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header"><span className="card-title">⚡ Quick Actions</span></div>
          <div className="quick-actions-grid">
            {[
              { icon: '➕', label: 'Add New Crop', link: '/farmer/add-crop', color: 'var(--primary)', bg: 'var(--accent-light)' },
              { icon: '📦', label: 'View Orders', link: '/farmer/orders', color: 'var(--info)', bg: '#d1ecf1' },
              { icon: '📈', label: 'Analytics', link: '/farmer/analytics', color: 'var(--success)', bg: '#d4edda' },
              { icon: '💰', label: 'Earnings', link: '/farmer/earnings', color: 'var(--warning)', bg: '#fff3cd' },
            ].map(a => (
              <a key={a.label} href={a.link} className="quick-action-btn" style={{ '--qa-color': a.color, '--qa-bg': a.bg }}>
                <span className="qa-icon">{a.icon}</span>
                <span className="qa-label">{a.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
