import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, MapPin, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(r => setOrder(r.data.data)).catch(() => {});
  }, [orderId]);

  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center', animation: 'slideUp 0.4s ease' }}>
          {/* Success icon */}
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid #22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={44} color="#22C55E" />
          </div>

          <h1 style={{ color: '#fff', fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '1.8rem', margin: '0 0 8px' }}>Payment Successful!</h1>
          <p style={{ color: '#A8A8A8', margin: '0 0 32px' }}>Your order is confirmed and being prepared.</p>

          {/* Order & queue numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <p style={{ color: '#A8A8A8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', margin: '0 0 8px' }}>ORDER NUMBER</p>
              <p style={{ color: '#E7A83B', fontWeight: 900, fontSize: '1.1rem', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                #{order?.orderNumber || 'Loading...'}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #E7A83B, #F28C28)', borderRadius: 16, padding: 20 }}>
              <p style={{ color: 'rgba(21,21,21,0.7)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', margin: '0 0 8px' }}>QUEUE NUMBER</p>
              <p style={{ color: '#151515', fontWeight: 900, fontSize: '2rem', margin: 0, fontFamily: 'Poppins, sans-serif', lineHeight: 1 }}>
                #{order?.queueNumber || '—'}
              </p>
            </div>
          </div>

          {/* Info */}
          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <MapPin size={18} color="#E7A83B" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Pickup at RTS Cafe</div>
                <div style={{ color: '#A8A8A8', fontSize: '0.8rem' }}>College Campus — show your order number</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Clock size={18} color="#E7A83B" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Estimated: 15–20 minutes</div>
                <div style={{ color: '#A8A8A8', fontSize: '0.8rem' }}>We'll notify you when it's ready</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link to={`/track/${orderId}`} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: 14 }}>
              <Ticket size={18} /> Track Order
            </Link>
            <Link to="/menu" className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: 14 }}>
              Order More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
