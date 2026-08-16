import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Megaphone } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CMS() {
  const [announcements, setAnnouncements] = useState([]);
  const [hero, setHero] = useState({ title: '', subtitle: '', buttonText: '', buttonLink: '' });
  const [loading, setLoading] = useState(true);

  // New announcement form
  const [newAnn, setNewAnn] = useState({ title: '', message: '', type: 'info' });

  const fetchData = async () => {
    try {
      const { data } = await api.get('/cms/home');
      const heroSec = data.data.sections.find(s => s.section === 'hero');
      if (heroSec) setHero(heroSec);
      setAnnouncements(data.data.announcements);
    } catch (err) {
      toast.error('Failed to load CMS data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHeroSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/cms/section/hero', hero);
      toast.success('Hero section updated!');
    } catch (err) {
      toast.error('Failed to update hero');
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cms/announcements', newAnn);
      toast.success('Announcement added!');
      setNewAnn({ title: '', message: '', type: 'info' });
      fetchData();
    } catch (err) {
      toast.error('Failed to add announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await api.delete(`/cms/announcements/${id}`);
      toast.success('Announcement deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete announcement');
    }
  };

  return (
    <AdminLayout title="Content Management System (CMS)">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Section 1: Hero Settings */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: 20, fontFamily: 'Poppins, sans-serif' }}>
            Homepage Hero Banner
          </h2>

          <form onSubmit={handleHeroSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>HERO TITLE</label>
              <input
                className="input-dark"
                value={hero.title}
                onChange={e => setHero({ ...hero, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>HERO SUBTITLE</label>
              <textarea
                className="input-dark"
                rows={3}
                value={hero.subtitle}
                onChange={e => setHero({ ...hero, subtitle: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>CTA BUTTON TEXT</label>
                <input
                  className="input-dark"
                  value={hero.buttonText}
                  onChange={e => setHero({ ...hero, buttonText: e.target.value })}
                />
              </div>
              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>CTA BUTTON LINK</label>
                <input
                  className="input-dark"
                  value={hero.buttonLink}
                  onChange={e => setHero({ ...hero, buttonLink: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: 8, justifyContent: 'center' }}>
              <Save size={18} /> Save Hero Section
            </button>
          </form>
        </div>

        {/* Section 2: Announcements */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: 20, fontFamily: 'Poppins, sans-serif' }}>
            Announcements & Tickers
          </h2>

          <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, background: '#2a2a2a', padding: 16, borderRadius: 16 }}>
            <div style={{ fontWeight: 700, color: '#E7A83B', fontSize: '0.85rem' }}>+ Create New Announcement</div>
            <div>
              <input
                className="input-dark"
                placeholder="Title (e.g. 🎉 Today's Special)"
                value={newAnn.title}
                onChange={e => setNewAnn({ ...newAnn, title: e.target.value })}
                required
              />
            </div>
            <div>
              <input
                className="input-dark"
                placeholder="Message (e.g. Cheese Blast Fries available!)"
                value={newAnn.message}
                onChange={e => setNewAnn({ ...newAnn, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', alignSelf: 'flex-start' }}>
              Publish
            </button>
          </form>

          {/* Announcement list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {announcements.map(ann => (
              <div key={ann._id} style={{ background: '#2a2a2a', borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{ann.title}</div>
                  <div style={{ color: '#A8A8A8', fontSize: '0.8rem' }}>{ann.message}</div>
                </div>
                <button onClick={() => handleDeleteAnnouncement(ann._id)} className="btn-ghost" style={{ padding: 6, color: '#EF4444' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </AdminLayout>
  );
}
