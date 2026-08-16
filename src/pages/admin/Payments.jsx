import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Search } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/payments')
      .then(res => setPayments(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p =>
    p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.order?.orderNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Payment Records">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="input-dark"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search txn ID, student..."
            style={{ paddingLeft: 40 }}
          />
        </div>
      </div>

      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Order #</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date / Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#E7A83B' }}>
                  {p.transactionId || '—'}
                </td>
                <td style={{ fontWeight: 700 }}>{p.order?.orderNumber || '—'}</td>
                <td>{p.user?.name || 'Student'}</td>
                <td style={{ fontWeight: 800 }}>₹{p.amount}</td>
                <td style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: '#A8A8A8' }}>{p.paymentMethod}</td>
                <td>
                  <span className={`badge ${p.status === 'success' ? 'badge-new' : 'badge-spicy'}`}>
                    {p.status?.toUpperCase()}
                  </span>
                </td>
                <td style={{ color: '#888', fontSize: '0.8rem' }}>
                  {new Date(p.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
