import { useState, useEffect } from 'react';
import api from '../services/api';

export default function KitchenStatusTicker() {
  const [statusInfo, setStatusInfo] = useState({
    kitchenStatus: 'OPEN',
    message: '🟢 KITCHEN IS OPEN — ORDER NOW!',
  });

  const fetchKitchenStatus = async () => {
    try {
      const { data } = await api.get('/kitchen/status');
      if (data?.data) {
        setStatusInfo(data.data);
      }
    } catch {
      /* fallback default */
    }
  };

  useEffect(() => {
    fetchKitchenStatus();
    // Poll status periodically (every 15s) for live updates
    const interval = setInterval(fetchKitchenStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const isOpen = statusInfo.kitchenStatus === 'OPEN';
  const tickerText = statusInfo.message || (isOpen ? '🟢 KITCHEN IS OPEN — ORDER NOW!' : '🔴 KITCHEN IS CLOSED — ORDERS ARE CURRENTLY UNAVAILABLE.');

  return (
    <div
      style={{
        background: isOpen
          ? 'linear-gradient(90deg, #064E3B, #047857, #064E3B)'
          : 'linear-gradient(90deg, #7F1D1D, #B91C1C, #7F1D1D)',
        color: '#FFFFFF',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        boxShadow: isOpen ? '0 2px 10px rgba(16,185,129,0.2)' : '0 2px 10px rgba(239,68,68,0.2)',
        borderBottom: `2px solid ${isOpen ? '#10B981' : '#EF4444'}`,
        position: 'relative',
        zIndex: 40,
        height: 38,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="ticker-container"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          animation: 'tickerMarquee 20s linear infinite',
          willChange: 'transform',
        }}
      >
        {/* Duplicate text 4 times for a seamless continuous loop */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              paddingRight: 40,
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.5px',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <span
              style={{
                background: isOpen ? '#10B981' : '#EF4444',
                color: '#151515',
                padding: '2px 8px',
                borderRadius: 100,
                fontSize: '0.72rem',
                fontWeight: 900,
              }}
            >
              {isOpen ? '🟢 KITCHEN IS OPEN' : '🔴 KITCHEN IS CLOSED'}
            </span>
            <span>{tickerText}</span>
            <span style={{ opacity: 0.5, fontSize: '0.9rem' }}>•</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes tickerMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-container:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
