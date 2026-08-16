import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Eye } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { id: 'all', label: 'All Orders' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data.data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus.toUpperCase()}`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      return o.orderNumber.toLowerCase().includes(query) ||
        o.user?.name?.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <AdminLayout title="Order Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input-dark"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search order # or student..."
              style={{ paddingLeft: 40 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setStatusFilter(opt.id)}
                style={{
                  background: statusFilter === opt.id ? '#E7A83B' : '#2a2a2a',
                  color: statusFilter === opt.id ? '#151515' : '#A8A8A8',
                  border: 'none',
                  borderRadius: 100,
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={fetchOrders} className="btn-ghost">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Queue #</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date / Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td style={{ fontWeight: 800, color: '#E7A83B' }}>{order.orderNumber}</td>
                <td>
                  <span style={{ background: 'rgba(231,168,59,0.1)', color: '#E7A83B', fontWeight: 800, padding: '4px 10px', borderRadius: 8 }}>
                    #{order.queueNumber || '—'}
                  </span>
                </td>
                <td>
                  <div style={{ color: '#fff', fontWeight: 600 }}>{order.user?.name || 'Student'}</div>
                  <div style={{ color: '#777', fontSize: '0.75rem' }}>{order.user?.email}</div>
                </td>
                <td style={{ fontWeight: 800 }}>₹{order.totalAmount}</td>
                <td>
                  <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-new' : 'badge-spicy'}`}>
                    {order.paymentStatus?.toUpperCase()}
                  </span>
                </td>
                <td>
                  <select
                    value={order.orderStatus}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    style={{
                      background: '#2a2a2a',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      padding: '4px 8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pending_payment">Pending Payment</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td style={{ color: '#888', fontSize: '0.8rem' }}>
                  {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td>
                  <button onClick={() => setSelectedOrder(order)} className="btn-ghost" style={{ padding: 6 }}>
                    <Eye size={16} color="#E7A83B" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                  Order #{selectedOrder.orderNumber}
                </h2>
                <div style={{ color: '#A8A8A8', fontSize: '0.8rem' }}>Queue #{selectedOrder.queueNumber}</div>
              </div>
              <span className={`badge status-${selectedOrder.orderStatus}`}>
                {selectedOrder.orderStatus.toUpperCase()}
              </span>
            </div>

            <div style={{ background: '#2a2a2a', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>Student: {selectedOrder.user?.name}</div>
              <div style={{ color: '#A8A8A8', fontSize: '0.8rem' }}>Email: {selectedOrder.user?.email}</div>
              {selectedOrder.user?.mobile && <div style={{ color: '#A8A8A8', fontSize: '0.8rem' }}>Mobile: {selectedOrder.user.mobile}</div>}
            </div>

            <h3 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.88rem' }}>
                  <span>{item.foodName} × {item.quantity}</span>
                  <span style={{ color: '#E7A83B', fontWeight: 700 }}>₹{item.subtotal}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 800 }}>
                <span>Total Amount</span>
                <span style={{ color: '#E7A83B' }}>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => updateStatus(selectedOrder._id, 'preparing')}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', padding: 10, fontSize: '0.85rem' }}
              >
                Mark Preparing
              </button>
              <button
                onClick={() => updateStatus(selectedOrder._id, 'ready')}
                style={{ flex: 1, background: '#22C55E', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, padding: 10, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Mark Ready
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
