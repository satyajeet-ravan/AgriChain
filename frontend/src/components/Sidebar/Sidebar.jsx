import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { ordersAPI } from '../../api/orders';
import { cartAPI } from '../../api/cart';
import { usersAPI } from '../../api/users';
import { reportsAPI } from '../../api/reports';
import './Sidebar.css';

const farmerLinks = [
  { to: '/farmer/dashboard',  icon: '📊', label: 'Dashboard' },
  { to: '/farmer/crops',      icon: '🌾', label: 'My Crops' },
  { to: '/farmer/add-crop',   icon: '➕', label: 'Add Crop' },
  { to: '/farmer/orders',     icon: '📦', label: 'Orders', badgeKey: 'farmerOrders' },
  { to: '/farmer/earnings',   icon: '💰', label: 'Earnings' },
  { to: '/farmer/analytics',  icon: '📈', label: 'Analytics' },
  { to: '/farmer/settings',   icon: '⚙️', label: 'Settings' },
];

const buyerLinks = [
  { to: '/buyer/dashboard',   icon: '📊', label: 'Dashboard' },
  { to: '/marketplace',       icon: '🛒', label: 'Marketplace' },
  { to: '/buyer/cart',        icon: '🛍️', label: 'Cart', badgeKey: 'cartItems' },
  { to: '/buyer/orders',      icon: '📦', label: 'Orders' },
  { to: '/buyer/settings',    icon: '⚙️', label: 'Settings' },
];

const adminLinks = [
  { to: '/admin/dashboard',   icon: '📊', label: 'Dashboard' },
  { to: '/admin/users',       icon: '👥', label: 'Users', badgeKey: 'pendingUsers' },
  { to: '/admin/crops',       icon: '🌾', label: 'Crops' },
  { to: '/admin/orders',      icon: '📦', label: 'Orders' },
  { to: '/admin/reports',     icon: '🚩', label: 'Reports', badgeKey: 'pendingReports' },
  { to: '/admin/settings',    icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ mobileOpen = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [badges, setBadges] = useState({});

  useEffect(() => {
    if (!user) return;
    const role = user.role;

    if (role === 'farmer' || role === 'both') {
      ordersAPI.getFarmerOrders('Requested')
        .then(data => setBadges(prev => ({ ...prev, farmerOrders: data.length })))
        .catch(() => {});
    }
    if (role === 'buyer' || role === 'both') {
      cartAPI.get()
        .then(data => {
          const items = data.items || data || [];
          setBadges(prev => ({ ...prev, cartItems: items.length }));
        })
        .catch(() => {});
    }
    if (role === 'admin') {
      usersAPI.getAll()
        .then(data => {
          const pending = data.filter(u => !u.verified && !u.blocked).length;
          setBadges(prev => ({ ...prev, pendingUsers: pending }));
        })
        .catch(() => {});
      reportsAPI.getAll()
        .then(data => {
          const reports = data.fraudReports || data || [];
          const pending = reports.filter(r => r.status === 'pending' || r.status === 'investigating').length;
          setBadges(prev => ({ ...prev, pendingReports: pending }));
        })
        .catch(() => {});
    }
  }, [user]);

  const links = user?.role === 'farmer' ? farmerLinks
              : user?.role === 'buyer'  ? buyerLinks
              : adminLinks;

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!user) return null;

  return (
    <aside className={`sidebar${mobileOpen ? ' mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-role-badge">
          {user.role === 'farmer' ? '👨‍🌾' : user.role === 'buyer' ? '🏪' : '🛡️'}
          {' '}{user.role}
        </div>
        <div className="sidebar-user-info">
          <img src={user.avatar} alt={user.name} />
          <div className="sidebar-user-text">
            <div className="s-name">{user.name}</div>
            <div className="s-email">{user.email}</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="link-icon">{link.icon}</span>
            <span>{link.label}</span>
            {link.badgeKey && badges[link.badgeKey] > 0 && <span className="link-badge">{badges[link.badgeKey]}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
