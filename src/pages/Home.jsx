import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, CreditCard, ChefHat, Ticket, MapPin, Clock, Star, ChevronRight, Gift } from 'lucide-react';
import Navbar from '../components/Navbar';
import KitchenStatusTicker from '../components/KitchenStatusTicker';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import FloatingCart from '../components/FloatingCart';
import { FoodCardSkeleton } from '../components/LoadingSkeleton';
import api from '../services/api';

const CATEGORIES_META = [
  { name: 'Fries', emoji: '🍟', tagline: 'Crispy & Loaded' },
  { name: 'Maggi', emoji: '🍜', tagline: 'Comfort in a Bowl' },
  { name: 'Veg Burger', emoji: '🍔', tagline: 'Fresh & Filling' },
  { name: 'Non-Veg Burger', emoji: '🍔', tagline: 'Bold & Juicy' },
  { name: 'Veg Momos', emoji: '🥟', tagline: 'Crispy Delight' },
  { name: 'Non-Veg Momos', emoji: '🥟', tagline: 'Packed Flavor' },
  { name: 'Thick Cold Coffee', emoji: '☕', tagline: 'Rich & Creamy' },
  { name: 'Mocktail', emoji: '🥤', tagline: 'Chill & Refresh' },
  { name: 'Veg Sandwich', emoji: '🥪', tagline: 'Grilled Fresh' },
  { name: 'Chocolate Shakes', emoji: '🍫', tagline: 'Pure Indulgence' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '🍔', title: 'Choose Food', desc: 'Browse the RTS Cafe menu and pick your favourites' },
  { step: '02', icon: '💳', title: 'Pay Online', desc: 'Complete your payment securely before preparation begins' },
  { step: '03', icon: '👨‍🍳', title: 'We Prepare', desc: 'Your order enters the preparation queue after payment' },
  { step: '04', icon: '🎟️', title: 'Collect', desc: 'Visit RTS Cafe when your order is ready — no waiting!' },
];

