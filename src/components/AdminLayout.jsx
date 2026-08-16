import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, UtensilsCrossed, Tag, ClipboardList,
  Users, CreditCard, FileText, BarChart3, LogOut, ChevronRight,
  ListOrdered, Gift
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/rewards', label: 'Kitchen & Rewards', icon: Gift },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/queue', label: 'Live Queue', icon: ListOrdered },
  { to: '/admin/foods', label: 'Food Items', icon: UtensilsCrossed },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/cms', label: 'CMS', icon: FileText },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({ children, title }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#151515' }}>
      {/* Sidebar */}
      <div className="admin-sidebar">
        {/* Logo */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/images/logo.png"
              alt="RTS Cafe Logo"
              style={{ height: 38, width: 'auto', borderRadius: 6, objectFit: 'contain' }}
            />
            <div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>RTS Admin</div>
              <div style={{ fontSize: '0.7rem', color: '#A8A8A8' }}>Control Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className={`sidebar-link ${active ? 'active' : ''}`}>
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #E7A83B, #F28C28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#151515', fontSize: '0.85rem' }}>
              {user?.name?.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ color: '#A8A8A8', fontSize: '0.7rem' }}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#A8A8A8', fontSize: '0.8rem' }}>RTS Admin</span>
            <ChevronRight size={14} color="#555" />
            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{title}</span>
          </div>
          <Link to="/" style={{ color: '#A8A8A8', fontSize: '0.8rem', textDecoration: 'none' }}>← View Site</Link>
        </div>
        <div style={{ padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
