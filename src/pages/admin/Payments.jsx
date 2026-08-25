import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Search, Eye, Filter } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | successful | failed | pending | refunded
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    api.get('/payments')
      .then(res => setPayments(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p => {
    // Search text filter
    const matchesSearch =
      (p.transactionId && p.transactionId.toLowerCase().includes(search.toLowerCase())) ||
      (p.razorpayOrderId && p.razorpayOrderId.toLowerCase().includes(search.toLowerCase())) ||
      (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(search.toLowerCase())) ||
      (p.user?.name && p.user.name.toLowerCase().includes(search.toLowerCase())) ||
      (p.order?.orderNumber && p.order.orderNumber.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    // Status filter
    if (filterStatus === 'all') return true;
    if (filterStatus === 'successful') return p.status === 'success' || p.status === 'CAPTURED';
    if (filterStatus === 'failed') return p.status === 'failed' || p.status === 'FAILED';
    if (filterStatus === 'pending') return p.status === 'pending' || p.status === 'CREATED' || p.status === 'AUTHORIZED';
    if (filterStatus === 'refunded') return p.status === 'refunded' || p.status === 'REFUNDED';
    return true;
  });

  return (
    <AdminLayout title="Payment Records">
      {/* Top Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="input-dark"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Order #, student, Razorpay ID..."
            style={{ paddingLeft: 40 }}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Filter size={16} color="#E7A83B" />
          <div style={{ display: 'flex', background: '#2a2a2a', padding: 4, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            {['all', 'successful', 'failed', 'pending', 'refunded'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  background: filterStatus === status ? '#E7A83B' : 'transparent',
                  color: filterStatus === status ? '#151515' : '#888',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Razorpay Order ID</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date / Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                  No payment records found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedPayment(p)}>
                  <td style={{ fontWeight: 800 }}>{p.order?.orderNumber || '—'}</td>
                  <td style={{ fontWeight: 500, fontFamily: 'monospace', color: '#A8A8A8', fontSize: '0.85rem' }}>
                    {p.razorpayOrderId || p.transactionId || '—'}
                  </td>
                  <td>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{p.user?.name || 'Student'}</div>
                    <div style={{ color: '#666', fontSize: '0.75rem' }}>{p.user?.email}</div>
                  </td>
                  <td style={{ fontWeight: 800, color: '#E7A83B' }}>₹{p.amount}</td>
                  <td style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: '#A8A8A8', fontWeight: 700 }}>{p.paymentMethod}</td>
                  <td>
                    <span className={`badge ${p.status === 'success' || p.status === 'CAPTURED' ? 'badge-new' : p.status === 'failed' || p.status === 'FAILED' ? 'badge-spicy' : 'badge-gold'}`}>
                      {p.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ color: '#888', fontSize: '0.8rem' }}>
                    {new Date(p.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPayment(p);
                      }}
                      className="btn-ghost"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex', gap: 6, alignItems: 'center' }}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32, maxWidth: 500, width: '90%', position: 'relative' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 900, marginBottom: 20, fontFamily: 'Poppins, sans-serif' }}>Payment Record Details</h3>
            <button
              onClick={() => setSelectedPayment(null)}
              style={{
                position: 'absolute',
                right: 20,
                top: 20,
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Order Number:</span>
                <span style={{ color: '#E7A83B', fontWeight: 800 }}>{selectedPayment.order?.orderNumber || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Student Name:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{selectedPayment.user?.name || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Student Email:</span>
                <span style={{ color: '#ccc' }}>{selectedPayment.user?.email || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Student Contact:</span>
                <span style={{ color: '#ccc' }}>{selectedPayment.user?.mobile || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Amount:</span>
                <span style={{ color: '#E7A83B', fontWeight: 900, fontSize: '1.1rem' }}>₹{selectedPayment.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Payment Method:</span>
                <span style={{ color: '#fff', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.85rem' }}>{selectedPayment.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Razorpay Order ID:</span>
                <span style={{ color: '#ccc', fontFamily: 'monospace', fontSize: '0.85rem' }}>{selectedPayment.razorpayOrderId || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Razorpay Payment ID:</span>
                <span style={{ color: '#ccc', fontFamily: 'monospace', fontSize: '0.85rem' }}>{selectedPayment.razorpayPaymentId || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Payment Status:</span>
                <span className={`badge ${selectedPayment.status === 'success' || selectedPayment.status === 'CAPTURED' ? 'badge-new' : selectedPayment.status === 'failed' || selectedPayment.status === 'FAILED' ? 'badge-spicy' : 'badge-gold'}`}>
                  {selectedPayment.status?.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Signature Verified:</span>
                <span style={{ color: selectedPayment.signatureVerified ? '#22C55E' : '#EF4444', fontWeight: 800 }}>
                  {selectedPayment.signatureVerified ? 'YES' : 'NO'}
                </span>
              </div>
              {selectedPayment.failureReason && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                  <span style={{ color: '#777', fontSize: '0.85rem' }}>Failure Reason:</span>
                  <span style={{ color: '#EF4444', fontSize: '0.85rem' }}>{selectedPayment.failureReason}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>Created At:</span>
                <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{new Date(selectedPayment.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPayment(null)}
              className="btn-primary"
              style={{ width: '100%', marginTop: 24, justifyContent: 'center', padding: '12px' }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
