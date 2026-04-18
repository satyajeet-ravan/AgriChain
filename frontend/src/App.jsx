import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './utils/AuthContext';
import './App.css';

// Public Pages
import Home        from './pages/public/Home';
import Marketplace from './pages/public/Marketplace';
import CropDetail  from './pages/public/CropDetail';
import HowItWorks  from './pages/public/HowItWorks';
import About       from './pages/public/About';
import Contact     from './pages/public/Contact';

// Auth Pages
import Login          from './pages/auth/Login';
import Register       from './pages/auth/Register';

// Farmer Pages
import FarmerDashboard  from './pages/farmer/FarmerDashboard';
import AddCrop          from './pages/farmer/AddCrop';
import MyListings       from './pages/farmer/MyListings';
import FarmerOrders     from './pages/farmer/FarmerOrders';
import Earnings         from './pages/farmer/Earnings';
import FarmerAnalytics  from './pages/farmer/FarmerAnalytics';
import FarmerSettings   from './pages/farmer/FarmerSettings';

// Buyer Pages
import BuyerDashboard  from './pages/buyer/BuyerDashboard';
import Cart            from './pages/buyer/Cart';
import BuyerOrders     from './pages/buyer/BuyerOrders';
import BuyerSettings   from './pages/buyer/BuyerSettings';

// Admin Pages
import AdminDashboard  from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import AdminCrops      from './pages/admin/AdminCrops';
import AdminOrders     from './pages/admin/AdminOrders';
import Reports         from './pages/admin/Reports';
import AdminMarketPrices from './pages/admin/AdminMarketPrices';
import AdminSettings   from './pages/admin/AdminSettings';

/* ── Protected Route ── */
function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to correct dashboard
    const path = user.role === 'farmer' ? '/farmer/dashboard' : user.role === 'buyer' ? '/buyer/dashboard' : '/admin/dashboard';
    return <Navigate to={path} replace />;
  }
  return children;
}

/* ── Redirect if already logged in ── */
function GuestRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    const path = user.role === 'farmer' ? '/farmer/dashboard' : user.role === 'buyer' ? '/buyer/dashboard' : '/admin/dashboard';
    return <Navigate to={path} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"             element={<Home />} />
      <Route path="/marketplace"  element={<Marketplace />} />
      <Route path="/marketplace/:id" element={<CropDetail />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about"        element={<About />} />
      <Route path="/contact"      element={<Contact />} />

      {/* ── Auth ── */}
      <Route path="/login"           element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register"        element={<GuestRoute><Register /></GuestRoute>} />
      

      {/* ── Farmer ── */}
      <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRole="farmer"><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/farmer/crops"     element={<ProtectedRoute allowedRole="farmer"><MyListings /></ProtectedRoute>} />
      <Route path="/farmer/add-crop"  element={<ProtectedRoute allowedRole="farmer"><AddCrop /></ProtectedRoute>} />
      <Route path="/farmer/orders"    element={<ProtectedRoute allowedRole="farmer"><FarmerOrders /></ProtectedRoute>} />
      <Route path="/farmer/earnings"  element={<ProtectedRoute allowedRole="farmer"><Earnings /></ProtectedRoute>} />
      <Route path="/farmer/analytics" element={<ProtectedRoute allowedRole="farmer"><FarmerAnalytics /></ProtectedRoute>} />
      <Route path="/farmer/settings"  element={<ProtectedRoute allowedRole="farmer"><FarmerSettings /></ProtectedRoute>} />

      {/* ── Buyer ── */}
      <Route path="/buyer/dashboard"  element={<ProtectedRoute allowedRole="buyer"><BuyerDashboard /></ProtectedRoute>} />
      <Route path="/buyer/cart"       element={<ProtectedRoute allowedRole="buyer"><Cart /></ProtectedRoute>} />
      <Route path="/buyer/orders"     element={<ProtectedRoute allowedRole="buyer"><BuyerOrders /></ProtectedRoute>} />
      <Route path="/buyer/settings"   element={<ProtectedRoute allowedRole="buyer"><BuyerSettings /></ProtectedRoute>} />

      {/* ── Admin ── */}
      <Route path="/admin/dashboard"  element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users"      element={<ProtectedRoute allowedRole="admin"><UsersManagement /></ProtectedRoute>} />
      <Route path="/admin/crops"      element={<ProtectedRoute allowedRole="admin"><AdminCrops /></ProtectedRoute>} />
      <Route path="/admin/orders"     element={<ProtectedRoute allowedRole="admin"><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/market-prices" element={<ProtectedRoute allowedRole="admin"><AdminMarketPrices /></ProtectedRoute>} />
      <Route path="/admin/reports"    element={<ProtectedRoute allowedRole="admin"><Reports /></ProtectedRoute>} />
      <Route path="/admin/settings"   element={<ProtectedRoute allowedRole="admin"><AdminSettings /></ProtectedRoute>} />

      {/* ── 404 ── */}
      <Route path="*" element={
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontFamily: 'var(--font-family)', color: 'var(--dark)' }}>
          <div style={{ fontSize: '5rem' }}>🌾</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>404 — Page Not Found</h1>
          <p style={{ color: 'var(--gray)' }}>The page you're looking for doesn't exist.</p>
          <Link to="/" style={{ padding: '0.75rem 2rem', background: 'var(--primary)', color: '#fff', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      } />
    </Routes>
  );
}
