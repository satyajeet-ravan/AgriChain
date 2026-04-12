import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password, role);
      if (user.role === 'farmer') navigate('/farmer/dashboard');
      else if (user.role === 'buyer') navigate('/buyer/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Left */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="logo">Agri<span>Chain</span></div>
          <div className="tagline">India's Farmer-First Platform</div>
        </div>
        <div className="auth-hero-content">
          <h2>Welcome Back to AgriChain</h2>
          <p>Continue building fair, transparent, and direct agricultural trade. Your dashboard is waiting.</p>
          <div className="auth-feature-list">
            {['Access live market prices', 'Connect directly with farmers/buyers', 'Track all your orders in real-time', 'View earnings & analytics'].map(f => (
              <div key={f} className="auth-feature">
                <div className="auth-feature-icon">✓</div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-bottom">© 2025 AgriChain Technologies Pvt Ltd</div>
      </div>

      {/* Right */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Sign In</h1>
          <p className="auth-form-subtitle">Choose your role and enter your credentials</p>

          {/* Role Selector */}
          <div className="role-selector">
            {[
              { id: 'farmer', icon: '👨‍🌾', name: 'Farmer' },
              { id: 'buyer',  icon: '🏪',  name: 'Buyer' },
              { id: 'admin',  icon: '🛡️',  name: 'Admin' },
            ].map(r => (
              <button key={r.id} className={`role-btn${role === r.id ? ' active' : ''}`} type="button" onClick={() => setRole(r.id)}>
                <span className="role-icon">{r.icon}</span>
                <span className="role-name">{r.name}</span>
              </button>
            ))}
          </div>

          {/* OAuth Placeholder */}
          <div className="auth-oauth">
            <button className="oauth-btn" type="button">
              <span>🌐</span> Continue with Google
            </button>
          </div>
          <div className="auth-divider">or sign in with email</div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-toggle">
                <input type={showPw ? 'text' : 'password'} required placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="toggle-btn" onClick={() => setShowPw(!showPw)}>{showPw ? '🙈' : '👁️'}</button>
              </div>
            </div>
            
            {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1rem' }}>⚠️ {error}</div>}
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? '⏳ Signing in...' : '→ Sign In'}
            </button>
          </form>

          <div className="auth-footer-text">
            Don't have an account? <Link to="/register">Create one free</Link>
          </div>
          <div className="auth-footer-text" style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}>
            Demo: any email + any password works
          </div>
        </div>
      </div>
    </div>
  );
}
