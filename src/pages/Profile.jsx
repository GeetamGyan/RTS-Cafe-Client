import { useState } from 'react';
import { User, Mail, Phone, Hash, Save, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    studentId: user?.studentId || '',
    mobile: user?.mobile || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile/me', form);
      const updatedUser = { ...user, ...form };
      localStorage.setItem('rts_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 600, margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        <p className="section-tag" style={{ marginBottom: 4 }}>SETTINGS</p>
        <h1 className="section-title" style={{ marginBottom: 32 }}>My Profile</h1>

        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #E7A83B, #F28C28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '1.8rem', color: '#151515', fontFamily: 'Poppins, sans-serif'
            }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>{user?.name}</h2>
              <div style={{ color: '#A8A8A8', fontSize: '0.85rem' }}>{user?.email}</div>
              <span className={`badge ${user?.role === 'admin' ? 'badge-bestseller' : 'badge-popular'}`} style={{ marginTop: 6 }}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>FULL NAME</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input-dark"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>EMAIL ADDRESS (READ ONLY)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input-dark"
                  value={user?.email}
                  disabled
                  style={{ paddingLeft: 42, opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>STUDENT ID</label>
              <div style={{ position: 'relative' }}>
                <Hash size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input-dark"
                  value={form.studentId}
                  onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))}
                  placeholder="e.g. STU001"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>MOBILE NUMBER</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input-dark"
                  value={form.mobile}
                  onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))}
                  placeholder="10-digit phone number"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary" style={{ marginTop: 12, justifyContent: 'center', padding: 14 }}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
