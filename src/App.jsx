import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Public pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Location from './pages/Location';

// User pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminFoods from './pages/admin/Foods';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminQueue from './pages/admin/Queue';
import AdminUsers from './pages/admin/Users';
import AdminPayments from './pages/admin/Payments';
import AdminCMS from './pages/admin/CMS';
import AdminAnalytics from './pages/admin/Analytics';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/location" element={<Location />} />

      {/* Protected User */}
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/payment/:orderId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/order/success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
      <Route path="/track/:orderId" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/foods" element={<AdminRoute><AdminFoods /></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/queue" element={<AdminRoute><AdminQueue /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
      <Route path="/admin/cms" element={<AdminRoute><AdminCMS /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1e1e1e', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' },
              success: { iconTheme: { primary: '#E7A83B', secondary: '#151515' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
