import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <span className="logo-text">Agri<span>Chain</span></span>
            <p>Connecting farmers directly to buyers — eliminating middlemen, ensuring fair prices, and building a transparent agricultural supply chain across India.</p>
            <div className="footer-social">
              <a href="#!" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#!" className="social-link" aria-label="Facebook">📘</a>
              <a href="#!" className="social-link" aria-label="Instagram">📸</a>
              <a href="#!" className="social-link" aria-label="LinkedIn">💼</a>
              <a href="#!" className="social-link" aria-label="YouTube">▶️</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Platform</h4>
            <nav className="footer-links">
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/how-it-works">How It Works</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>

          {/* For Users */}
          <div className="footer-col">
            <h4>For You</h4>
            <nav className="footer-links">
              <Link to="/register">Join as Farmer</Link>
              <Link to="/register">Join as Buyer</Link>
              <Link to="/login">Login</Link>
              <Link to="/how-it-works">FAQs</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact-item"><span>📧</span> support@agrichain.in</div>
            <div className="footer-contact-item"><span>📞</span> 1800-AGRI-HELP (Toll Free)</div>
            <div className="footer-contact-item"><span>📍</span>VJTI Hostel, Near Five Garden, Matunga</div>
            <div className="footer-contact-item"><span>🕐</span> Mon–Sat, 9 AM – 6 PM</div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AgriChain Technologies Pvt Ltd. All rights reserved.</p>
          <div className="footer-badges">
            <span className="footer-badge">Privacy Policy</span>
            <span className="footer-badge">Terms of Service</span>
            <span className="footer-badge">DPIIT Recognised</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
