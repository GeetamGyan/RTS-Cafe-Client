import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, Wallet, ShieldCheck, AlertOctagon } from 'lucide-react';
import Navbar from '../components/Navbar';
import KitchenStatusTicker from '../components/KitchenStatusTicker';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'upi', icon: Smartphone, label: 'UPI', desc: 'PhonePe, GPay, Paytm, BHIM' },
  { id: 'card', icon: CreditCard, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', icon: Building2, label: 'Net Banking', desc: 'All major banks' },
  { id: 'wallet', icon: Wallet, label: 'Wallet', desc: 'Paytm, Mobikwik, Freecharge' },
];

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [loading, setLoading] = useState(true);
  const [paymentState, setPaymentState] = useState('idle'); // idle | processing | done
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/orders/${orderId}`),
      api.get('/kitchen/status')
    ])
      .then(([orderRes, kitchenRes]) => {
        setOrder(orderRes.data.data);
        if (kitchenRes.data?.data?.kitchenStatus === 'CLOSED') {
          setIsKitchenOpen(false);
        }
      })
      .catch(() => navigate('/cart'))
      .finally(() => setLoading(false));
  }, [orderId, navigate]);

  const handlePay = async (simulateSuccess = true) => {
    if (!isKitchenOpen) {
      return toast.error('Kitchen is currently closed. Payment cannot be created.');
    }

    setPaymentState('processing');
    try {
      // Initiate payment (backend re-checks kitchen status)
      const initRes = await api.post('/payments/initiate', { orderId, paymentMethod: selectedMethod });
      const { paymentId } = initRes.data.data;

      // Simulate 2s payment processing
      await new Promise(r => setTimeout(r, 2000));

      // Verify (backend re-checks kitchen status for race conditions)
      const verifyRes = await api.post('/payments/verify', { paymentId, success: simulateSuccess });

      if (simulateSuccess && verifyRes.data.success) {
        clearCart();
        setPaymentState('done');
        toast.success('Payment successful! 🎉');
        setTimeout(() => navigate(`/order/success/${orderId}`), 500);
      } else {
        setPaymentState('idle');
        toast.error('Payment failed. Your order was NOT sent for preparation.');
      }
    } catch (err) {
      setPaymentState('idle');
      toast.error(err.response?.data?.message || 'Payment error');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#E7A83B', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <KitchenStatusTicker />

      <main style={{ flex: 1, maxWidth: 600, margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        <p className="section-tag" style={{ marginBottom: 6 }}>SECURE CHECKOUT</p>
        <h1 className="section-title" style={{ marginBottom: 8 }}>Complete Payment</h1>
        <p style={{ color: '#A8A8A8', marginBottom: 32, fontSize: '0.9rem' }}>to Start Your Order</p>

        {/* Kitchen Closed Alert */}
        {!isKitchenOpen && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '2px solid #EF4444', borderRadius: 20, padding: 20, marginBottom: 24, textAlign: 'center' }}>
            <AlertOctagon size={32} color="#EF4444" style={{ margin: '0 auto 8px' }} />
            <h3 style={{ color: '#EF4444', fontWeight: 900, fontSize: '1.1rem', margin: '0 0 6px' }}>Kitchen Closed</h3>
            <p style={{ color: '#ddd', fontSize: '0.85rem', margin: 0 }}>
              The kitchen has just closed. Payments are currently blocked.
            </p>
          </div>
        )}

        {/* Amount card */}
        <div style={{ background: 'linear-gradient(135deg, #E7A83B20, #F28C2815)', border: '1px solid rgba(231,168,59,0.3)', borderRadius: 20, padding: 24, marginBottom: 24, textAlign: 'center' }}>
          <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: '0 0 8px' }}>Amount to Pay</p>
          <div style={{ color: '#E7A83B', fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Poppins, sans-serif' }}>₹{order?.totalAmount}</div>
          <p style={{ color: '#888', fontSize: '0.8rem', margin: '8px 0 0' }}>Order #{order?.orderNumber || orderId.slice(-6)}</p>
        </div>

        {/* Important message */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <ShieldCheck size={20} color="#22C55E" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
            Your order will be sent to RTS Cafe for preparation <strong style={{ color: '#fff' }}>only after successful payment.</strong>
          </p>
        </div>

        {/* Payment methods */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, marginBottom: 24 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 16px' }}>Payment Method</h3>
          {PAYMENT_METHODS.map(({ id, icon: Icon, label, desc }) => (
            <button key={id} onClick={() => setSelectedMethod(id)} disabled={!isKitchenOpen} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 12, cursor: isKitchenOpen ? 'pointer' : 'not-allowed',
              background: selectedMethod === id ? 'rgba(231,168,59,0.08)' : 'transparent',
              border: `1.5px solid ${selectedMethod === id ? '#E7A83B' : 'transparent'}`,
              marginBottom: 8, transition: 'all 0.2s', opacity: isKitchenOpen ? 1 : 0.5
            }}>
              <div style={{ background: '#2a2a2a', padding: 10, borderRadius: 10 }}><Icon size={18} color={selectedMethod === id ? '#E7A83B' : '#A8A8A8'} /></div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ color: selectedMethod === id ? '#fff' : '#ccc', fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
                <div style={{ color: '#A8A8A8', fontSize: '0.78rem' }}>{desc}</div>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selectedMethod === id ? '#E7A83B' : '#444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selectedMethod === id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E7A83B' }} />}
              </div>
            </button>
          ))}
        </div>

        {/* Sandbox notice */}
        <div style={{ background: '#2a2a2a', borderRadius: 12, padding: '12px 16px', marginBottom: 24, border: '1px dashed #444' }}>
          <p style={{ color: '#888', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
            🧪 <strong style={{ color: '#A8A8A8' }}>Sandbox Mode:</strong> This is a test payment environment. No real money is charged.
          </p>
        </div>

        {/* Pay button */}
        {!isKitchenOpen ? (
          <button disabled style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', background: '#333', color: '#888', border: 'none', borderRadius: 14, fontWeight: 800, cursor: 'not-allowed' }}>
            🔴 Kitchen Closed · Payment Blocked
          </button>
        ) : paymentState === 'processing' ? (
          <div style={{ background: '#1e1e1e', borderRadius: 14, padding: 24, textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#E7A83B', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#E7A83B', fontWeight: 700, margin: '0 0 4px' }}>Processing Payment...</p>
            <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: 0 }}>Please do not close this page</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => handlePay(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
              💳 Pay ₹{order?.totalAmount} (Simulate Success)
            </button>
            <button onClick={() => handlePay(false)} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 12 }}>
              Test Payment Failure
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
