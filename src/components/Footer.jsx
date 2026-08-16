import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Globe } from 'lucide-react';


export default function Footer() {
  return (
    <footer style={{ background: '#111111', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img
                src="/images/logo.png"
                alt="RTS Cafe Logo"
                style={{ height: 42, width: 'auto', borderRadius: 8, objectFit: 'contain' }}
              />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                RTS <span style={{ color: '#E7A83B' }}>CAFE</span>
              </span>
            </div>
            <p style={{ color: '#A8A8A8', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 16px' }}>
              Order online. Skip the queue.<br />Enjoy your food.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', marginTop: 4, flexShrink: 0 }} />
              <span style={{ color: '#22C55E', fontSize: '0.8rem', fontWeight: 600 }}>Open Today · 9AM – 6PM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: 16, letterSpacing: '0.5px' }}>QUICK LINKS</h4>
            {[
              { to: '/', label: 'Home' },
              { to: '/menu', label: 'Menu' },
              { to: '/orders', label: 'Track Order' },
              { to: '/orders', label: 'Order History' },
            ].map(l => (
              <Link key={l.label} to={l.to} style={{ display: 'block', color: '#A8A8A8', textDecoration: 'none', marginBottom: 8, fontSize: '0.875rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#E7A83B'}
                onMouseLeave={e => e.target.style.color='#A8A8A8'}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Location & Hours */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: 16, letterSpacing: '0.5px' }}>LOCATION</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'flex-start' }}>
              <MapPin size={16} color="#E7A83B" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ color: '#A8A8A8', fontSize: '0.875rem', lineHeight: 1.6 }}>RTS Cafe, College Campus</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
              <Clock size={16} color="#E7A83B" style={{ flexShrink: 0 }} />
              <span style={{ color: '#A8A8A8', fontSize: '0.875rem' }}>Mon–Sat: 9:00 AM – 6:00 PM</span>
            </div>
            <a
              href="https://maps.app.goo.gl/iFQVP8VALSy2j1UR9"
              target="_blank" rel="noreferrer"
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', marginTop: 8, display: 'inline-flex' }}
            >
              <MapPin size={14} /> Open in Maps
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ color: '#555', fontSize: '0.8rem', margin: 0 }}>© 2026 RTS Cafe. All rights reserved.</p>
          <p style={{ color: '#555', fontSize: '0.8rem', margin: 0 }}>Order Online · Pay First · We Prepare · You Collect</p>
        </div>
      </div>
    </footer>
  );
}
