import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ordersAPI } from '../../api/orders';
import { reportsAPI } from '../../api/reports';

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];
const REPORT_TYPES = [
  { value: 'fraud', label: 'Fraud' },
  { value: 'quality', label: 'Quality Issue' },
  { value: 'payment', label: 'Payment Issue' },
  { value: 'delivery', label: 'Delivery Issue' },
];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Report modal state
  const [reportOrder, setReportOrder] = useState(null);
  const [reportForm, setReportForm] = useState({ type: 'fraud', description: '', severity: 'medium' });
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState('');

  useEffect(() => {
    ordersAPI.getFarmerOrders()
      .then(data => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);
  const statusBadge = s => s === 'Delivered' ? 'badge-success' : s === 'Processing' ? 'badge-warning' : s === 'Shipped' ? 'badge-info' : 'badge-primary';

  function handleStatusUpdate(orderId, newStatus) {
    ordersAPI.updateStatus(orderId, newStatus).then(updated => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status } : o));
    });
  }

  function openReport(order) {
    setReportOrder(order);
    setReportForm({ type: 'fraud', description: '', severity: 'medium' });
    setReportSuccess('');
  }

  function closeReport() {
    setReportOrder(null);
    setReportSuccess('');
  }

  async function submitReport(e) {
    e.preventDefault();
    setReportLoading(true);
    try {
      await reportsAPI.create({
        reported_user_id: reportOrder.buyerId,
        type: reportForm.type,
        description: reportForm.description,
        severity: reportForm.severity,
      });
      setReportSuccess('Report submitted successfully.');
      setTimeout(closeReport, 1500);
    } catch {
      setReportSuccess('Failed to submit report.');
    } finally {
      setReportLoading(false);
    }
  }

  if (loading) {
    return <DashboardLayout><div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>Loading orders...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="page-title">Orders Received</div>
      <div className="page-subtitle">Manage and fulfil incoming orders</div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Orders', value: orders.length, icon: '📦' },
          { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, icon: '⏳' },
          { label: 'Shipped', value: orders.filter(o => o.status === 'Shipped').length, icon: '🚚' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: '✅' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {statusOptions.map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      <div className="card">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Order ID</th><th>Buyer</th><th>Crop</th><th>Qty</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.id}</strong></td>
                  <td>{o.buyer}</td>
                  <td>{o.crop}</td>
                  <td>{o.quantity}kg</td>
                  <td><strong style={{ color: 'var(--primary)' }}>₹{o.amount.toLocaleString()}</strong></td>
                  <td style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{o.date}</td>
                  <td><span className={`badge ${statusBadge(o.status)}`}>{o.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                      <select className="sort-select" style={{ fontSize: '0.78rem', padding: '0.3rem 0.5rem' }} defaultValue="" onChange={e => { if (e.target.value) handleStatusUpdate(o.id, e.target.value); e.target.value = ''; }}>
                        <option value="" disabled>Update</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                      </select>
                      <button className="btn btn-sm" style={{ background: '#fdf2f2', color: 'var(--danger)', border: '1px solid #f5c6cb', whiteSpace: 'nowrap' }} onClick={() => openReport(o)}>🚩 Report</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
            <p>No {filter !== 'All' ? filter.toLowerCase() : ''} orders found</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={closeReport}>
          <div className="card" style={{ width: '100%', maxWidth: 480, margin: '1rem' }} onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <span className="card-title">🚩 Report Buyer</span>
              <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--gray)' }} onClick={closeReport}>✕</button>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '1rem' }}>
              Reporting <strong style={{ color: 'var(--danger)' }}>{reportOrder.buyer}</strong> for order <strong>{reportOrder.id}</strong>
            </div>
            {reportSuccess ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: reportSuccess.includes('success') ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{reportSuccess}</div>
            ) : (
              <form onSubmit={submitReport}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Type *</label>
                  <select required value={reportForm.type} onChange={e => setReportForm(p => ({ ...p, type: e.target.value }))}>
                    {REPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Severity *</label>
                  <select required value={reportForm.severity} onChange={e => setReportForm(p => ({ ...p, severity: e.target.value }))}>
                    {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Description *</label>
                  <textarea required rows={4} placeholder="Describe the issue in detail..." value={reportForm.description} onChange={e => setReportForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={closeReport}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={reportLoading}>{reportLoading ? 'Submitting...' : 'Submit Report'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
