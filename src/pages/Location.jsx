import { MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Location() {
  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-tag" style={{ color: '#E7A83B' }}>VISIT US</p>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 12 }}>RTS Cafe Location</h1>
          <p style={{ color: '#A8A8A8', maxWidth: 500, margin: '0 auto' }}>
            Located right inside the college campus for easy access and quick pre-order pickup.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          {/* Information Card */}
          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 36 }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: 24, fontFamily: 'Poppins, sans-serif' }}>
              Cafe Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(231,168,59,0.1)', padding: 12, borderRadius: 12, color: '#E7A83B', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>Address</h3>
                  <p style={{ color: '#A8A8A8', margin: 0, lineHeight: 1.6, fontSize: '0.9rem' }}>
                    RTS Cafe, Central Student Zone,<br />
                    College Campus Main Building ground floor.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(231,168,59,0.1)', padding: 12, borderRadius: 12, color: '#E7A83B', flexShrink: 0 }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>Operating Hours</h3>
                  <p style={{ color: '#A8A8A8', margin: '0 0 4px', fontSize: '0.9rem' }}>Monday – Saturday: 9:00 AM – 6:00 PM</p>
                  <p style={{ color: '#EF4444', margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>Closed on Sundays & Official Holidays</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(231,168,59,0.1)', padding: 12, borderRadius: 12, color: '#E7A83B', flexShrink: 0 }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>Contact</h3>
                  <p style={{ color: '#A8A8A8', margin: 0, fontSize: '0.9rem' }}>+91 98765 43210</p>
                  <p style={{ color: '#A8A8A8', margin: 0, fontSize: '0.9rem' }}>support@rtscafe.com</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <a
                href="https://maps.app.goo.gl/iFQVP8VALSy2j1UR9"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '0.95rem' }}
              >
                <Navigation size={18} /> Open in Google Maps
              </a>
            </div>
          </div>

          {/* Map Embed */}
          <div style={{
            background: '#1e1e1e',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            overflow: 'hidden',
            height: 480
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjQiTiA3M8KwNTEnMjQuMSJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="RTS Cafe Location Map"
            />
          </div>
        </div>

        <style>{`@media(max-width:768px){main>div:last-child{grid-template-columns:1fr!important}}`}</style>
      </main>
      <Footer />
    </div>
  );
}
