import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ordersAPI } from '../../api/orders';
import { reportsAPI } from '../../api/reports';

const REPORT_TYPES = [
  { value: 'fraud', label: 'Fraud' },
  { value: 'quality', label: 'Quality Issue' },
  { value: 'payment', label: 'Payment Issue' },
  { value: 'delivery', label: 'Delivery Issue' },
];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Report modal state
  const [reportOrder, setReportOrder] = useState(null);
  const [reportForm, setReportForm] = useState({ type: 'fraud', description: '', severity: 'medium' });
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState('');

  useEffect(() => {
    ordersAPI.getBuyerOrders()
      .then(data => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = s => s === 'Delivered' ? 'badge-success' : s === 'Shipped' ? 'badge-info' : 'badge-warning';
  const statusIcon  = s => s === 'Delivered' ? '✅' : s === 'Shipped' ? '🚚' : '⏳';

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
        reported_user_id: reportOrder.farmerId,
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
      <div className="page-title">My Orders</div>
      <div className="page-subtitle">Track and manage all your purchases</div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? 'minmax(0, 1fr) 340px' : '1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">📦 Order History</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{orders.length} orders</span>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Order ID</th><th>Farmer</th><th>Crop</th><th>Qty</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(o)}>
                    <td><strong>{o.id}</strong></td>
                    <td>👨‍🌾 {o.farmer}</td>
                    <td>{o.crop}</td>
                    <td>{o.quantity}kg</td>
                    <td><strong style={{ color: 'var(--primary)' }}>₹{o.amount.toLocaleString()}</strong></td>
                    <td style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{o.date}</td>
                    <td><span className={`badge ${statusBadge(o.status)}`}>{statusIcon(o.status)} {o.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); setSelected(o); }}>Track</button>
                        <button className="btn btn-sm" style={{ background: '#fdf2f2', color: 'var(--danger)', border: '1px solid #f5c6cb', whiteSpace: 'nowrap' }} onClick={e => { e.stopPropagation(); openReport(o); }}>🚩 Report</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="card" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 54px + 1.5rem)', maxHeight: 'calc(100vh - var(--navbar-height) - 54px - 3rem)', overflowY: 'auto' }}>
            <div className="card-header">
              <span className="card-title">📋 {selected.id}</span>
              <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--gray)' }} onClick={() => setSelected(null)}>✕</button>
            </div>
            <span className={`badge ${statusBadge(selected.status)}`} style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
              {statusIcon(selected.status)} {selected.status}
            </span>
            {[['Crop', selected.crop], ['Farmer', selected.farmer], ['Quantity', `${selected.quantity}kg`], ['Amount', `₹${selected.amount.toLocaleString()}`], ['Order Date', selected.date], ['Tracking #', selected.tracking]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--gray)' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem' }}>Order Progress</div>
              {(() => {
                const isRejected = selected.status === 'Rejected';
                const stepIdx = selected.status === 'Delivered' ? 2 : selected.status === 'Processing' ? 1 : 0;
                const steps = [
                  { label: 'Order Requested', done: stepIdx >= 0 },
                  { label: 'Farmer Reviewing', done: stepIdx >= 1 },
                  isRejected
                    ? { label: 'Rejected', done: true, rejected: true }
                    : { label: 'Accepted', done: stepIdx >= 2 },
                ];
                return steps.map((step, i) => (
                  <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: step.rejected ? 'var(--danger)' : step.done ? 'var(--primary)' : 'var(--border)', color: step.done || step.rejected ? '#fff' : 'var(--gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                      {step.rejected ? '✕' : step.done ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: step.done || step.rejected ? 600 : 400, color: step.rejected ? 'var(--danger)' : step.done ? 'var(--dark)' : 'var(--gray-light)' }}>{step.label}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={closeReport}>
          <div className="card" style={{ width: '100%', maxWidth: 480, margin: '1rem' }} onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <span className="card-title">🚩 Report Farmer</span>
              <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--gray)' }} onClick={closeReport}>✕</button>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '1rem' }}>
              Reporting <strong style={{ color: 'var(--danger)' }}>{reportOrder.farmer}</strong> for order <strong>{reportOrder.id}</strong>
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
