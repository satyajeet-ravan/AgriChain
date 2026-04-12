import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { reportsAPI } from '../../api/reports';

const STATUS_OPTIONS = ['pending', 'investigating', 'resolved', 'dismissed'];

export default function Reports() {
  const [fraudReports, setFraudReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    reportsAPI.getAll()
      .then(data => setFraudReports(data.fraudReports || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const severityBadge = s => s === 'critical' ? 'badge-danger' : s === 'high' ? 'badge-danger' : s === 'medium' ? 'badge-warning' : 'badge-info';
  const statusBadge = s => s === 'resolved' ? 'badge-success' : s === 'dismissed' ? 'badge-info' : s === 'investigating' ? 'badge-warning' : 'badge-primary';
  const typeLabel = t => ({ fraud: 'Fraud', quality: 'Quality Issue', payment: 'Payment', delivery: 'Delivery' }[t] || t);

  function openEdit(r) {
    setEditingId(r.id);
    setEditStatus(r.status);
    setEditNotes(r.admin_notes || '');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditStatus('');
    setEditNotes('');
  }

  function saveEdit(id) {
    reportsAPI.updateStatus(id, editStatus, editNotes).then(updated => {
      setFraudReports(prev => prev.map(r => r.id === id ? updated : r));
      cancelEdit();
    });
  }

  if (loading) {
    return <DashboardLayout><div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>Loading reports...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="page-title">Reports & Monitoring</div>
      <div className="page-subtitle">Review fraud reports and platform violations</div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Reports', value: fraudReports.length, icon: '📊', color: 'var(--dark)' },
          { label: 'Pending', value: fraudReports.filter(r => r.status === 'pending').length, icon: '⏳', color: 'var(--orange)' },
          { label: 'Investigating', value: fraudReports.filter(r => r.status === 'investigating').length, icon: '🔍', color: 'var(--info)' },
          { label: 'Resolved', value: fraudReports.filter(r => r.status === 'resolved').length, icon: '✅', color: 'var(--success)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header"><span className="card-title">🚩 Fraud & Violation Reports</span></div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reporter</th>
                <th>Reported User</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fraudReports.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.id}</strong></td>
                  <td style={{ fontSize: '0.85rem' }}>{r.reporter_name || r.reporter}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>{r.reported_user_name || r.reported}</td>
                  <td>{typeLabel(r.type)}</td>
                  <td><span className={`badge ${severityBadge(r.severity)}`}>{r.severity}</span></td>
                  <td><span className={`badge ${statusBadge(r.status)}`}>{r.status}</span></td>
                  <td style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{r.date}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)}>Manage</button>
                  </td>
                </tr>
              ))}
              {fraudReports.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>No reports found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (() => {
        const report = fraudReports.find(r => r.id === editingId);
        if (!report) return null;
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={cancelEdit}>
            <div className="card" style={{ width: '100%', maxWidth: 520, margin: '1rem' }} onClick={e => e.stopPropagation()}>
              <div className="card-header">
                <span className="card-title">Manage Report {report.id}</span>
                <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--gray)' }} onClick={cancelEdit}>✕</button>
              </div>
              <div style={{ padding: '0.25rem 0 1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '0.75rem' }}>
                  <strong>Reporter:</strong> {report.reporter_name || report.reporter} |
                  <strong> Reported:</strong> <span style={{ color: 'var(--danger)' }}>{report.reported_user_name || report.reported}</span> |
                  <strong> Type:</strong> {typeLabel(report.type)}
                </div>
                <div style={{ fontSize: '0.85rem', marginBottom: '1rem', background: 'var(--bg-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  {report.description}
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Status</label>
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Admin Notes</label>
                  <textarea rows={3} placeholder="Add notes about this report..." value={editNotes} onChange={e => setEditNotes(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline" onClick={cancelEdit}>Cancel</button>
                  <button className="btn btn-primary" onClick={() => saveEdit(editingId)}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </DashboardLayout>
  );
}
