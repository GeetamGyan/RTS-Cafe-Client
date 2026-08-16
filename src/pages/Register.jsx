import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Hash, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', studentId: '', mobile: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(p => ({...p, [k]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, studentId: form.studentId, mobile: form.mobile });
      toast.success('Account created! Welcome to RTS Cafe 🎉');
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const fields = [
    { key: 'name', label: 'FULL NAME', icon: User, type: 'text', placeholder: 'Your full name', required: true },
    { key: 'email', label: 'EMAIL', icon: Mail, type: 'email', placeholder: 'your@email.com', required: true },
    { key: 'studentId', label: 'STUDENT ID', icon: Hash, type: 'text', placeholder: 'e.g. STU001' },
    { key: 'mobile', label: 'MOBILE NUMBER', icon: Phone, type: 'tel', placeholder: '10-digit mobile' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#151515' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 440, animation: 'slideUp 0.4s ease' }}>
          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '40px 36px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #E7A83B, #F28C28)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '1.5rem', color: '#151515' }}>R</div>
              <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 8px', fontFamily: 'Poppins, sans-serif' }}>Create Account</h1>
              <p style={{ color: '#A8A8A8', fontSize: '0.875rem', margin: 0 }}>Join RTS Cafe and skip the queue</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {fields.map(({ key, label, icon: Icon, type, placeholder, required }) => (
                <div key={key}>
                  <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
                  <div style={{ position: 'relative' }}>
                    <Icon size={15} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input className="input-dark" type={type} required={required} value={form[key]}
                      onChange={set(key)} placeholder={placeholder} style={{ paddingLeft: 42 }} />
                  </div>
                </div>
              ))}

              {/* Password */}
              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className="input-dark" type={showPw ? 'text' : 'password'} required value={form.password}
                    onChange={set('password')} placeholder="Min 6 characters" style={{ paddingLeft: 42, paddingRight: 42 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 4 }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>CONFIRM PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className="input-dark" type={showPw ? 'text' : 'password'} required value={form.confirmPassword}
                    onChange={set('confirmPassword')} placeholder="Re-enter password" style={{ paddingLeft: 42 }} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: '0.95rem', marginTop: 4 }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p style={{ color: '#A8A8A8', textAlign: 'center', marginTop: 24, fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#E7A83B', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
