import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUser = async (user) => {
    try {
      await api.put(`/users/${user._id}/toggle`);
      toast.success(`User ${user.isActive ? 'Deactivated' : 'Activated'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.studentId && u.studentId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout title="User Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="input-dark"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students..."
            style={{ paddingLeft: 40 }}
          />
        </div>
        <div style={{ color: '#A8A8A8', fontSize: '0.9rem' }}>
          Total Registered Students: <strong>{users.length}</strong>
        </div>
      </div>

      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>Student ID</th>
              <th>Mobile</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight: 700, color: '#fff' }}>{u.name}</td>
                <td style={{ color: '#A8A8A8' }}>{u.email}</td>
                <td>{u.studentId || '—'}</td>
                <td>{u.mobile || '—'}</td>
                <td style={{ color: '#888', fontSize: '0.8rem' }}>
                  {new Date(u.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td>
                  <span className={`badge ${u.isActive ? 'badge-new' : 'badge-spicy'}`}>
                    {u.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleUser(u)}
                    className="btn-ghost"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      color: u.isActive ? '#EF4444' : '#22C55E',
                      border: `1px solid ${u.isActive ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                      borderRadius: 8
                    }}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
