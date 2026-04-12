import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import CropCard from '../../components/CropCard/CropCard';
import { cropsAPI } from '../../api/crops';
import { statsAPI } from '../../api/stats';
import './Home.css';

const testimonials = [
  { id: 1, name: 'Arjun Mehta', role: 'Wholesale Buyer', text: 'AgriChain cut out 3 middlemen for me. I now get fresh produce directly from farmers at 40% lower cost. Revolutionary platform!', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', rating: 5 },
  { id: 2, name: 'Sunita Devi', role: 'Farmer, Bihar', text: 'Before AgriChain, I earned ₹8/kg for my wheat. Now I earn ₹35/kg selling directly. My family income tripled in one season!', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 5 },
  { id: 3, name: 'Rohit Traders', role: 'Restaurant Chain', text: "Consistent quality, transparent pricing, and real-time tracking. We've sourced 50+ tons of vegetables through AgriChain this year.", avatar: 'https://randomuser.me/api/portraits/men/55.jpg', rating: 5 },
];

function HeroCard({ crops }) {
  const live = crops.slice(0, 4);
  return (
    <div className="hero-card-float">
      <div className="hcf-header">
        <span>🟢 Live Market Prices</span>
        <span>Today</span>
      </div>
      {live.map(c => (
        <div key={c.id} className="crop-row">
          <div className="crop-row-name"><span>{c.category === 'Fruits' ? '🍎' : c.category === 'Vegetables' ? '🥦' : '🌾'}</span>{c.name}</div>
          <div className="crop-row-price">₹{c.price}/{c.unit}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [crops, setCrops] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      cropsAPI.getAll().catch(() => []),
      statsAPI.getPlatformStats().catch(() => []),
    ]).then(([cropsData, statsData]) => {
      setCrops(cropsData);
      setStats(statsData);
    }).finally(() => setLoading(false));
  }, []);

  const featuredCrops = crops.slice(0, 4);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-tag">🇮🇳 India's Farmer-First Platform</div>
              <h1>
                Direct Farm to Fork,
                <span className="highlight">Zero Middlemen.</span>
              </h1>
              <p>
                AgriChain connects farmers directly with buyers — ensuring fair prices, real-time tracking, and transparent transactions across India's agricultural supply chain.
              </p>
              <div className="hero-cta">
                <Link to="/register" className="btn btn-orange btn-lg">Get Started Free</Link>
                <Link to="/marketplace" className="btn btn-outline-white btn-lg">Browse Crops</Link>
              </div>
              <div className="hero-stats">
                {stats.map(s => (
                  <div key={s.label} className="hero-stat-item">
                    <div className="hero-stat-value">{s.value}</div>
                    <div className="hero-stat-label">{s.icon} {s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-visual">
              <HeroCard crops={crops} />
              <div className="hero-card-float" style={{ opacity: 0.85, transform: 'scale(0.96)' }}>
                <div className="hcf-header"><span>📦 Recent Order</span><span style={{ color: '#95d5b2' }}>● Live</span></div>
                <div className="crop-row"><div className="crop-row-name">🌾 Basmati Rice — 200kg</div><div className="crop-row-price">✓ Delivered</div></div>
                <div className="crop-row"><div className="crop-row-name">🍎 Alphonso Mango — 50kg</div><div className="crop-row-price">⏳ In Transit</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="tag">The Problem</div>
            <h2>Indian Farmers Lose Billions Annually</h2>
            <p>Multiple middlemen, lack of price transparency, and post-harvest losses are crippling farmer incomes.</p>
          </div>
          <div className="problem-grid">
            {[
              { icon: '💸', stat: '60%', title: 'Income Lost to Middlemen', desc: 'Farmers receive only 20-40% of the final retail price. Middlemen capture the majority of profits without adding real value.' },
              { icon: '🗑️', stat: '40%', title: 'Post-Harvest Spoilage', desc: 'Without direct market access, crops rot in storage. India loses ₹90,000 crore worth of food annually to spoilage.' },
              { icon: '🔍', stat: '0%', title: 'Price Transparency', desc: 'Farmers have no visibility into real market prices, leaving them at the mercy of local mandis and price manipulation.' },
            ].map(p => (
              <div key={p.title} className="problem-card">
                <span className="problem-icon">{p.icon}</span>
                <div className="problem-stat">{p.stat}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="section">
        <div className="container">
          <div className="solution-layout">
            <div className="solution-diagram">
              <div className="diagram-node"><div className="dn-icon">👨‍🌾</div><div className="dn-label">Farmer</div></div>
              <div className="diagram-arrow">↓</div>
              <div className="diagram-node removed"><div className="dn-icon">🏪</div><div className="dn-label">Middleman 1</div></div>
              <div className="diagram-vs"><div className="vs-line" /><div className="vs-badge">REMOVED</div><div className="vs-line" /></div>
              <div className="diagram-node removed"><div className="dn-icon">🏬</div><div className="dn-label">Middleman 2</div></div>
              <div className="diagram-arrow">↓</div>
              <div className="diagram-node"><div className="dn-icon">🏭</div><div className="dn-label">Buyer</div></div>
            </div>
            <div>
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <div className="tag">Our Solution</div>
                <h2>Direct Farmer → Buyer Connection</h2>
                <p>AgriChain eliminates every unnecessary link in the chain, so farmers earn more and buyers pay less.</p>
              </div>
              <div className="solution-features">
                {[
                  { icon: '🔗', title: 'Direct Listings', desc: 'Farmers list crops directly. Buyers browse and purchase without any intermediary.' },
                  { icon: '💰', title: 'Fair Pricing', desc: 'Real-time market prices, transparent bidding, and no hidden commissions.' },
                  { icon: '📦', title: 'Logistics Support', desc: 'Integrated cold-chain logistics and doorstep delivery for every order.' },
                  { icon: '✅', title: 'Quality Verified', desc: 'All produce is verified for quality with photo evidence and grading reports.' },
                ].map(f => (
                  <div key={f.title} className="solution-feature">
                    <div className="sf-icon">{f.icon}</div>
                    <div className="sf-content"><h4>{f.title}</h4><p>{f.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="tag">How It Works</div>
            <h2>Simple. Fast. Transparent.</h2>
            <p>Get started in minutes — whether you're a farmer or a buyer.</p>
          </div>
          <div className="steps-grid">
            {[
              { n: 1, icon: '📝', title: 'Register & Verify', desc: 'Sign up as a Farmer or Buyer. Complete KYC verification in under 10 minutes.' },
              { n: 2, icon: '🌾', title: 'List or Browse', desc: 'Farmers list crops with photos & prices. Buyers browse by category, location, or price.' },
              { n: 3, icon: '🤝', title: 'Connect & Negotiate', desc: 'Connect directly with the other party. Agree on price, quantity, and delivery terms.' },
              { n: 4, icon: '🚚', title: 'Order & Deliver', desc: 'Place the order securely. Track delivery in real-time from farm to doorstep.' },
            ].map(s => (
              <div key={s.n} className="step-card">
                <div className="step-number">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Crops */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="tag">Marketplace</div>
            <h2>Fresh Crops, Farm to Table</h2>
            <p>Browse the freshest listings from verified farmers across India.</p>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>Loading crops...</div>
          ) : (
            <div className="crops-grid">
              {featuredCrops.map(crop => (
                <CropCard key={crop.id} crop={crop} showActions={false} />
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/marketplace" className="btn btn-primary btn-lg">View All Crops →</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="tag">Success Stories</div>
            <h2>Farmers & Buyers Love AgriChain</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} />
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Transform Agriculture?</h2>
          <p>Join 2,400+ farmers and 890+ buyers already trading directly on AgriChain.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-orange btn-lg">Join as Farmer</Link>
            <Link to="/register" className="btn btn-outline-white btn-lg">Join as Buyer</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
