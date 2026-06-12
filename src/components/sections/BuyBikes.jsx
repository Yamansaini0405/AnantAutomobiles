import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



export default function BuyBikes() {
  const categories = ['All', 'Commuter', 'Sports', 'Premium', 'Scooter'];
  const [allBikes, setAllBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // Dynamic API Fleet Fetching
  useEffect(() => {
    fetch('https://backend.yaytech.in/api/bike-models/')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          // Normalize and map keys dynamically from API
          const structuredBikes = resData.data
            .filter((bike) => !bike.isDeleted)
            .map((bike) => ({
              id: bike.id,
              name: bike.name,
              brand: bike.brand || 'Hero',
              category: bike.category || 'Commuter',
              price: `₹${bike.exShowroomPrice?.toLocaleString('en-IN')}`,
              rawPrice: bike.exShowroomPrice,
              emi: `₹${Math.round(bike.exShowroomPrice * 0.028).toLocaleString('en-IN')}/mo`,
              img: bike.imageUrl.startsWith('http') ? bike.imageUrl : `https://backend.yaytech.in${bike.imageUrl}`,
              fuel: `${bike.mileage || '55'} kmpl`,
              engine: `${bike.engineCapacity || '110'}cc`,
              tag: bike.launchYear >= 2026 ? 'New' : bike.mileage > 70 ? 'Best Seller' : ''
            }));
          setAllBikes(structuredBikes);
        }
      })
      .catch((err) => console.error('Error fetching catalog bikes:', err))
      .finally(() => {
        setLoading(false);
        setVisible(true);
      });
  }, []);

  const handleActionClick = (bikeName) => {
    // Navigates and pushes pre-filled query param into the form
    navigate(`/?model=${encodeURIComponent(bikeName)}`);
    setTimeout(() => {
      const el = document.getElementById('book-your-dream-bike');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  let filtered = allBikes.filter(
    (b) => activeCategory === 'All' || b.category.toLowerCase().trim() === activeCategory.toLowerCase().trim()
  );

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.rawPrice - b.rawPrice);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.rawPrice - a.rawPrice);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Barlow', sans-serif; background: #f5f5f5; }
        .bike-card { transition: transform 0.28s ease, box-shadow 0.28s ease; }
        .bike-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.13) !important; }
        .bike-card:hover .bike-img { transform: scale(1.07); }
        .bike-img { transition: transform 0.4s ease; }
        .cat-btn { transition: all 0.18s ease; }
        .cat-btn:hover { background: #111 !important; color: #fff !important; border-color: #111 !important; }
        .enquire-btn { transition: all 0.22s ease; }
        .enquire-btn:hover { background: #cc0000 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(230,0,0,0.4) !important; }
        @media (max-width: 640px) {
          .bikes-grid { grid-template-columns: 1fr !important; }
          .hero-bike-img { display: none !important; }
        }
        @media (max-width: 900px) {
          .bikes-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Hero Banner */}
      <section style={{
        background: '#111',
        backgroundImage: 'url(/images/bg1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        padding: 'clamp(60px, 15vw, 120px) 5vw clamp(50px, 12vw, 80px)',
        color: '#fff',
        overflow: 'hidden',
      }} className="hero-section">
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'clamp(20px, 5vw, 60px)', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 auto', minWidth: 300 }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(10px, 2vw, 13px)', fontWeight: 700, letterSpacing: '3px', color: '#ff4d4d', textTransform: 'uppercase', marginBottom: 'clamp(12px, 3vw, 18px)' }}>
              ── AUTHORIZED HERO DEALER ──
            </div>
            <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(52px, 8vw, 96px)', fontWeight: 900, lineHeight: 0.93, letterSpacing: '-1px', marginBottom: 24 }}>
              FIND YOUR<br />
              <span style={{ color: '#FF0000' }}>PERFECT</span> RIDE
            </h1>
            <p style={{ fontSize: 'clamp(14px, 3vw, 17px)', color: 'rgba(255,255,255,0.72)', fontWeight: 500, maxWidth: 480, lineHeight: 1.65, marginBottom: 'clamp(24px, 5vw, 36px)' }}>
              Explore our full range of Hero bikes — commuters, sports, scooters & premium machines. Best prices guaranteed.
            </p>
          </div>
          <div className="hero-bike-img" style={{ flex: '1 1 auto', minWidth: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="https://bikebazardelhi.com/uploads/vehicle/4545-removebg-preview.png" alt="Glamour Bike" style={{ width: '100%', maxWidth: 'clamp(250px, 22vw, 380px)', height: 'clamp(300px, 50vh, 500px)', objectFit: 'contain', filter: 'drop-shadow(0 10px 40px rgba(255,0,0,0.3))', transform: 'scale(1.5)' }} />
          </div>
        </div>
      </section>

      {/* Filters */}
      {/* <section style={{ background: '#fff', borderBottom: '1px solid #eee', padding: 'clamp(12px, 3vw, 20px) 5vw', position: 'sticky', top: 66, zIndex: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="filters-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} className="cat-btn" onClick={() => setActiveCategory(cat)} style={{
                padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 700,
                fontFamily: "'Barlow'",
                background: activeCategory === cat ? '#111' : '#fff',
                color: activeCategory === cat ? '#fff' : '#666',
                border: activeCategory === cat ? '1.5px solid #111' : '1.5px solid #ddd',
                cursor: 'pointer',
              }}>{cat}</button>
            ))}
          </div>
          <select onChange={e => setSortBy(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid #ddd', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#444', background: '#fff', cursor: 'pointer', fontFamily: "'Barlow'" }}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </section> */}

      {/* Catalog Grid */}
      <section style={{ padding: 'clamp(40px, 8vw, 52px) 5vw clamp(60px, 12vw, 80px)', background: '#f5f5f5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: 18, color: '#666', padding: '40px 0' }}>Loading Fleet Showroom...</div>
          ) : (
            <div className="bikes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px, 3vw, 24px)' }}>
              {filtered.map((bike, i) => (
                <div key={bike.id} className="bike-card" style={{
                  background: '#fff',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                  border: '1.5px solid #eee',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`,
                }}>
                  <div style={{ background: '#f8f8f8', padding: '24px 16px', position: 'relative' }}>
                    {bike.tag && (
                      <span style={{ position: 'absolute', top: 12, left: 12, background: '#FF0000', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4 }}>
                        {bike.tag}
                      </span>
                    )}
                    <img className="bike-img" src={bike.img} alt={bike.name} style={{ width: '100%', height: 140, objectFit: 'contain', display: 'block' }} />
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#FF0000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{bike.brand} · {bike.category}</div>
                    <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: 24, fontWeight: 900, color: '#111', marginBottom: 12 }}>{bike.name}</h3>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, background: '#f5f5f5', borderRadius: 8, padding: 8 }}>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#aaa' }}>⚡ Engine</div>
                        <div style={{ fontSize: 12, fontWeight: 800 }}>{bike.engine}</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#aaa' }}>🛢 Mileage</div>
                        <div style={{ fontSize: 12, fontWeight: 800 }}>{bike.fuel}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                      <div>
                        <div style={{ fontSize: 10, color: '#aaa' }}>Ex-showroom price</div>
                        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 26, fontWeight: 900, color: '#111' }}>{bike.price}*</div>
                      </div>

                    </div>

                    <button onClick={() => handleActionClick(bike.name)} className="enquire-btn" style={{ width: '100%', padding: 12, background: '#FF0000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}>
                      Enquire Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}