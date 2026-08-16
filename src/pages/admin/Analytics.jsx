import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics')
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Sales & Order Analytics">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#E7A83B', borderRadius: '50%', margin: '0 auto' }} className="animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const maxRevenue = Math.max(...(data?.weeklyData?.map(d => d.revenue) || [1000]), 1000);

  return (
    <AdminLayout title="Sales & Order Analytics">
      {/* Top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div className="stat-card">
          <div style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>Total Revenue (Today)</div>
          <div style={{ color: '#22C55E', fontSize: '2rem', fontWeight: 900, fontFamily: 'Poppins, sans-serif' }}>
            ₹{data?.todayRevenue || 0}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>Total Completed Orders</div>
          <div style={{ color: '#E7A83B', fontSize: '2rem', fontWeight: 900, fontFamily: 'Poppins, sans-serif' }}>
            {data?.completedOrders || 0}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>Active Registered Students</div>
          <div style={{ color: '#3B82F6', fontSize: '2rem', fontWeight: 900, fontFamily: 'Poppins, sans-serif' }}>
            {data?.totalUsers || 0}
          </div>
        </div>
      </div>

      {/* Weekly Revenue Bar Chart */}
      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px', fontFamily: 'Poppins, sans-serif' }}>
              7-Day Revenue Trend
            </h2>
            <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: 0 }}>Daily revenue breakdown across the week</p>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', padding: '6px 12px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={14} /> Peak Lunch Rush Active
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', height: 220, gap: 16, paddingTop: 20 }}>
          {data?.weeklyData ? data.weeklyData.map((item, i) => {
            const heightPercent = Math.max(10, (item.revenue / maxRevenue) * 100);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ color: '#E7A83B', fontSize: '0.75rem', fontWeight: 700, marginBottom: 6 }}>
                  ₹{item.revenue}
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 40,
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(180deg, #E7A83B, #F28C28)',
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.3s'
                  }}
                />
                <div style={{ color: '#A8A8A8', fontSize: '0.75rem', marginTop: 10, fontWeight: 600 }}>
                  {item.date}
                </div>
              </div>
            );
          }) : null}
        </div>
      </div>

      {/* Most Popular Food Items */}
      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>
        <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: 20, fontFamily: 'Poppins, sans-serif' }}>
          Best Selling Foods Overall
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {data?.popularFoods?.map((food, i) => (
            <div key={food._id} style={{ background: '#2a2a2a', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(231,168,59,0.1)', color: '#E7A83B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>
                #{i + 1}
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{food.name}</div>
                <div style={{ color: '#E7A83B', fontWeight: 800, fontSize: '0.85rem' }}>{food.orderCount || 0} Total Orders</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
