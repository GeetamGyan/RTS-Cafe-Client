import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import FloatingCart from '../components/FloatingCart';
import { FoodCardSkeleton } from '../components/LoadingSkeleton';
import api from '../services/api';

export default function Menu() {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all | veg | nonveg
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, foodsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/foods'),
        ]);
        setCategories(catsRes.data.data);
        setFoods(foodsRes.data.data);
        setFiltered(foodsRes.data.data);

        // Handle URL category param
        const urlCatName = searchParams.get('name');
        if (urlCatName) {
          const cat = catsRes.data.data.find(c => c.name === urlCatName);
          if (cat) setActiveCategory(cat._id);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...foods];
    if (activeCategory !== 'all') result = result.filter(f => f.category?._id === activeCategory);
    if (filterType !== 'all') result = result.filter(f => f.foodType === filterType);
    if (search.trim()) {
      const re = new RegExp(search.trim(), 'i');
      result = result.filter(f => re.test(f.name) || re.test(f.description) || re.test(f.category?.name));
    }
    setFiltered(result);
  }, [foods, activeCategory, search, filterType]);

  // Group foods by category
  const grouped = filtered.reduce((acc, food) => {
    const catName = food.category?.name || 'Other';
    if (!acc[catName]) acc[catName] = { emoji: food.category?.emoji || '🍽️', items: [] };
    acc[catName].items.push(food);
    return acc;
  }, {});

  const noResults = !loading && filtered.length === 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Page header */}
      <div style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p className="section-tag" style={{ marginBottom: 6 }}>RTS CAFE</p>
          <h1 className="section-title" style={{ marginBottom: 24 }}>Our Menu</h1>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 520, marginBottom: 20 }}>
            <Search size={18} color="#666" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              ref={searchRef}
              className="input-dark"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for burgers, momos, coffee..."
              style={{ paddingLeft: 44, paddingRight: search ? 44 : 16 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 4 }}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none' }}>
            <button className={`cat-chip ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>
              🍽️ All
            </button>
            {categories.map(cat => (
              <button key={cat._id} className={`cat-chip ${activeCategory === cat._id ? 'active' : ''}`} onClick={() => setActiveCategory(cat._id)}>
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {/* Veg filter */}
          <div style={{ display: 'flex', gap: 8, paddingBottom: 16, alignItems: 'center' }}>
            <SlidersHorizontal size={14} color="#A8A8A8" />
            {[
              { v: 'all', label: 'All' },
              { v: 'veg', label: '🟩 Veg' },
              { v: 'nonveg', label: '🟥 Non-Veg' },
            ].map(({ v, label }) => (
              <button key={v} onClick={() => setFilterType(v)} style={{
                background: filterType === v ? (v === 'veg' ? '#22C55E' : v === 'nonveg' ? '#EF4444' : '#E7A83B') : '#2a2a2a',
                color: filterType === v ? '#fff' : '#A8A8A8',
                border: 'none', borderRadius: 100, padding: '5px 14px',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FOOD GRID ===== */}
      <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', padding: '32px 24px', width: '100%' }}>
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {Array(12).fill(0).map((_, i) => <FoodCardSkeleton key={i} />)}
          </div>
        )}

        {noResults && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🔍</div>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>No food found</h3>
            <p style={{ color: '#A8A8A8', marginBottom: 24 }}>Try searching for burgers, momos, fries or coffee.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all'); setFilterType('all'); }} className="btn-primary">View All Menu</button>
          </div>
        )}

        {!loading && !noResults && (
          search || activeCategory !== 'all' ? (
            /* Flat grid when searching */
            <div>
              <p style={{ color: '#A8A8A8', fontSize: '0.85rem', marginBottom: 20 }}>{filtered.length} item{filtered.length !== 1 ? 's' : ''} found</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                {filtered.map(food => <FoodCard key={food._id} food={food} />)}
              </div>
            </div>
          ) : (
            /* Grouped by category */
            Object.entries(grouped).map(([catName, { emoji, items }]) => (
              <section key={catName} style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
                  <span style={{ fontSize: '1.6rem' }}>{emoji}</span>
                  <div>
                    <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem', margin: 0 }}>{catName}</h2>
                    <p style={{ color: '#A8A8A8', fontSize: '0.78rem', margin: 0 }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                  {items.map(food => <FoodCard key={food._id} food={food} />)}
                </div>
              </section>
            ))
          )
        )}
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
}
