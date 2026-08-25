import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertOctagon } from 'lucide-react';
import Navbar from '../components/Navbar';
import KitchenStatusTicker from '../components/KitchenStatusTicker';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentState, setPaymentState] = useState('idle'); // idle | processing | verifying | done
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

  // Utility to load Razorpay Checkout Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    if (!isKitchenOpen) {
      return toast.error('Kitchen is currently closed. Payment cannot be created.');
    }

    setPaymentState('processing');

    // 1. Dynamically load script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setPaymentState('idle');
      return toast.error('Razorpay SDK failed to load. Are you connected to the internet?');
    }

    try {
      // 2. Create order in backend (rechecks kitchen status)
      const { data } = await api.post('/payment/create-order', {
        orderId
      });

      const { keyId, razorpayOrderId, amount, currency } = data;

      // 3. Setup Razorpay options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'RTS Cafe',
        description: 'RTS Cafe Food Order pre-payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          setPaymentState('verifying');
          try {
            // 4. Send verification payload to backend API
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              clearCart();
              setPaymentState('done');
              toast.success('Payment successful! 🎉');
              setTimeout(() => navigate(`/order/success/${orderId}`), 500);
            } else {
              setPaymentState('idle');
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            setPaymentState('idle');
            toast.error(err.response?.data?.message || 'Payment verification error');
          }
        },
        prefill: {
          name: order?.user?.name || '',
          email: order?.user?.email || '',
          contact: order?.user?.mobile || ''
        },
        theme: {
          color: '#E7A83B'
        },
        modal: {
          ondismiss: function () {
            setPaymentState('idle');
            toast.error('Payment checkout closed by user.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setPaymentState('idle');
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err) {
      setPaymentState('idle');
      toast.error(err.response?.data?.message || 'Failed to initiate secure payment');
    }
  };

  // Developer Test Helper: Send a fake verification signature
  const handleTestFakeSignature = async () => {
    setPaymentState('processing');
    try {
      toast.loading('Simulating payment & generating order...', { id: 'test' });
      const { data } = await api.post('/payment/create-order', {
        orderId
      });
      
      const { razorpayOrderId } = data;
      toast.loading('Sending tampered signature to backend...', { id: 'test' });
      
      await new Promise(r => setTimeout(r, 1000));
      
      const verifyRes = await api.post('/payment/verify', {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: 'pay_mockedpayment123',
        razorpay_signature: 'fake_tampered_signature_payload_for_testing'
      });
      
      if (verifyRes.data.success) {
        toast.success('Verification bypassed?! This is a vulnerability!', { id: 'test' });
      }
    } catch (err) {
      setPaymentState('idle');
      toast.error(err.response?.data?.message || 'Tampered signature rejected', { id: 'test' });
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

        {/* Order Summary */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Order Summary</h3>
          {/* Order Items */}
          <div style={{ marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
            {order?.items?.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.88rem' }}>
                <span style={{ color: '#ccc' }}>{item.foodName} <strong style={{ color: '#888' }}>× {item.quantity}</strong></span>
                <span style={{ color: '#fff', fontWeight: 600 }}>₹{item.subtotal}</span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem', color: '#A8A8A8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span style={{ color: '#fff' }}>₹{order?.totalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Discount</span>
              <span style={{ color: '#22C55E' }}>₹0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Loyalty Deduction</span>
              <span style={{ color: '#22C55E' }}>-₹0</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>Total</span>
              <span style={{ color: '#E7A83B', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'Poppins, sans-serif' }}>₹{order?.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Kitchen Status Badge */}
        {isKitchenOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
            <span style={{ color: '#22C55E', fontWeight: 700, fontSize: '0.9rem' }}>Kitchen is Open</span>
          </div>
        )}

        {/* Important message */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <ShieldCheck size={20} color="#22C55E" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
            Your order will be sent to RTS Cafe for preparation <strong style={{ color: '#fff' }}>only after successful payment.</strong>
          </p>
        </div>

        {/* Sandbox notice */}
        <div style={{ background: '#2a2a2a', borderRadius: 12, padding: '12px 16px', marginBottom: 24, border: '1px dashed #444' }}>
          <p style={{ color: '#888', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
            🧪 <strong style={{ color: '#A8A8A8' }}>Razorpay Test Mode:</strong> Use standard test credentials during payment checkout (e.g. choose Netbanking or UPI and select Success inside the popup).
          </p>
        </div>

        {/* Test Utilities */}
        <div style={{ background: '#1e1e1e', border: '1px dashed rgba(239,68,68,0.3)', borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <p style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 700, margin: '0 0 8px' }}>🧪 Developer Testing Tools:</p>
          <button
            onClick={handleTestFakeSignature}
            disabled={!isKitchenOpen || paymentState !== 'idle'}
            className="btn-ghost"
            style={{
              width: '100%',
              justifyContent: 'center',
              color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12,
              padding: 10,
              fontSize: '0.85rem'
            }}
          >
            Test Fake Signature (Expect Rejection)
          </button>
        </div>

        {/* Pay button */}
        {!isKitchenOpen ? (
          <button disabled style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', background: '#333', color: '#888', border: 'none', borderRadius: 14, fontWeight: 800, cursor: 'not-allowed' }}>
            🔴 Kitchen Closed · Payment Blocked
          </button>
        ) : paymentState === 'processing' || paymentState === 'verifying' ? (
          <div style={{ background: '#1e1e1e', borderRadius: 14, padding: 24, textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#E7A83B', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#E7A83B', fontWeight: 700, margin: '0 0 4px' }}>
              {paymentState === 'verifying' ? 'Verifying payment details...' : 'Initiating Secure Checkout...'}
            </p>
            <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: 0 }}>Please do not close this window</p>
          </div>
        ) : (
          <button onClick={handlePay} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
            Pay ₹{order?.totalAmount} Securely
          </button>
        )}
      </main>
    </div>
  );
}
