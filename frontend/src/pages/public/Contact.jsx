import { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <PublicLayout>
      <section style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', padding: '3.5rem 0', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <div className="tag" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: '1rem' }}>Contact Us</div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>We're Here to Help</h1>
          <p style={{ opacity: 0.85, maxWidth: 480, margin: '0 auto' }}>Have questions or need support? Reach out — our team responds within 4 business hours.</p>
        </div>
      </section>

      <div className="container">
        <div className="contact-layout">
          {/* Info */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Whether you're a farmer needing help listing your crops or a buyer with a procurement question, we're always available.</p>

            <div className="contact-items">
              {[
                { icon: '📧', label: 'Email', value: 'support@agrichain.in' },
                { icon: '📞', label: 'Toll Free', value: '1800-AGRI-HELP (24/7)' },
                { icon: '💬', label: 'WhatsApp', value: '+91 8087362397' },
                { icon: '📍', label: 'Office', value: 'VJTI Hostel, Near Five Garden, Matunga' },
                { icon: '🕐', label: 'Hours', value: 'Mon–Sat, 9 AM – 6 PM IST' },
              ].map(c => (
                <div key={c.label} className="contact-item">
                  <div className="ci-icon">{c.icon}</div>
                  <div className="ci-content">
                    <div className="ci-label">{c.label}</div>
                    <div className="ci-value">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="map-placeholder">
              <div className="map-icon">🗺️</div>
              <span>AgriChain HQ — Bengaluru, Karnataka</span>
              <span style={{ opacity: 0.6, fontSize: '0.78rem' }}>Map integration placeholder</span>
            </div> */}
          </div>

          {/* Form */}
          <div className="contact-form-card">
            {submitted ? (
              <div className="form-success">
                <div className="success-icon">✅</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. Our support team will contact you within 4 business hours.</p>
              </div>
            ) : (
              <>
                <h3>Send Us a Message</h3>
                <p className="form-sub">Fill in your details and we'll get back to you promptly.</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input required placeholder="Rajesh Kumar" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input required type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>I am a *</label>
                      <select required>
                        <option value="">Select role</option>
                        <option>Farmer</option>
                        <option>Buyer</option>
                        <option>Partner</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Subject *</label>
                    <input required placeholder="How can we help?" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea required rows={5} placeholder="Describe your question or issue in detail..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg">📤 Send Message</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
