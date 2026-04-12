import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import './HowItWorks.css';

const farmerSteps = [
  { n: 1, icon: '📝', title: 'Create Account', desc: 'Register with your Aadhaar/PAN and complete KYC. Verification takes under 10 minutes.' },
  { n: 2, icon: '🌾', title: 'List Your Crops', desc: 'Add crop details — variety, quantity, photos, and your asking price. It\'s free to list.' },
  { n: 3, icon: '🤝', title: 'Connect with Buyers', desc: 'Receive enquiries from verified buyers. Negotiate price and terms directly on the platform.' },
  { n: 4, icon: '📦', title: 'Fulfil Orders', desc: 'Confirm orders and schedule pickup. Our logistics partners handle delivery.' },
  { n: 5, icon: '💰', title: 'Get Paid', desc: 'Receive payment directly to your bank account within 24-48 hours of delivery confirmation.' },
];

const buyerSteps = [
  { n: 1, icon: '🏪', title: 'Register as Buyer', desc: 'Sign up with your business details. Get verified in under 24 hours.' },
  { n: 2, icon: '🔍', title: 'Browse & Search', desc: 'Explore thousands of listed crops. Filter by category, price, location, and quality.' },
  { n: 3, icon: '🤝', title: 'Contact Farmers', desc: 'Connect directly with farmers. Ask questions, negotiate, and verify crop details.' },
  { n: 4, icon: '🛒', title: 'Place Orders', desc: 'Add items to cart and place orders. Multiple payment options available.' },
  { n: 5, icon: '🚚', title: 'Track Delivery', desc: 'Real-time tracking from farm to your warehouse. Get delivery updates via SMS and app.' },
];

const faqs = [
  { q: 'Is AgriChain free for farmers?', a: 'Yes! Farmers can list unlimited crops for free. We only charge a small transaction fee (2%) on successful orders.' },
  { q: 'How is payment secured?', a: 'All payments are processed through escrow. Funds are released to farmers only after buyers confirm delivery.' },
  { q: 'What areas does AgriChain cover?', a: 'Currently operating in 18 states across India. We\'re expanding to all states by Q4 2025.' },
  { q: 'How is crop quality verified?', a: 'Farmers upload photos and quality reports. Buyers can also request physical samples for bulk orders.' },
  { q: 'What if there is a dispute?', a: 'Our 24/7 support team mediates all disputes. We have a structured resolution process with fair outcomes.' },
  { q: 'Can I get logistics support?', a: 'Yes, we have partnered with major logistics providers for cold-chain and ambient delivery across India.' },
];

export default function HowItWorks() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', padding: '4rem 0', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <div className="tag" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: '1rem' }}>How It Works</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Simple Steps to Fair Trade</h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.85, maxWidth: 540, margin: '0 auto' }}>
            Whether you're a farmer or a buyer, getting started on AgriChain takes only a few minutes.
          </p>
        </div>
      </section>

      {/* For Farmers */}
      <section className="hiw-section">
        <div className="container">
          <div className="hiw-role-header">
            <span className="hiw-role-icon">👨‍🌾</span>
            <h2>For Farmers</h2>
            <p>Start earning more from your crops in 5 simple steps</p>
          </div>
          <div className="hiw-steps">
            {farmerSteps.map((s, i) => (
              <div key={s.n} className="hiw-step">
                <div className="hiw-step-line">{i < farmerSteps.length - 1 && <div className="step-connector" />}</div>
                <div className="hiw-step-content">
                  <div className="hiw-step-num">{s.n}</div>
                  <div className="hiw-step-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Buyers */}
      <section className="hiw-section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="hiw-role-header">
            <span className="hiw-role-icon">🏪</span>
            <h2>For Buyers</h2>
            <p>Source directly from farmers and cut procurement costs</p>
          </div>
          <div className="hiw-steps">
            {buyerSteps.map((s, i) => (
              <div key={s.n} className="hiw-step">
                <div className="hiw-step-line">{i < buyerSteps.length - 1 && <div className="step-connector buyer" />}</div>
                <div className="hiw-step-content buyer">
                  <div className="hiw-step-num buyer">{s.n}</div>
                  <div className="hiw-step-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="hiw-section">
        <div className="container">
          <div className="section-header">
            <div className="tag">FAQs</div>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-grid">
            {faqs.map(f => (
              <div key={f.q} className="faq-card">
                <h4>❓ {f.q}</h4>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--accent-pale)', padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--accent)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--dark)' }}>Ready to get started?</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>Join thousands of farmers and buyers transforming Indian agriculture.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
            <Link to="/marketplace" className="btn btn-outline btn-lg">Browse Marketplace</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
