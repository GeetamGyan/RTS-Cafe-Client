import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['confirmed', 'preparing', 'ready'].includes(o.orderStatus);
    if (filter === 'completed') return o.orderStatus === 'completed';
    if (filter === 'cancelled') return ['cancelled', 'rejected', 'pending_payment'].includes(o.orderStatus);
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 900, margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <p className="section-tag" style={{ marginBottom: 4 }}>MY ACCOUNT</p>
            <h1 className="section-title">Order History</h1>
          </div>
          <button onClick={fetchOrders} className="btn-ghost">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active Queue' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled / Failed' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                background: filter === f.id ? '#E7A83B' : '#2a2a2a',
                color: filter === f.id ? '#151515' : '#A8A8A8',
                border: 'none',
                borderRadius: 100,
                padding: '8px 18px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#E7A83B', borderRadius: '50%', margin: '0 auto' }} className="animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#1e1e1e', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🍽️</div>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>No orders found</h3>
            <p style={{ color: '#A8A8A8', marginBottom: 24 }}>Your next delicious campus meal is just a click away.</p>
            <Link to="/menu" className="btn-primary">Order Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredOrders.map(order => (
              <div key={order._id} style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ color: '#E7A83B', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Poppins, sans-serif' }}>
                        #{order.orderNumber}
                      </span>
                      <span className={`badge status-${order.orderStatus}`}>
                        {order.orderStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div style={{ color: '#777', fontSize: '0.8rem' }}>
                      {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>₹{order.totalAmount}</div>
                    {order.queueNumber && (
                      <div style={{ color: '#E7A83B', fontSize: '0.8rem', fontWeight: 700, marginTop: 2 }}>
                        Queue #{order.queueNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items summary */}
                <div style={{ marginBottom: 16 }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#ccc', marginBottom: 4 }}>
                      <span>{item.foodName} × {item.quantity}</span>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to={`/track/${order._id}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    View Status & Receipt <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
