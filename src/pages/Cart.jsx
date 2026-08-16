import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total, count } = useCart();
  const navigate = useNavigate();

  if (count === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 20 }}>🛒</div>
          <h2 style={{ color: '#fff', fontWeight: 800, marginBottom: 8, fontFamily: 'Poppins, sans-serif' }}>Your cart is empty</h2>
          <p style={{ color: '#A8A8A8', marginBottom: 32 }}>Hungry? Let's fix that.</p>
          <Link to="/menu" className="btn-primary" style={{ padding: '14px 32px' }}>Explore Menu</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 1000, margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <p className="section-tag" style={{ marginBottom: 4 }}>YOUR ORDER</p>
            <h1 className="section-title">Your Cart</h1>
          </div>
          <button onClick={clearCart} className="btn-ghost" style={{ color: '#EF4444' }}>
            <Trash2 size={16} /> Clear All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <div key={item._id} style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s' }}>
                {/* Emoji/image */}
                <div style={{ width: 60, height: 60, borderRadius: 12, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0, overflow: 'hidden' }}>
                  {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : item.category?.emoji || '🍽️'}
                </div>

                {/* Name & info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.foodType === 'veg' ? '#22C55E' : '#EF4444' }} />
                    <span style={{ color: '#A8A8A8', fontSize: '0.78rem' }}>₹{item.price} each</span>
                  </div>
                </div>

                {/* Qty controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button className="qty-btn" onClick={() => updateQty(item._id, item.quantity - 1)}><Minus size={13} /></button>
                  <span style={{ color: '#fff', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQty(item._id, item.quantity + 1)}><Plus size={13} /></button>
                </div>

                {/* Subtotal */}
                <div style={{ textAlign: 'right', minWidth: 70 }}>
                  <div style={{ color: '#E7A83B', fontWeight: 800, fontSize: '1.05rem' }}>₹{item.price * item.quantity}</div>
                  <button onClick={() => removeItem(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 4, marginTop: 2 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, position: 'sticky', top: 80 }}>
            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: '0 0 20px', fontFamily: 'Poppins, sans-serif' }}>Order Summary</h3>

            {/* Pickup info */}
            <div style={{ background: 'rgba(231,168,59,0.08)', border: '1px solid rgba(231,168,59,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
              <div style={{ color: '#E7A83B', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>📍 PICKUP LOCATION</div>
              <div style={{ color: '#ddd', fontSize: '0.85rem' }}>RTS Cafe — College Campus</div>
              <div style={{ color: '#A8A8A8', fontSize: '0.78rem', marginTop: 2 }}>⏱ Estimated: 15–20 min after payment</div>
            </div>

            {items.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#A8A8A8', fontSize: '0.85rem' }}>{item.name} × {item.quantity}</span>
                <span style={{ color: '#ddd', fontSize: '0.85rem', fontWeight: 600 }}>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>Total</span>
                <span style={{ color: '#E7A83B', fontWeight: 900, fontSize: '1.3rem', fontFamily: 'Poppins, sans-serif' }}>₹{total}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: '0.95rem' }}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <Link to="/menu" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 10, display: 'flex' }}>
              + Add more items
            </Link>
          </div>
        </div>

        <style>{`@media(max-width:768px){main>div:last-child{grid-template-columns:1fr!important}}`}</style>
      </main>
      <Footer />
    </div>
  );
}
