import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#151515' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420, animation: 'slideUp 0.4s ease' }}>
          {/* Card */}
          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '40px 36px' }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #E7A83B, #F28C28)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '1.5rem', color: '#151515' }}>R</div>
              <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 8px', fontFamily: 'Poppins, sans-serif' }}>Welcome Back 👋</h1>
              <p style={{ color: '#A8A8A8', fontSize: '0.875rem', margin: 0 }}>Sign in to your RTS Cafe account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>EMAIL</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className="input-dark" type="email" required value={form.email}
                    onChange={e => setForm(p => ({...p, email: e.target.value}))}
                    placeholder="your@email.com" style={{ paddingLeft: 42 }} />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className="input-dark" type={showPw ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm(p => ({...p, password: e.target.value}))}
                    placeholder="••••••••" style={{ paddingLeft: 42, paddingRight: 42 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 4 }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: '0.95rem' }}>
                {loading ? 'Signing in...' : <><span>Sign In</span> <ArrowRight size={18} /></>}
              </button>
            </form>

            {/* Demo credentials */}
            <div style={{ marginTop: 24, padding: 14, background: '#2a2a2a', borderRadius: 12, border: '1px dashed rgba(231,168,59,0.3)' }}>
              <p style={{ color: '#E7A83B', fontSize: '0.75rem', fontWeight: 700, margin: '0 0 8px' }}>DEMO CREDENTIALS</p>
              <div style={{ color: '#ccc', fontSize: '0.78rem', lineHeight: 1.6 }}>
                <div>Student: student@rtscafe.com / student123</div>
                <div>Admin: admin@rtscafe.com / admin123</div>
              </div>
            </div>

            <p style={{ color: '#A8A8A8', textAlign: 'center', marginTop: 24, fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#E7A83B', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
