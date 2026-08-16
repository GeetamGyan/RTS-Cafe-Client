import { useState, useEffect } from 'react';
import { Gift, Power, Plus, Trash2, CheckCircle2, Clock, Settings, Save, Search, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminRewards() {
  const [kitchenStatus, setKitchenStatus] = useState({ kitchenStatus: 'OPEN', message: '' });
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loyaltySettings, setLoyaltySettings] = useState({ pointsRatio: 10, loyaltyEnabled: true });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // New reward form state
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [rewardForm, setRewardForm] = useState({
    name: '',
    foodId: '',
    pointsRequired: 100,
    monthlyLimit: 1,
    isActive: true,
    description: '',
  });

  const fetchData = async () => {
    try {
      const [kRes, rRes, redRes, fRes, sRes] = await Promise.all([
        api.get('/kitchen/status'),
        api.get('/admin/rewards'),
        api.get('/admin/redemptions'),
        api.get('/foods'),
        api.get('/admin/loyalty/settings'),
      ]);
      setKitchenStatus(kRes.data.data);
      setRewards(rRes.data.data);
      setRedemptions(redRes.data.data);
      setFoods(fRes.data.data);
      setLoyaltySettings(sRes.data.data);
    } catch {
      toast.error('Failed to load admin rewards data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Kitchen Toggle
  const handleToggleKitchen = async (newStatus) => {
    try {
      const { data } = await api.put('/kitchen/status', { kitchenStatus: newStatus });
      setKitchenStatus(data.data);
      toast.success(`Kitchen status changed to ${newStatus}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update kitchen status');
    }
  };

  const handleUpdateMessage = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/kitchen/status', { message: kitchenStatus.message });
      setKitchenStatus(data.data);
      toast.success('Announcement message updated!');
    } catch {
      toast.error('Failed to update message');
    }
  };

  // Handle Reward Save
  const handleSaveReward = async (e) => {
    e.preventDefault();
    try {
      if (editingReward) {
        await api.put(`/admin/rewards/${editingReward._id}`, rewardForm);
        toast.success('Reward updated!');
      } else {
        await api.post('/admin/rewards', rewardForm);
        toast.success('Reward created!');
      }
      setShowRewardModal(false);
      setEditingReward(null);
      setRewardForm({ name: '', foodId: '', pointsRequired: 100, monthlyLimit: 1, isActive: true, description: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save reward');
    }
  };

  const handleDeleteReward = async (id) => {
    if (!window.confirm('Delete this reward?')) return;
    try {
      await api.delete(`/admin/rewards/${id}`);
      toast.success('Reward deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete reward');
    }
  };

  // Mark Redemption as USED
  const handleMarkUsed = async (id) => {
    try {
      await api.put(`/admin/redemptions/${id}/use`);
      toast.success('Voucher marked as USED!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update voucher');
    }
  };

  // Handle Loyalty Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/loyalty/settings', loyaltySettings);
      toast.success('Loyalty settings saved!');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const filteredRedemptions = redemptions.filter(
    (r) =>
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rewardName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Kitchen Status & Loyalty Rewards">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* ===== SECTION 1: KITCHEN CONTROL CARD ===== */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px', fontFamily: 'Poppins, sans-serif' }}>
                Kitchen Operating Status
              </h2>
              <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: 0 }}>
                Control whether RTS Cafe is accepting orders & payments right now.
              </p>
            </div>

            {/* Status Switch Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: '#151515',
                border: `1.5px solid ${kitchenStatus.kitchenStatus === 'OPEN' ? '#10B981' : '#EF4444'}`,
                borderRadius: 16,
                padding: '12px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: kitchenStatus.kitchenStatus === 'OPEN' ? '#10B981' : '#EF4444',
                    boxShadow: `0 0 10px ${kitchenStatus.kitchenStatus === 'OPEN' ? '#10B981' : '#EF4444'}`,
                  }}
                />
                <span
                  style={{
                    color: kitchenStatus.kitchenStatus === 'OPEN' ? '#10B981' : '#EF4444',
                    fontWeight: 900,
                    fontSize: '1rem',
                  }}
                >
                  Kitchen is {kitchenStatus.kitchenStatus}
                </span>
              </div>

              {kitchenStatus.kitchenStatus === 'OPEN' ? (
                <button
                  onClick={() => handleToggleKitchen('CLOSED')}
                  className="btn-primary"
                  style={{ background: '#EF4444', color: '#fff', padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Turn Kitchen OFF
                </button>
              ) : (
                <button
                  onClick={() => handleToggleKitchen('OPEN')}
                  className="btn-primary"
                  style={{ background: '#10B981', color: '#fff', padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Turn Kitchen ON
                </button>
              )}
            </div>
          </div>

          {/* Edit Ticker Announcement Form */}
          <form onSubmit={handleUpdateMessage} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              className="input-dark"
              style={{ flex: 1 }}
              placeholder="Announcement Message (e.g. 🟢 KITCHEN IS OPEN — ORDER NOW!)"
              value={kitchenStatus.message || ''}
              onChange={(e) => setKitchenStatus({ ...kitchenStatus, message: e.target.value })}
            />
            <button type="submit" className="btn-secondary" style={{ flexShrink: 0, padding: '10px 16px' }}>
              <Save size={16} /> Save Message
            </button>
          </form>
        </div>

        {/* ===== SECTION 2: REWARD CATALOG MANAGEMENT ===== */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px', fontFamily: 'Poppins, sans-serif' }}>
                Loyalty Reward Catalog
              </h2>
              <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: 0 }}>Configure redeemable food items and point costs.</p>
            </div>
            <button
              onClick={() => {
                setEditingReward(null);
                setRewardForm({ name: '', foodId: foods[0]?._id || '', pointsRequired: 100, monthlyLimit: 1, isActive: true, description: '' });
                setShowRewardModal(true);
              }}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add New Reward
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', color: '#888', fontSize: '0.78rem' }}>
                  <th style={{ padding: '12px 16px' }}>REWARD NAME</th>
                  <th style={{ padding: '12px 16px' }}>FOOD ITEM</th>
                  <th style={{ padding: '12px 16px' }}>POINTS</th>
                  <th style={{ padding: '12px 16px' }}>MONTHLY LIMIT</th>
                  <th style={{ padding: '12px 16px' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((r) => (
                  <tr key={r._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '16px', color: '#fff', fontWeight: 700 }}>{r.name}</td>
                    <td style={{ padding: '16px' }}>{r.foodId?.name || 'Unlinked'}</td>
                    <td style={{ padding: '16px', color: '#E7A83B', fontWeight: 800 }}>⭐ {r.pointsRequired}</td>
                    <td style={{ padding: '16px' }}>{r.monthlyLimit} per month</td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          background: r.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          color: r.isActive ? '#22C55E' : '#EF4444',
                          padding: '3px 8px',
                          borderRadius: 100,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {r.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setEditingReward(r);
                          setRewardForm({
                            name: r.name,
                            foodId: r.foodId?._id || r.foodId || '',
                            pointsRequired: r.pointsRequired,
                            monthlyLimit: r.monthlyLimit,
                            isActive: r.isActive,
                            description: r.description || '',
                          });
                          setShowRewardModal(true);
                        }}
                        className="btn-ghost"
                        style={{ padding: '6px 12px', marginRight: 8 }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteReward(r._id)} className="btn-ghost" style={{ padding: 6, color: '#EF4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== SECTION 3: REDEMPTION VERIFICATION ===== */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px', fontFamily: 'Poppins, sans-serif' }}>
                Customer Redemptions & Code Verification
              </h2>
              <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: 0 }}>Verify voucher codes presented by students at counter.</p>
            </div>

            <div style={{ position: 'relative', width: 280 }}>
              <input
                className="input-dark"
                placeholder="Search Code or Student Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
              <Search size={16} color="#888" style={{ position: 'absolute', left: 12, top: 12 }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', color: '#888', fontSize: '0.78rem' }}>
                  <th style={{ padding: '12px 16px' }}>VOUCHER CODE</th>
                  <th style={{ padding: '12px 16px' }}>STUDENT</th>
                  <th style={{ padding: '12px 16px' }}>REWARD</th>
                  <th style={{ padding: '12px 16px' }}>DATE</th>
                  <th style={{ padding: '12px 16px' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredRedemptions.map((red) => (
                  <tr key={red._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 900, color: '#E7A83B', fontSize: '1rem' }}>
                      {red.code}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{red.userId?.name || 'User'}</div>
                      <div style={{ color: '#777', fontSize: '0.75rem' }}>{red.userId?.studentId || red.userId?.email}</div>
                    </td>
                    <td style={{ padding: '16px', color: '#fff' }}>{red.rewardName}</td>
                    <td style={{ padding: '16px', color: '#888', fontSize: '0.8rem' }}>
                      {new Date(red.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          background: red.status === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)',
                          color: red.status === 'ACTIVE' ? '#22C55E' : '#888',
                          padding: '3px 8px',
                          borderRadius: 100,
                          fontSize: '0.75rem',
                          fontWeight: 800,
                        }}
                      >
                        {red.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      {red.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleMarkUsed(red._id)}
                          className="btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        >
                          Mark as Used
                        </button>
                      ) : (
                        <span style={{ color: '#666', fontSize: '0.8rem' }}>Used {red.usedAt ? new Date(red.usedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== SECTION 4: LOYALTY SETTINGS ===== */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: 16, fontFamily: 'Poppins, sans-serif' }}>
            Loyalty Program Rules & Settings
          </h2>
          <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                POINTS RATIO (₹ Spent per 1 Point)
              </label>
              <input
                type="number"
                className="input-dark"
                value={loyaltySettings.pointsRatio}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, pointsRatio: Number(e.target.value) })}
                required
              />
              <div style={{ color: '#777', fontSize: '0.75rem', marginTop: 4 }}>
                Example: 10 means ₹100 order = 10 points earned.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
              <input
                type="checkbox"
                id="loyaltyEnabled"
                checked={loyaltySettings.loyaltyEnabled}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, loyaltyEnabled: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: '#E7A83B' }}
              />
              <label htmlFor="loyaltyEnabled" style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                Enable Loyalty Rewards Program across RTS Cafe
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', justifyContent: 'center', marginTop: 12 }}>
              <Save size={18} /> Save Loyalty Program Settings
            </button>
          </form>
        </div>
      </div>

      {/* ===== REWARD MODAL ===== */}
      {showRewardModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 28, maxWidth: 500, width: '100%' }}>
            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: 20 }}>
              {editingReward ? 'Edit Reward' : 'Create New Reward'}
            </h2>
            <form onSubmit={handleSaveReward} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>REWARD DISPLAY NAME</label>
                <input
                  className="input-dark"
                  placeholder="e.g. Free Classic Fries"
                  value={rewardForm.name}
                  onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>ASSOCIATED FOOD ITEM</label>
                <select
                  className="input-dark"
                  value={rewardForm.foodId}
                  onChange={(e) => setRewardForm({ ...rewardForm, foodId: e.target.value })}
                  required
                >
                  <option value="">-- Select Food Item --</option>
                  {foods.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} (₹{f.price})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>POINTS REQUIRED</label>
                  <input
                    type="number"
                    className="input-dark"
                    value={rewardForm.pointsRequired}
                    onChange={(e) => setRewardForm({ ...rewardForm, pointsRequired: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>MONTHLY LIMIT PER USER</label>
                  <input
                    type="number"
                    className="input-dark"
                    value={rewardForm.monthlyLimit}
                    onChange={(e) => setRewardForm({ ...rewardForm, monthlyLimit: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ color: '#A8A8A8', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>DESCRIPTION</label>
                <textarea
                  className="input-dark"
                  rows={2}
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Reward
                </button>
                <button
                  type="button"
                  onClick={() => setShowRewardModal(false)}
                  className="btn-ghost"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
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
