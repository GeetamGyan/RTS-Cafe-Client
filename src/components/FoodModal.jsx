import { useState } from 'react';
import { X, Plus, Minus, Clock, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function FoodModal({ food, onClose }) {
  const { items, addItem, updateQty } = useCart();
  const cartItem = items.find(i => i._id === food._id);
  const [localQty, setLocalQty] = useState(cartItem?.quantity || 1);
  const { count } = useCart();

  const handleAddToCart = () => {
    if (cartItem) {
      updateQty(food._id, localQty);
    } else {
      addItem(food, localQty);
    }
    toast.success(`${food.name} added to cart!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#2a2a2a' }}>
          {food.image ? (
            <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
              {food.category?.emoji || '🍽️'}
            </div>
          )}
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff'
          }}><X size={16} /></button>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', margin: 0, flex: 1 }}>{food.name}</h2>
            <span style={{ color: '#E7A83B', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'Poppins, sans-serif', flexShrink: 0, marginLeft: 12 }}>₹{food.price}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: food.foodType === 'veg' ? '#22C55E' : '#EF4444' }} />
            <span style={{ color: '#A8A8A8', fontSize: '0.8rem', textTransform: 'capitalize' }}>{food.foodType}</span>
            {food.preparationTime && <>
              <span style={{ color: '#444' }}>•</span>
              <Clock size={12} color="#A8A8A8" />
              <span style={{ color: '#A8A8A8', fontSize: '0.8rem' }}>{food.preparationTime} min</span>
            </>}
          </div>

          <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>{food.description || 'Freshly prepared at RTS Cafe.'}</p>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button className="qty-btn" onClick={() => setLocalQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', minWidth: 24, textAlign: 'center' }}>{localQty}</span>
              <button className="qty-btn" onClick={() => setLocalQty(q => q + 1)}><Plus size={14} /></button>
            </div>
          </div>

          <button onClick={handleAddToCart} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: '0.95rem' }}
            disabled={!food.isAvailable}>
            <ShoppingCart size={18} />
            {food.isAvailable ? `Add to Cart · ₹${food.price * localQty}` : 'Currently Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