export default function Home() {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [foodsRes, catsRes, cmsRes] = await Promise.all([
          api.get('/foods?featured=true'),
          api.get('/categories'),
          api.get('/cms/announcements'),
        ]);
        setFeaturedFoods(foodsRes.data.data.slice(0, 8));
        setCategories(catsRes.data.data);
        setAnnouncements(cmsRes.data.data.slice(0, 3));
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* ===== CONTINUOUS KITCHEN STATUS TICKER ===== */}
      <KitchenStatusTicker />

      {/* ===== ANNOUNCEMENTS BAR ===== */}
      {announcements.length > 0 && (
        <div style={{ background: 'linear-gradient(90deg, #E7A83B20, #F28C2820)', borderBottom: '1px solid rgba(231,168,59,0.2)', padding: '10px 20px', textAlign: 'center' }}>
          <span style={{ color: '#E7A83B', fontSize: '0.85rem', fontWeight: 600 }}>
            📢 {announcements[0].title} — {announcements[0].message}
          </span>
        </div>
      )}

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            {/* Left: Copy */}
            <div className="animate-fade-in">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(231,168,59,0.1)', border: '1px solid rgba(231,168,59,0.25)', borderRadius: 100, padding: '6px 14px', marginBottom: 24 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                <span style={{ color: '#E7A83B', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' }}>RTS CAFE PRE-ORDERING PLATFORM</span>
              </div>

              <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', lineHeight: 1.1, margin: '0 0 20px', color: '#fff' }}>
                Skip the Queue.<br />
                <span style={{ color: '#E7A83B' }}>Your Food Is</span><br />
                Waiting.
              </h1>

              <p style={{ color: '#A8A8A8', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 440 }}>
                Pre-order your favourite food from RTS Cafe, pay online, and collect it when it's ready. Earn loyalty points on every order!
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/menu" className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                  Order Now <ArrowRight size={18} />
                </Link>
                <Link to="/rewards" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                  My Rewards ⭐
                </Link>
              </div>

              {/* Info badges */}
              <div style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap' }}>
                {[
                  { icon: '⚡', label: 'Quick Order' },
                  { icon: '💳', label: 'Pay Online' },
                  { icon: '🎟️', label: 'Skip Queue' },
                  { icon: '⭐', label: 'Earn Points' },
                ].map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{b.icon}</span>
                    <span style={{ color: '#A8A8A8', fontSize: '0.85rem', fontWeight: 500 }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Craving Food Visual Collage */}
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="animate-slide-up">
              {[
                { name: 'Burger', img: '/images/burger.png', category: 'Veg Burger' },
                { name: 'Fries', img: '/images/fries.png', category: 'Fries' },
                { name: 'Momos', img: '/images/momos.jpg', category: 'Veg Momos' },
                { name: 'Coffee', img: '/images/coffee.png', category: 'Thick Cold Coffee' },
              ].map((item, i) => (
                <div
                  key={item.name}
                  style={{
                    borderRadius: 22,
                    aspectRatio: '1',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(231,168,59,0.25)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                    transform: i % 2 === 0 ? 'translateY(-10px)' : 'translateY(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    background: '#1a1a1a',
                  }}
                  onClick={() => navigate('/menu')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `${i % 2 === 0 ? 'translateY(-14px)' : 'translateY(6px)'} scale(1.03)`;
                    e.currentTarget.style.borderColor = '#E7A83B';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(231,168,59,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = i % 2 === 0 ? 'translateY(-10px)' : 'translateY(10px)';
                    e.currentTarget.style.borderColor = 'rgba(231,168,59,0.25)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)';
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                    }}
                  />
                  {/* Subtle dark gradient overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.15) 50%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'flex-end',
                      padding: '12px 14px',
                    }}
                  >
                    <span
                      style={{
                        color: '#E7A83B',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        fontFamily: 'Poppins, sans-serif',
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive: hide right col on mobile */}
        <style>{`@media(max-width:768px){.hero-section>div>div{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ===== FEATURE CARDS ===== */}
      <section style={{ background: '#1a1a1a', padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: <Zap size={22} color="#E7A83B" />, title: 'Quick Ordering', desc: 'Order before reaching the cafe' },
            { icon: <CreditCard size={22} color="#E7A83B" />, title: 'Pay Online', desc: 'Secure digital payment' },
            { icon: <ChefHat size={22} color="#E7A83B" />, title: 'Freshly Prepared', desc: 'We start after payment' },
            { icon: <Gift size={22} color="#E7A83B" />, title: 'Loyalty Rewards', desc: 'Earn 1 point per ₹10 spent' },
          ].map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', background: '#222', borderRadius: 14, border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ background: 'rgba(231,168,59,0.1)', padding: 10, borderRadius: 10, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{f.title}</div>
                <div style={{ color: '#A8A8A8', fontSize: '0.8rem' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== REWARDS BANNER SECTION (EARN WHILE YOU EAT 🎁) ===== */}
      <section style={{ padding: '40px 24px', background: '#151515' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2215 100%)',
              border: '1px solid rgba(231,168,59,0.3)',
              borderRadius: 24,
              padding: '36px 40px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 24,
              boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
            }}
          >
            <div>
              <p style={{ color: '#E7A83B', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                EARN WHILE YOU EAT 🎁
              </p>
              <h2 style={{ fontFamily: 'Poppins, sans-serif', color: '#fff', fontWeight: 900, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', margin: '0 0 8px', lineHeight: 1.2 }}>
                Every order earns you RTS Points.
              </h2>
              <p style={{ color: '#A8A8A8', margin: 0, fontSize: '0.95rem' }}>
                Order more. Earn more. Redeem for FREE food vouchers at the end of every month!
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                <span style={{ background: 'rgba(231,168,59,0.15)', color: '#E7A83B', padding: '6px 12px', borderRadius: 100, fontSize: '0.82rem', fontWeight: 700 }}>
                  ⭐ 10 Points for every ₹100 spent
                </span>
                <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', padding: '6px 12px', borderRadius: 100, fontSize: '0.82rem', fontWeight: 700 }}>
                  🎁 Free Classic Fries @ 100 Pts
                </span>
              </div>
            </div>
            <Link
              to="/rewards"
              className="btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: '0.95rem',
                flexShrink: 0,
              }}
            >
              View Rewards Menu <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section style={{ padding: '60px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <p className="section-tag" style={{ color: '#E7A83B' }}>BROWSE BY CATEGORY</p>
            <h2 className="section-title" style={{ color: '#151515' }}>What are you craving?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 14 }}>
            {(categories.length > 0 ? categories : CATEGORIES_META).map((cat) => (
              <Link key={cat._id || cat.name} to={`/menu?category=${cat._id || ''}&name=${cat.name}`}
                style={{ textDecoration: 'none', background: '#f8f8f8', border: '1.5px solid #eee', borderRadius: 16, padding: '20px 12px', textAlign: 'center', transition: 'all 0.2s', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#E7A83B'; e.currentTarget.style.background='#FFF7E8'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#eee'; e.currentTarget.style.background='#f8f8f8'; }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{cat.emoji}</div>
                <div style={{ color: '#151515', fontWeight: 700, fontSize: '0.78rem', lineHeight: 1.3 }}>{cat.name}</div>
                <div style={{ color: '#888', fontSize: '0.7rem', marginTop: 2 }}>{cat.tagline}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MOST LOVED ===== */}
      <section style={{ padding: '60px 24px', background: '#151515' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p className="section-tag">MOST LOVED AT RTS</p>
              <h2 className="section-title">Campus Favourites</h2>
            </div>
            <Link to="/menu" style={{ color: '#E7A83B', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View All Menu <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {Array(8).fill(0).map((_, i) => <FoodCardSkeleton key={i} />)}
            </div>
          ) : featuredFoods.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {featuredFoods.map(food => <FoodCard key={food._id} food={food} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#A8A8A8' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🍽️</div>
              <p>Menu loading...</p>
              <Link to="/menu" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Browse Menu</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '80px 24px', background: '#1a1a1a' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p className="section-tag" style={{ color: '#E7A83B' }}>THE PROCESS</p>
            <h2 className="section-title" style={{ marginBottom: 12 }}>Good Food. Less Waiting.</h2>
            <p style={{ color: '#A8A8A8', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>Four simple steps to enjoy your favourite campus food without the queue.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{ textAlign: 'center', padding: '32px 24px', background: '#222', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{step.icon}</div>
                <div style={{ color: '#E7A83B', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', marginBottom: 8 }}>STEP {step.step}</div>
                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 10px' }}>{step.title}</h3>
                <p style={{ color: '#A8A8A8', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION ===== */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <p className="section-tag">VISIT US</p>
            <h2 className="section-title" style={{ color: '#151515', marginBottom: 20 }}>Find RTS Cafe</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(231,168,59,0.1)', padding: 10, borderRadius: 10, flexShrink: 0 }}>
                  <MapPin size={20} color="#E7A83B" />
                </div>
                <div>
                  <div style={{ color: '#151515', fontWeight: 700, marginBottom: 4 }}>Campus Location</div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>RTS Cafe, College Campus</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(231,168,59,0.1)', padding: 10, borderRadius: 10, flexShrink: 0 }}>
                  <Clock size={20} color="#E7A83B" />
                </div>
                <div>
                  <div style={{ color: '#151515', fontWeight: 700, marginBottom: 4 }}>Opening Hours</div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>Monday – Saturday</div>
                  <div style={{ color: '#E7A83B', fontWeight: 600, fontSize: '0.9rem' }}>9:00 AM – 6:00 PM</div>
                </div>
              </div>
            </div>
            <a href="https://maps.app.goo.gl/iFQVP8VALSy2j1UR9" target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '14px 28px' }}>
              <MapPin size={18} /> Open in Google Maps
            </a>
          </div>
          <div style={{ background: '#f5f5f5', borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #eee' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjQiTiA3M8KwNTEnMjQuMSJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              title="RTS Cafe Location"
            />
          </div>
        </div>
        <style>{`@media(max-width:768px){section:last-of-type>div{grid-template-columns:1fr!important}}`}</style>
      </section>

      <Footer />
      <FloatingCart />
    </div>
  );
}
