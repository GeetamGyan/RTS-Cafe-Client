import { useState, useEffect } from 'react';
import { Award, Star, Gift, Clock, CheckCircle2, AlertCircle, Copy, ArrowRight, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import KitchenStatusTicker from '../components/KitchenStatusTicker';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Rewards() {
  const [loyaltyData, setLoyaltyData] = useState({ pointsBalance: 0, lifetimePoints: 0 });
  const [rewards, setRewards] = useState([]);
  const [history, setHistory] = useState([]);
  const [myRedemptions, setMyRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'vouchers' | 'history'
  const [redeemingId, setRedeemingId] = useState(null);
  const [unlockedVoucher, setUnlockedVoucher] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loyaltyRes, rewardsRes, historyRes, redemptionsRes] = await Promise.all([
        api.get('/loyalty'),
        api.get('/loyalty/rewards'),
        api.get('/loyalty/history'),
        api.get('/loyalty/redemptions'),
      ]);
      setLoyaltyData(loyaltyRes.data.data);
      setRewards(rewardsRes.data.data);
      setHistory(historyRes.data.data);
      setMyRedemptions(redemptionsRes.data.data);
    } catch {
      toast.error('Failed to load rewards data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRedeem = async (reward) => {
    if (loyaltyData.pointsBalance < reward.pointsRequired) {
      return toast.error(`You need ${reward.pointsRequired - loyaltyData.pointsBalance} more points!`);
    }

    setRedeemingId(reward._id);
    try {
      const { data } = await api.post(`/loyalty/rewards/${reward._id}/redeem`);
      toast.success('Reward Unlocked! 🎉');
      setUnlockedVoucher(data.data.redemption);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Redemption failed');
    } finally {
      setRedeemingId(null);
    }
  };

  // Find next closest reward user hasn't reached yet
  const nextReward = rewards.find(r => r.pointsRequired > loyaltyData.pointsBalance) || rewards[rewards.length - 1];
  const progressPercent = nextReward
    ? Math.min(100, Math.round((loyaltyData.pointsBalance / nextReward.pointsRequired) * 100))
    : 100;

  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <KitchenStatusTicker />

      <main style={{ flex: 1, maxWidth: 1000, margin: '0 auto', padding: '36px 20px', width: '100%' }}>
        {/* ===== HERO BALANCE CARD ===== */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2215 100%)',
            border: '1px solid rgba(231,168,59,0.3)',
            borderRadius: 24,
            padding: '32px 28px',
            marginBottom: 32,
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#E7A83B', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
                <Gift size={16} /> MY RTS REWARDS
              </div>
              <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Poppins, sans-serif', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                ⭐ {loyaltyData.pointsBalance}
                <span style={{ fontSize: '1rem', color: '#A8A8A8', fontWeight: 500 }}>Points Balance</span>
              </h1>
              <p style={{ color: '#888', fontSize: '0.85rem', margin: '6px 0 0' }}>
                Lifetime Earned: <strong style={{ color: '#E7A83B' }}>{loyaltyData.lifetimePoints} points</strong>
              </p>
            </div>

            {/* Progress to next reward */}
            {nextReward && loyaltyData.pointsBalance < nextReward.pointsRequired && (
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 20px', minWidth: 260 }}>
                <div style={{ color: '#A8A8A8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                  NEXT REWARD PROGRESS
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>
                  {nextReward.name} ({nextReward.pointsRequired} pts)
                </div>
                <div style={{ background: '#333', borderRadius: 100, height: 10, overflow: 'hidden', marginBottom: 8 }}>
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #E7A83B, #F28C28)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <div style={{ color: '#E7A83B', fontSize: '0.78rem', fontWeight: 600 }}>
                  {nextReward.pointsRequired - loyaltyData.pointsBalance} more points to unlock!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== NAVIGATION TABS ===== */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
          {[
            { id: 'catalog', label: '🎁 Redeem Rewards' },
            { id: 'vouchers', label: `🎟️ My Vouchers (${myRedemptions.filter(r => r.status === 'ACTIVE').length})` },
            { id: 'history', label: '📜 Point History' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                border: 'none',
                background: activeTab === t.id ? '#E7A83B' : 'rgba(255,255,255,0.05)',
                color: activeTab === t.id ? '#151515' : '#ccc',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== TAB 1: CATALOG ===== */}
        {activeTab === 'catalog' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>Monthly Reward Menu</h2>
              <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: 0 }}>
                Redeem your points for free food vouchers. Show voucher code at RTS Cafe!
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading rewards...</div>
            ) : rewards.length === 0 ? (
              <div style={{ background: '#1e1e1e', borderRadius: 16, padding: 32, textAlign: 'center', color: '#aaa' }}>
                No active rewards currently configured. Check back soon!
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {rewards.map(r => {
                  const canAfford = loyaltyData.pointsBalance >= r.pointsRequired;
                  return (
                    <div
                      key={r._id}
                      style={{
                        background: '#1e1e1e',
                        border: `1.5px solid ${canAfford ? 'rgba(231,168,59,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: 20,
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between',
                        transition: 'all 0.2s',
                        boxShadow: canAfford ? '0 4px 20px rgba(231,168,59,0.1)' : 'none',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <span style={{ fontSize: '2rem' }}>{r.foodId?.category?.emoji || '🍟'}</span>
                          <span
                            style={{
                              background: canAfford ? 'rgba(231,168,59,0.15)' : 'rgba(255,255,255,0.06)',
                              color: canAfford ? '#E7A83B' : '#888',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              padding: '4px 10px',
                              borderRadius: 100,
                            }}
                          >
                            ⭐ {r.pointsRequired} Points
                          </span>
                        </div>

                        <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px' }}>{r.name}</h3>
                        <p style={{ color: '#A8A8A8', fontSize: '0.82rem', lineHeight: 1.5, margin: '0 0 16px' }}>
                          {r.description || `Get 1 free ${r.foodId?.name || 'food item'} when you redeem.`}
                        </p>
                      </div>

                      <div>
                        <button
                          onClick={() => handleRedeem(r)}
                          disabled={!canAfford || redeemingId === r._id}
                          className="btn-primary"
                          style={{
                            width: '100%',
                            justify: 'center',
                            opacity: canAfford ? 1 : 0.4,
                            cursor: canAfford ? 'pointer' : 'not-allowed',
                            padding: '12px',
                            fontSize: '0.9rem',
                          }}
                        >
                          {redeemingId === r._id
                            ? 'Redeeming...'
                            : canAfford
                            ? 'Redeem Now'
                            : `Need ${r.pointsRequired - loyaltyData.pointsBalance} More Points`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== TAB 2: MY VOUCHERS ===== */}
        {activeTab === 'vouchers' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>My Unlocked Vouchers</h2>
              <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: 0 }}>
                Show these unique codes to RTS Cafe staff when collecting your free food.
              </p>
            </div>

            {myRedemptions.length === 0 ? (
              <div style={{ background: '#1e1e1e', borderRadius: 16, padding: 32, textAlign: 'center', color: '#aaa' }}>
                You haven't redeemed any rewards yet. Keep ordering to earn points!
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {myRedemptions.map(v => (
                  <div
                    key={v._id}
                    style={{
                      background: v.status === 'ACTIVE' ? '#1e1e1e' : '#181818',
                      border: `1.5px solid ${v.status === 'ACTIVE' ? '#22C55E' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 20,
                      padding: 20,
                      opacity: v.status === 'ACTIVE' ? 1 : 0.6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{v.rewardName}</span>
                      <span
                        style={{
                          background: v.status === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.1)',
                          color: v.status === 'ACTIVE' ? '#22C55E' : '#888',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: 100,
                        }}
                      >
                        {v.status}
                      </span>
                    </div>

                    {/* Voucher Code Box */}
                    <div
                      style={{
                        background: '#151515',
                        border: '1px dashed #E7A83B',
                        borderRadius: 12,
                        padding: '12px',
                        textAlign: 'center',
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ color: '#888', fontSize: '0.72rem', fontWeight: 600, marginBottom: 2 }}>REDEMPTION CODE</div>
                      <div style={{ color: '#E7A83B', fontSize: '1.3rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '2px' }}>
                        {v.code}
                      </div>
                    </div>

                    <div style={{ color: '#888', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Redeemed: {new Date(v.createdAt).toLocaleDateString()}</span>
                      <span>Spent: ⭐ {v.pointsSpent}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== TAB 3: POINT HISTORY ===== */}
        {activeTab === 'history' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>Points History Audit Log</h2>
              <p style={{ color: '#A8A8A8', fontSize: '0.85rem', margin: 0 }}>
                Every point earned, redeemed, or reversed is tracked here.
              </p>
            </div>

            {history.length === 0 ? (
              <div style={{ background: '#1e1e1e', borderRadius: 16, padding: 32, textAlign: 'center', color: '#aaa' }}>
                No transaction history found yet.
              </div>
            ) : (
              <div style={{ background: '#1e1e1e', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                {history.map((h, i) => {
                  const isEarn = h.type === 'EARN';
                  const isReversal = h.type === 'REVERSAL';
                  return (
                    <div
                      key={h._id}
                      style={{
                        padding: '16px 20px',
                        borderBottom: i < history.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{h.description}</div>
                        <div style={{ color: '#777', fontSize: '0.78rem' }}>
                          {new Date(h.createdAt).toLocaleDateString()} at {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div
                        style={{
                          fontWeight: 900,
                          fontSize: '1.1rem',
                          fontFamily: 'Poppins, sans-serif',
                          color: isEarn ? '#22C55E' : isReversal ? '#EF4444' : '#F97316',
                        }}
                      >
                        {isEarn ? `+${h.points}` : `${h.points}`} ⭐
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===== UNLOCKED CODE MODAL ===== */}
      {unlockedVoucher && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: '#1e1e1e',
              border: '2px solid #E7A83B',
              borderRadius: 24,
              padding: 32,
              maxWidth: 420,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎁</div>
            <h2 style={{ color: '#fff', fontWeight: 900, margin: '0 0 6px' }}>Reward Unlocked!</h2>
            <p style={{ color: '#E7A83B', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 20px' }}>
              {unlockedVoucher.rewardName}
            </p>

            <div
              style={{
                background: '#151515',
                border: '2px dashed #E7A83B',
                borderRadius: 16,
                padding: '20px',
                marginBottom: 20,
              }}
            >
              <div style={{ color: '#A8A8A8', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                YOUR REDEMPTION CODE
              </div>
              <div style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '3px' }}>
                {unlockedVoucher.code}
              </div>
            </div>

            <p style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: 24, lineHeight: 1.5 }}>
              Show this code at the RTS Cafe counter to claim your free food item. Valid for 30 days.
            </p>

            <button
              onClick={() => {
                setUnlockedVoucher(null);
                setActiveTab('vouchers');
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Got it! View My Vouchers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
