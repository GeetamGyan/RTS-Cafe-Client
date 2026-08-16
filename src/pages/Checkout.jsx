import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import KitchenStatusTicker from '../components/KitchenStatusTicker';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, total } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);

  useEffect(() => {
    api.get('/kitchen/status')
      .then(r => {
        if (r.data?.data?.kitchenStatus === 'CLOSED') {
          setIsKitchenOpen(false);
        }
      })
      .catch(() => {});
  }, []);

  const handlePlaceOrder = async () => {
    if (!isKitchenOpen) {
      return toast.error('Kitchen is currently closed. Orders cannot be placed.');
    }
    if (items.length === 0) return toast.error('Your cart is empty');
    setLoading(true);
    try {
      const orderItems = items.map(i => ({ foodId: i._id, quantity: i.quantity }));
      const { data } = await api.post('/orders', { items: orderItems });
      navigate(`/payment/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally { setLoading(false); }
  };

  const estimatedTime = Math.max(...items.map(i => i.preparationTime || 10), 10) + 5;

  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <KitchenStatusTicker />

      <main style={{ flex: 1, maxWidth: 640, margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        <p className="section-tag" style={{ marginBottom: 6 }}>ALMOST THERE</p>
        <h1 className="section-title" style={{ marginBottom: 32 }}>Review Your Order</h1>

        {/* KITCHEN CLOSED WARNING BANNER */}
        {!isKitchenOpen && (
          <div
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '2px solid #EF4444',
              borderRadius: 20,
              padding: 24,
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔴</div>
            <h2 style={{ color: '#EF4444', fontWeight: 900, fontSize: '1.3rem', margin: '0 0 8px' }}>
              Kitchen is currently closed
            </h2>
            <p style={{ color: '#ddd', fontSize: '0.9rem', margin: '0 0 16px', lineHeight: 1.5 }}>
              We're not accepting new orders right now. Please check back when the kitchen opens.
            </p>
            <Link to="/menu" className="btn-secondary" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '0.85rem' }}>
              Back to Menu
            </Link>
          </div>
        )}

        {/* Order summary */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Order Items</h3>
          {items.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.2rem' }}>{item.category?.emoji || '🍽️'}</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ color: '#A8A8A8', fontSize: '0.78rem' }}>× {item.quantity}</div>
                </div>
              </div>
              <span style={{ color: '#E7A83B', fontWeight: 700 }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>Total</span>
            <span style={{ color: '#E7A83B', fontWeight: 900, fontSize: '1.3rem', fontFamily: 'Poppins, sans-serif' }}>₹{total}</span>
          </div>
        </div>

        {/* Pickup info */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Pickup Details</h3>
          <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
            <MapPin size={18} color="#E7A83B" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 600 }}>RTS Cafe — College Campus</div>
              <div style={{ color: '#A8A8A8', fontSize: '0.85rem' }}>Show your order number when you arrive</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <Clock size={18} color="#E7A83B" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 600 }}>Estimated: {estimatedTime}–{estimatedTime + 5} minutes</div>
              <div style={{ color: '#A8A8A8', fontSize: '0.85rem' }}>After successful payment</div>
            </div>
          </div>
        </div>

        {/* Important note */}
        <div style={{ background: 'rgba(231,168,59,0.08)', border: '1px solid rgba(231,168,59,0.2)', borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <div style={{ color: '#E7A83B', fontWeight: 700, fontSize: '0.85rem', marginBottom: 4 }}>⚠️ Important</div>
          <p style={{ color: '#ddd', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
            Your order will be sent to RTS Cafe for preparation <strong>only after successful payment</strong>. Food preparation does not begin until payment is verified.
          </p>
        </div>

        {isKitchenOpen ? (
          <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
            {loading ? 'Creating order...' : <><span>Proceed to Payment · ₹{total}</span> <ArrowRight size={20} /></>}
          </button>
        ) : (
          <button
            disabled
            style={{
              width: '100%',
              justify: 'center',
              padding: '16px',
              fontSize: '1rem',
              background: '#333',
              color: '#888',
              border: 'none',
              borderRadius: 14,
              fontWeight: 800,
              cursor: 'not-allowed',
            }}
          >
            🔴 Kitchen Closed
          </button>
        )}
      </main>
    </div>
  );
}
