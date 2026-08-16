import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    foodType: 'veg',
    preparationTime: 10,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    image: '',
  });

  const fetchFoods = async () => {
    try {
      const [foodsRes, catsRes] = await Promise.all([
        api.get('/foods/admin/all'),
        api.get('/categories/all'),
      ]);
      setFoods(foodsRes.data.data);
      setCategories(catsRes.data.data);
    } catch (err) {
      toast.error('Failed to load food menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const openAddModal = () => {
    setEditingFood(null);
    setForm({
      name: '',
      description: '',
      category: categories[0]?._id || '',
      price: '',
      foodType: 'veg',
      preparationTime: 10,
      isAvailable: true,
      isFeatured: false,
      badge: '',
      image: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setForm({
      name: food.name,
      description: food.description || '',
      category: food.category?._id || food.category,
      price: food.price,
      foodType: food.foodType || 'veg',
      preparationTime: food.preparationTime || 10,
      isAvailable: food.isAvailable,
      isFeatured: food.isFeatured || false,
      badge: food.badge || '',
      image: food.image || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await api.put(`/foods/${editingFood._id}`, form);
        toast.success('Food item updated!');
      } else {
        await api.post('/foods', form);
        toast.success('Food item added!');
      }
      setModalOpen(false);
      fetchFoods();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const toggleAvailability = async (food) => {
    try {
      await api.put(`/foods/${food._id}`, { isAvailable: !food.isAvailable });
      toast.success(`${food.name} is now ${!food.isAvailable ? 'Available' : 'Unavailable'}`);
      fetchFoods();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Food Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={16} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="input-dark"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search foods..."
            style={{ paddingLeft: 40 }}
          />
        </div>

        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} /> Add Food Item
        </button>
      </div>

      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFoods.map(food => (
              <tr key={food._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', overflow: 'hidden' }}>
                      {food.image ? <img src={food.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : food.category?.emoji || '🍽️'}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700 }}>{food.name}</div>
                      {food.badge && <span className={`badge badge-${food.badge.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>{food.badge}</span>}
                    </div>
                  </div>
                </td>
                <td>{food.category?.name || 'Uncategorized'}</td>
                <td style={{ fontWeight: 800, color: '#E7A83B' }}>₹{food.price}</td>
                <td>
                  <span style={{ color: food.foodType === 'veg' ? '#22C55E' : '#EF4444', fontWeight: 600, fontSize: '0.8rem' }}>
                    {food.foodType?.toUpperCase()}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleAvailability(food)}
                    style={{
                      background: food.isAvailable ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: food.isAvailable ? '#22C55E' : '#EF4444',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: 100,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {food.isAvailable ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEditModal(food)} className="btn-ghost" style={{ padding: 6 }}>
                      <Edit2 size={16} color="#E7A83B" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: 20 }}>
              {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>FOOD NAME</label>
                <input className="input-dark" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>CATEGORY</label>
                  <select className="input-dark" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>PRICE (₹)</label>
                  <input type="number" className="input-dark" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
              </div>

              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>DESCRIPTION</label>
                <textarea className="input-dark" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>FOOD TYPE</label>
                  <select className="input-dark" value={form.foodType} onChange={e => setForm({ ...form, foodType: e.target.value })}>
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>BADGE</label>
                  <select className="input-dark" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}>
                    <option value="">None</option>
                    <option value="POPULAR">POPULAR</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="NEW">NEW</option>
                    <option value="SPICY">SPICY</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                  Feature on Homepage
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Item
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
