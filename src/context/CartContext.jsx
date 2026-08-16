import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('rts_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rts_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (food, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === food._id);
      if (existing) {
        return prev.map(i => i._id === food._id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...food, quantity: qty }];
    });
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeItem(id);
    setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
