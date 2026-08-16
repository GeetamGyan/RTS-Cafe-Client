import { useState } from 'react';
import { Plus, Minus, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import FoodModal from './FoodModal';

const BADGE_CLASSES = {
  POPULAR: 'badge-popular',
  BESTSELLER: 'badge-bestseller',
  NEW: 'badge-new',
  SPICY: 'badge-spicy',
};

export default function FoodCard({ food }) {
  const { items, addItem, updateQty } = useCart();
  const [showModal, setShowModal] = useState(false);
  const cartItem = items.find(i => i._id === food._id);
  const qty = cartItem?.quantity || 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(food, 1);
    toast.success(`${food.name} added!`, { duration: 1500 });
  };

  const handleInc = (e) => { e.stopPropagation(); updateQty(food._id, qty + 1); };
  const handleDec = (e) => { e.stopPropagation(); updateQty(food._id, qty - 1); };

  // Food image placeholder with emoji fallback
  const categoryEmoji = food.category?.emoji || '🍽️';

  return (
    <>
      <div className="food-card" onClick={() => setShowModal(true)}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#2a2a2a' }}>
          {food.image ? (
            <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.5rem', background: 'linear-gradient(135deg, #2a2a2a, #222)'
            }}>{categoryEmoji}</div>
          )}
          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {food.badge && <span className={`badge ${BADGE_CLASSES[food.badge] || 'badge-popular'}`}>{food.badge}</span>}
          </div>
          {/* Veg indicator */}
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <div style={{
              width: 22, height: 22, border: `2px solid ${food.foodType === 'veg' ? '#22C55E' : '#EF4444'}`,
              borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.6)'
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: food.foodType === 'veg' ? '#22C55E' : '#EF4444' }} />
            </div>
          </div>
          {/* Unavailable overlay */}
          {!food.isAvailable && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ background: '#EF4444', color: '#fff', padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700 }}>UNAVAILABLE</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '14px 14px 14px' }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 4px', lineHeight: 1.3 }}>{food.name}</h3>
          <p style={{ color: '#A8A8A8', fontSize: '0.78rem', margin: '0 0 12px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {food.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#E7A83B', fontWeight: 800, fontSize: '1.05rem', fontFamily: 'Poppins, sans-serif' }}>₹{food.price}</span>

            {food.isAvailable && (
              qty === 0 ? (
                <button onClick={handleAdd} style={{
                  background: 'linear-gradient(135deg, #E7A83B, #F28C28)',
                  border: 'none', borderRadius: 8, padding: '7px 14px',
                  color: '#151515', fontWeight: 700, fontSize: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s'
                }}>
                  <Plus size={15} /> Add
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={handleDec} className="qty-btn"><Minus size={13} /></button>
                  <span style={{ color: '#fff', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                  <button onClick={handleInc} className="qty-btn"><Plus size={13} /></button>
                </div>
              )
            )}
          </div>

          {food.preparationTime && (
            <p style={{ color: '#666', fontSize: '0.72rem', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              ⏱ {food.preparationTime} min prep
            </p>
          )}
        </div>
      </div>

      {showModal && <FoodModal food={food} onClose={() => setShowModal(false)} />}
    </>
  );
}
