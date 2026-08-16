export function FoodCardSkeleton() {
  return (
    <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '4/3' }} />
      <div style={{ padding: 14 }}>
        <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 13, width: '90%', marginBottom: 4 }} />
        <div className="skeleton" style={{ height: 13, width: '60%', marginBottom: 16 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ height: 22, width: 50 }} />
          <div className="skeleton" style={{ height: 34, width: 70, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ height: 13, width: 80, marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 32, width: 100, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: 60 }} />
    </div>
  );
}
