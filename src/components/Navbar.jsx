import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/orders', label: 'My Orders' },
    { to: '/location', label: 'Location' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
        {/* Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #E7A83B, #F28C28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '1rem', color: '#151515'
            }}>R</div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.5px' }}>
              RTS <span style={{ color: '#E7A83B' }}>CAFE</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '8px 14px', borderRadius: 8, textDecoration: 'none',
                fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
                color: isActive(l.to) ? '#E7A83B' : '#A8A8A8',
                background: isActive(l.to) ? 'rgba(231,168,59,0.1)' : 'transparent'
              }}>{l.label}</Link>
            ))}
            {isAdmin && (
              <Link to="/admin" style={{
                padding: '8px 14px', borderRadius: 8, textDecoration: 'none',
                fontSize: '0.875rem', fontWeight: 600, color: '#E7A83B',
                background: 'rgba(231,168,59,0.1)'
              }}>Admin</Link>
            )}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/menu" style={{ padding: '8px', borderRadius: 8, color: '#A8A8A8', display: 'flex', alignItems: 'center' }}>
              <Search size={18} />
            </Link>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
                  background: '#2a2a2a', border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 100, cursor: 'pointer', color: '#fff', fontSize: '0.875rem', fontWeight: 500
                }}>
                  <User size={16} color="#E7A83B" />
                  {user.name.split(' ')[0]}
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 8,
                    background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12, padding: 8, minWidth: 160, zIndex: 200,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                  }}>
                    {[
                      { to: '/profile', label: 'Profile' },
                      { to: '/orders', label: 'My Orders' },
                    ].map(l => (
                      <Link key={l.to} to={l.to} onClick={() => setUserMenuOpen(false)} style={{
                        display: 'block', padding: '8px 12px', borderRadius: 8,
                        textDecoration: 'none', color: '#ddd', fontSize: '0.875rem',
                        transition: 'all 0.15s',
                      }} onMouseEnter={e => e.target.style.background='rgba(255,255,255,0.06)'}
                         onMouseLeave={e => e.target.style.background='transparent'}>
                        {l.label}
                      </Link>
                    ))}
                    <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }} style={{
                      display: 'block', width: '100%', padding: '8px 12px', borderRadius: 8,
                      background: 'none', border: 'none', textAlign: 'left',
                      color: '#EF4444', fontSize: '0.875rem', cursor: 'pointer',
                    }}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Login</Link>
            )}

            <Link to="/cart" style={{ position: 'relative', padding: 8, display: 'flex', alignItems: 'center', borderRadius: 8 }}>
              <ShoppingCart size={20} color={count > 0 ? '#E7A83B' : '#A8A8A8'} />
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: 0, right: 0,
                  background: '#E7A83B', color: '#151515',
                  width: 18, height: 18, borderRadius: '50%',
                  fontSize: '0.65rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{count}</span>
              )}
            </Link>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost" style={{ display: 'none' }} id="hamburger">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '12px 0',
            animation: 'fadeIn 0.2s ease'
          }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
                display: 'block', padding: '10px 12px', borderRadius: 8,
                textDecoration: 'none', color: isActive(l.to) ? '#E7A83B' : '#ddd',
                fontWeight: 500, fontSize: '0.9rem'
              }}>{l.label}</Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          #hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
