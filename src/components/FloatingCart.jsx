import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FloatingCart() {
  const { count, total } = useCart();
  const navigate = useNavigate();

  if (count === 0) return null;

  return (
    <div className="floating-cart" onClick={() => navigate('/cart')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ background: 'rgba(21,21,21,0.3)', borderRadius: 8, padding: '4px 8px', fontWeight: 800, fontSize: '0.9rem' }}>
          {count}
        </div>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{count} item{count > 1 ? 's' : ''} in cart</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>₹{total}</span>
        <ArrowRight size={18} />
      </div>
    </div>
  );
}
