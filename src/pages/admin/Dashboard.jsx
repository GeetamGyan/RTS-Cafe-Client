import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, Clock, ChefHat, CheckCircle, Users, ArrowUpRight } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [analyticsRes, ordersRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/orders'),
        ]);
        setStats(analyticsRes.data.data);
        setRecentOrders(ordersRes.data.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#E7A83B', borderRadius: '50%', margin: '0 auto' }} className="animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: "Today's Orders", val: stats?.todayOrders || 0, icon: ShoppingBag, color: '#E7A83B' },
    { label: "Today's Revenue", val: `₹${stats?.todayRevenue || 0}`, icon: DollarSign, color: '#22C55E' },
    { label: 'Pending Confirmation', val: stats?.pendingOrders || 0, icon: Clock, color: '#3B82F6' },
    { label: 'Currently Preparing', val: stats?.preparingOrders || 0, icon: ChefHat, color: '#F28C28' },
    { label: 'Ready for Pickup', val: stats?.readyOrders || 0, icon: CheckCircle, color: '#10B981' },
    { label: 'Active Users', val: stats?.totalUsers || 0, icon: Users, color: '#A855F7' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600 }}>{c.label}</span>
                <div style={{ background: `${c.color}15`, padding: 8, borderRadius: 10, color: c.color }}>
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Poppins, sans-serif' }}>
                {c.val}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Recent Orders */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: 0, fontFamily: 'Poppins, sans-serif' }}>
              Recent Orders
            </h2>
            <Link to="/admin/orders" style={{ color: '#E7A83B', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id}>
                  <td style={{ fontWeight: 700, color: '#E7A83B' }}>{order.orderNumber}</td>
                  <td>{order.user?.name || 'Student'}</td>
                  <td style={{ fontWeight: 700 }}>₹{order.totalAmount}</td>
                  <td>
                    <span className={`badge status-${order.orderStatus}`}>
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <Link to="/admin/orders" className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popular Foods */}
        <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
          <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 20px', fontFamily: 'Poppins, sans-serif' }}>
            Top Ordered Items
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stats?.popularFoods?.map((food, i) => (
              <div key={food._id} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(231,168,59,0.1)', color: '#E7A83B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                  #{i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {food.name}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.75rem' }}>{food.orderCount || 0} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){div[style*="grid-template-columns: 2fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </AdminLayout>
  );
}
