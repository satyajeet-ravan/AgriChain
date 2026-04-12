import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../utils/AuthContext';
import { authAPI } from '../../api/auth';

export default function BuyerSettings() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', label: '🏪 Business Profile' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'security', label: '🔒 Security' },
    { id: 'payment', label: '💳 Payment Methods' },
  ];

  async function handleSave(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await authAPI.updateProfile(data);
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <DashboardLayout>
      <div className="page-title">Settings</div>
      <div className="page-subtitle">Manage your business account</div>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div className="card" style={{ padding: '0.75rem' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: 'none', background: tab === t.id ? 'var(--accent-light)' : 'transparent', color: tab === t.id ? 'var(--primary)' : 'var(--dark-2)', fontWeight: tab === t.id ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', marginBottom: '0.25rem' }}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="card">
          {saved && <div style={{ background: '#d4edda', color: '#155724', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>✅ Changes saved!</div>}
          {tab === 'profile' && (
            <form onSubmit={handleSave}>
              <div className="card-header"><span className="card-title">🏪 Business Information</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group"><label>Business Name</label><input defaultValue={user?.name} /></div>
                <div className="form-group"><label>Contact Email</label><input type="email" defaultValue={user?.email} /></div>
                <div className="form-group"><label>Phone</label><input defaultValue={user?.phone} /></div>
                <div className="form-group"><label>GST Number</label><input placeholder="22AAAAA0000A1Z5" /></div>
                <div className="form-group"><label>City</label><input defaultValue={user?.location} /></div>
                <div className="form-group"><label>State</label><select><option>Maharashtra</option><option>Karnataka</option><option>Delhi</option></select></div>
              </div>
              <div className="form-group"><label>Delivery Address</label><textarea rows={3} placeholder="Full delivery address" /></div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          )}
          {tab === 'notifications' && (
            <div>
              <div className="card-header"><span className="card-title">🔔 Notification Preferences</span></div>
              {['Order status updates', 'New crop listings in my categories', 'Price drop alerts', 'Weekly procurement report'].map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--dark-2)' }}>{n}</span>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)', width: 18, height: 18 }} />
                </div>
              ))}
            </div>
          )}
          {tab === 'security' && (
            <form onSubmit={handleSave}>
              <div className="card-header"><span className="card-title">🔒 Change Password</span></div>
              <div className="form-group"><label>Current Password</label><input type="password" placeholder="Enter current password" /></div>
              <div className="form-group"><label>New Password</label><input type="password" placeholder="Min. 8 characters" /></div>
              <div className="form-group"><label>Confirm New Password</label><input type="password" placeholder="Repeat new password" /></div>
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          )}
          {tab === 'payment' && (
            <div>
              <div className="card-header"><span className="card-title">💳 Payment Methods</span></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '1.25rem' }}>Manage how you pay for orders on AgriChain.</p>
              {['UPI (GooglePay / PhonePe)', 'Net Banking', 'Credit / Debit Card'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--accent-pale)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>💳 {p}</span>
                  <span className="badge badge-success">Enabled</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
