import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, MapPin, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const STEPS = [
  { key: 'pending_payment', label: 'Payment Successful', desc: 'Payment received' },
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Sent to kitchen' },
  { key: 'preparing', label: 'Preparing', desc: 'Food is being prepared' },
  { key: 'ready', label: 'Ready for Pickup', desc: 'Come collect your order!' },
  { key: 'completed', label: 'Completed', desc: 'Order collected' },
];

const STATUS_ORDER = ['pending_payment', 'confirmed', 'preparing', 'ready', 'completed'];

const STATUS_COLORS = {
  pending_payment: '#F59E0B',
  confirmed: '#3B82F6',
  preparing: '#F28C28',
  ready: '#22C55E',
  completed: '#10B981',
  cancelled: '#EF4444',
  rejected: '#EF4444',
};

export default function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data.data);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [orderId]);

  const currentIdx = STATUS_ORDER.indexOf(order?.orderStatus);
  const isReady = order?.orderStatus === 'ready';
  const isCancelled = ['cancelled', 'rejected'].includes(order?.orderStatus);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#E7A83B', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 560, margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <p className="section-tag" style={{ marginBottom: 4 }}>LIVE STATUS</p>
            <h1 className="section-title">Track Order</h1>
          </div>
          <button onClick={fetchOrder} className="btn-ghost" style={{ padding: '8px 12px' }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Ready banner */}
        {isReady && (
          <div style={{ background: 'linear-gradient(135deg, #22C55E20, #10B98120)', border: '2px solid #22C55E', borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 24, animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>
            <h2 style={{ color: '#22C55E', fontFamily: 'Poppins, sans-serif', fontWeight: 900, margin: '0 0 8px' }}>Your Order Is Ready!</h2>
            <p style={{ color: '#ccc', margin: '0 0 16px' }}>Please visit RTS Cafe and show your order number.</p>
            <div style={{ background: '#22C55E', color: '#fff', borderRadius: 12, padding: '12px 24px', display: 'inline-block', fontWeight: 900, fontSize: '1.5rem', fontFamily: 'Poppins, sans-serif' }}>
              #{order?.queueNumber}
            </div>
          </div>
        )}

        {/* Order info */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ color: '#A8A8A8', fontSize: '0.78rem', marginBottom: 2 }}>Order Number</div>
              <div style={{ color: '#E7A83B', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Poppins, sans-serif' }}>{order?.orderNumber}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#A8A8A8', fontSize: '0.78rem', marginBottom: 2 }}>Queue Number</div>
              <div style={{ background: '#E7A83B', color: '#151515', fontWeight: 900, fontSize: '1.4rem', borderRadius: 10, padding: '4px 16px', fontFamily: 'Poppins, sans-serif' }}>#{order?.queueNumber}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className={`badge status-${order?.orderStatus}`} style={{ fontSize: '0.8rem', padding: '5px 12px' }}>
              {order?.orderStatus?.replace('_', ' ').toUpperCase()}
            </span>
            {!isCancelled && <span style={{ color: '#A8A8A8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} /> ~{order?.estimatedTime || 15} min
            </span>}
          </div>

          {/* Items */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
            {order?.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.85rem', marginBottom: 6 }}>
                <span>{item.foodName} × {item.quantity}</span>
                <span style={{ color: '#E7A83B' }}>₹{item.subtotal}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>Total Paid</span>
              <span style={{ color: '#E7A83B', fontWeight: 800 }}>₹{order?.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Status</h3>
            {STEPS.map((step, i) => {
              const isDone = i < currentIdx;
              const isActive = i === currentIdx;
              return (
                <div key={step.key}>
                  <div className="timeline-step">
                    <div className={`timeline-dot ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                      {isDone ? <CheckCircle2 size={12} /> : isActive ? '●' : ''}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: isDone || isActive ? '#fff' : '#555', fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}>{step.label}</div>
                      <div style={{ color: isDone || isActive ? '#A8A8A8' : '#444', fontSize: '0.78rem', marginTop: 2 }}>{step.desc}</div>
                    </div>
                    {isActive && <div style={{ color: '#E7A83B', fontSize: '0.75rem', fontWeight: 700 }}>CURRENT</div>}
                  </div>
                  {i < STEPS.length - 1 && <div className={`timeline-line ${isDone ? 'done' : ''}`} />}
                </div>
              );
            })}
          </div>
        )}

        {/* Pickup info */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 18, display: 'flex', gap: 12 }}>
          <MapPin size={18} color="#E7A83B" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 600 }}>Pickup at RTS Cafe</div>
            <div style={{ color: '#A8A8A8', fontSize: '0.82rem' }}>College Campus — show your order number to the staff</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
