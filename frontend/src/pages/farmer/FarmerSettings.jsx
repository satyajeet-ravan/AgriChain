import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../utils/AuthContext';
import { authAPI } from '../../api/auth';

export default function FarmerSettings() {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'profile', label: '👤 Profile' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'security', label: '🔒 Security' },
    { id: 'bank', label: '🏦 Bank Details' },
  ];

  async function handleProfileSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const updated = await authAPI.updateProfile(data);
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Failed to save.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      await authAPI.changePassword(formData.get('currentPassword'), formData.get('newPassword'));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  }

  function handleGenericSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <DashboardLayout>
      <div className="page-title">Settings</div>
      <div className="page-subtitle">Manage your account and preferences</div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div className="card" style={{ padding: '0.75rem' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: 'none', background: tab === t.id ? 'var(--accent-light)' : 'transparent', color: tab === t.id ? 'var(--primary)' : 'var(--dark-2)', fontWeight: tab === t.id ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', marginBottom: '0.25rem' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="card">
          {saved && <div style={{ background: '#d4edda', color: '#155724', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>✅ Changes saved successfully!</div>}

          {tab === 'profile' && (
            <form onSubmit={handleProfileSave}>
              <div className="card-header"><span className="card-title">👤 Profile Information</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <img src={user?.avatar} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }} />
                <div>
                  <button type="button" className="btn btn-outline btn-sm">Change Photo</button>
                  <p style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: '0.375rem' }}>JPG or PNG, max 2MB</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group"><label>Full Name</label><input name="name" defaultValue={user?.name} /></div>
                <div className="form-group"><label>Email</label><input type="email" name="email" defaultValue={user?.email} readOnly /></div>
                <div className="form-group"><label>Phone</label><input name="phone" defaultValue={user?.phone} /></div>
                <div className="form-group"><label>Location</label><input name="location" defaultValue={user?.location} /></div>
              </div>
              <div className="form-group"><label>Bio</label><textarea name="bio" rows={3} placeholder="Tell buyers about your farm..." defaultValue={user?.bio} /></div>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </form>
          )}

          {tab === 'notifications' && (
            <div>
              <div className="card-header"><span className="card-title">🔔 Notification Preferences</span></div>
              {[
                { label: 'New order received', defaultChecked: true },
                { label: 'Payment credited', defaultChecked: true },
                { label: 'Crop listing approved', defaultChecked: true },
                { label: 'Weekly analytics summary', defaultChecked: false },
              ].map(n => (
                <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--dark-2)' }}>{n.label}</span>
                  <input type="checkbox" defaultChecked={n.defaultChecked} style={{ accentColor: 'var(--primary)', width: 18, height: 18 }} />
                </div>
              ))}
            </div>
          )}

          {tab === 'security' && (
            <form onSubmit={handlePasswordSave}>
              <div className="card-header"><span className="card-title">🔒 Change Password</span></div>
              <div className="form-group"><label>Current Password</label><input type="password" name="currentPassword" placeholder="Enter current password" required /></div>
              <div className="form-group"><label>New Password</label><input type="password" name="newPassword" placeholder="Min. 8 characters" required /></div>
              <div className="form-group"><label>Confirm New Password</label><input type="password" placeholder="Repeat new password" required /></div>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
            </form>
          )}

          {tab === 'bank' && (
            <form onSubmit={handleGenericSave}>
              <div className="card-header"><span className="card-title">🏦 Bank Account Details</span></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '1.25rem' }}>Your earnings will be transferred to this account.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group"><label>Account Holder Name</label><input defaultValue={user?.name} /></div>
                <div className="form-group"><label>Bank Name</label><input placeholder="e.g., State Bank of India" /></div>
                <div className="form-group"><label>Account Number</label><input placeholder="XXXXXXXXXXXXXXXX" /></div>
                <div className="form-group"><label>IFSC Code</label><input placeholder="SBIN0001234" /></div>
              </div>
              <button type="submit" className="btn btn-primary">Save Bank Details</button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
