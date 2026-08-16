import { useState, useEffect } from 'react';
import { ChefHat, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Queue() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveQueue = async () => {
    try {
      const { data } = await api.get('/orders/queue/live');
      setOrders(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveQueue();
    const interval = setInterval(fetchLiveQueue, 10000); // 10s auto refresh
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order set to ${newStatus.toUpperCase()}`);
      fetchLiveQueue();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const preparingOrders = orders.filter(o => o.orderStatus === 'preparing');
  const confirmedOrders = orders.filter(o => o.orderStatus === 'confirmed');
  const readyOrders = orders.filter(o => o.orderStatus === 'ready');

  return (
    <AdminLayout title="Live Kitchen Queue">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, margin: 0, fontFamily: 'Poppins, sans-serif' }}>
            Live Preparation Queue
          </h2>
          <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: 0 }}>
            Operational kitchen board. Auto-refreshes every 10 seconds.
          </p>
        </div>
        <button onClick={fetchLiveQueue} className="btn-ghost">
          <RefreshCw size={16} /> Refresh Queue
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {/* Column 1: New Confirmed Orders */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '2px solid #3B82F6', paddingBottom: 10 }}>
            <h3 style={{ color: '#3B82F6', fontSize: '1rem', fontWeight: 800, margin: 0 }}>
              🆕 NEW ORDERS ({confirmedOrders.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {confirmedOrders.map(order => (
              <div key={order._id} style={{ background: '#2a2a2a', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#E7A83B', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'Poppins, sans-serif' }}>
                    #{order.orderNumber}
                  </span>
                  <span style={{ background: '#3B82F6', color: '#fff', fontWeight: 900, padding: '2px 10px', borderRadius: 8 }}>
                    Queue #{order.queueNumber}
                  </span>
                </div>

                <div style={{ color: '#ddd', fontSize: '0.85rem', marginBottom: 12 }}>
                  Student: <strong>{order.user?.name}</strong>
                </div>

                <div style={{ borderTop: '1px dashed #444', paddingTop: 8, marginBottom: 12 }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                      • {item.foodName} × {item.quantity}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => updateStatus(order._id, 'preparing')}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
                >
                  <ChefHat size={16} /> Start Preparation
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Preparing */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '2px solid #F28C28', paddingBottom: 10 }}>
            <h3 style={{ color: '#F28C28', fontSize: '1rem', fontWeight: 800, margin: 0 }}>
              🔥 PREPARING ({preparingOrders.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {preparingOrders.map(order => (
              <div key={order._id} style={{ background: '#2a2a2a', border: '1px solid rgba(242,140,40,0.3)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#E7A83B', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'Poppins, sans-serif' }}>
                    #{order.orderNumber}
                  </span>
                  <span style={{ background: '#F28C28', color: '#fff', fontWeight: 900, padding: '2px 10px', borderRadius: 8 }}>
                    Queue #{order.queueNumber}
                  </span>
                </div>

                <div style={{ color: '#ddd', fontSize: '0.85rem', marginBottom: 12 }}>
                  Student: <strong>{order.user?.name}</strong>
                </div>

                <div style={{ borderTop: '1px dashed #444', paddingTop: 8, marginBottom: 12 }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                      • {item.foodName} × {item.quantity}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => updateStatus(order._id, 'ready')}
                  style={{ width: '100%', background: '#22C55E', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.85rem' }}
                >
                  <CheckCircle size={16} /> Mark Ready for Pickup
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Ready for Pickup */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '2px solid #22C55E', paddingBottom: 10 }}>
            <h3 style={{ color: '#22C55E', fontSize: '1rem', fontWeight: 800, margin: 0 }}>
              🎉 READY FOR PICKUP ({readyOrders.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {readyOrders.map(order => (
              <div key={order._id} style={{ background: '#2a2a2a', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#E7A83B', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'Poppins, sans-serif' }}>
                    #{order.orderNumber}
                  </span>
                  <span style={{ background: '#22C55E', color: '#fff', fontWeight: 900, padding: '2px 10px', borderRadius: 8 }}>
                    Queue #{order.queueNumber}
                  </span>
                </div>

                <div style={{ color: '#ddd', fontSize: '0.85rem', marginBottom: 12 }}>
                  Student: <strong>{order.user?.name}</strong>
                </div>

                <button
                  onClick={() => updateStatus(order._id, 'completed')}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', fontSize: '0.85rem', color: '#fff' }}
                >
                  Mark Handed / Completed
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){div[style*="grid-template-columns: repeat(3, 1fr)"]{grid-template-columns:1fr!important}}`}</style>
    </AdminLayout>
  );
}
