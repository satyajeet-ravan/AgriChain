import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatsCard from '../../components/StatsCard/StatsCard';
import { analyticsAPI } from '../../api/analytics';

export default function FarmerAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getFarmerAnalytics()
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <DashboardLayout><div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>Loading analytics...</div></DashboardLayout>;
  }

  const max = Math.max(...data.monthlyRevenue);
  const stats = data.stats || {};

  return (
    <DashboardLayout>
      <div className="page-title">Analytics Dashboard</div>
      <div className="page-subtitle">Performance insights for your farm listings</div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginBottom: '1.5rem' }}>
        <StatsCard icon="✅" label="Conversion Rate" value={`${stats.conversionRate || 0}%`} change="5% improvement" changeType="up" color="var(--success)" bg="#d4edda" />
        <StatsCard icon="⭐" label="Avg. Rating" value={String(stats.avgRating || 0)} color="var(--warning)" bg="#fff3cd" />
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <span className="card-title">📈 Annual Revenue</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>₹{data.monthlyRevenue.reduce((a, b) => a + b, 0).toLocaleString()} total</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: 160, padding: '0 0 24px' }}>
            {data.monthlyRevenue.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div title={`${data.months[i]}: ₹${v.toLocaleString()}`} style={{ width: '100%', height: `${(v / max) * 100}%`, background: `linear-gradient(180deg, var(--primary-light), var(--primary))`, borderRadius: '3px 3px 0 0', transition: 'all 0.5s ease', cursor: 'pointer' }} />
                <div style={{ fontSize: '0.6rem', color: 'var(--gray-light)', marginTop: 4, position: 'absolute', transform: 'translateY(20px)' }}>{data.months[i].slice(0, 1)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">🌾 Top Crops by Revenue</span></div>
          {data.topCrops.map((crop, i) => (
            <div key={crop.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--dark)', marginBottom: 4 }}>{crop.name}</div>
                <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(crop.revenue / 176400) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-light), var(--primary))', borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.875rem' }}>₹{crop.revenue.toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{crop.sales} units</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header"><span className="card-title">📊 Weekly Engagement</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '0.75rem' }}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
            const views = (data.weeklyEngagement || [42, 67, 55, 88, 73, 95, 61])[i];
            const maxViews = Math.max(...(data.weeklyEngagement || [95]));
            return (
              <div key={day} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray)', marginBottom: 6 }}>{day}</div>
                <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{ width: '60%', height: `${(views / maxViews) * 100}%`, background: 'linear-gradient(180deg, var(--accent), var(--primary))', borderRadius: '3px 3px 0 0' }} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--dark)', marginTop: 4 }}>{views}</div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
