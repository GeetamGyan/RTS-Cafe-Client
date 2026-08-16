import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [form, setForm] = useState({
    name: '',
    emoji: '🍽️',
    tagline: '',
    sortOrder: 0,
  });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories/all');
      setCategories(data.data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setForm({ name: '', emoji: '🍽️', tagline: '', sortOrder: categories.length + 1 });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setForm({
      name: cat.name,
      emoji: cat.emoji || '🍽️',
      tagline: cat.tagline || '',
      sortOrder: cat.sortOrder || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await api.put(`/categories/${editingCat._id}`, form);
        toast.success('Category updated!');
      } else {
        await api.post('/categories', form);
        toast.success('Category added!');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <AdminLayout title="Category Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: 0, fontFamily: 'Poppins, sans-serif' }}>
          Menu Categories ({categories.length})
        </h2>
        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Emoji</th>
              <th>Category Name</th>
              <th>Tagline</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td style={{ fontSize: '1.5rem' }}>{cat.emoji}</td>
                <td style={{ fontWeight: 700, color: '#fff' }}>{cat.name}</td>
                <td style={{ color: '#A8A8A8' }}>{cat.tagline || '—'}</td>
                <td>{cat.sortOrder}</td>
                <td>
                  <span className={`badge ${cat.isActive ? 'badge-new' : 'badge-spicy'}`}>
                    {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td>
                  <button onClick={() => openEditModal(cat)} className="btn-ghost" style={{ padding: 6 }}>
                    <Edit2 size={16} color="#E7A83B" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: 20 }}>
              {editingCat ? 'Edit Category' : 'Add Category'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
                <div>
                  <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>EMOJI</label>
                  <input className="input-dark" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} required />
                </div>
                <div>
                  <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>NAME</label>
                  <input className="input-dark" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>

              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>TAGLINE</label>
                <input className="input-dark" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="e.g. Crispy & Loaded" />
              </div>

              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>SORT ORDER</label>
                <input type="number" className="input-dark" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Category
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
