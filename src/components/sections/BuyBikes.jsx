import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BikePurchaseModal from '../BikePurchaseModal';

export default function BuyBikes() {
  const categories = ['All', 'Commuter', 'Sports', 'Premium'];
  const [allBikes, setAllBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [animateStrip, setAnimateStrip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://backend.yaytech.in/api/bike-models/')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          const structuredBikes = resData.data
            .filter((bike) => !bike.isDeleted)
            .map((bike) => {
              const nameClean = bike.name?.trim() || '';
              const cc = bike.engineCapacity || 0;
              
              let determinedCategory = 'Commuter';
              if (cc > 150 || nameClean.includes('XTREME')) {
                determinedCategory = 'Sports';
              } else if (cc > 125) {
                determinedCategory = 'Premium';
              }

              return {
                id: bike.id,
                name: nameClean,
                brand: bike.brand?.trim() || 'Hero',
                category: determinedCategory,
                price: `₹${bike.exShowroomPrice?.toLocaleString('en-IN')}`,
                rawPrice: bike.exShowroomPrice,
                img: bike.imageUrl.startsWith('http') 
                  ? bike.imageUrl 
                  : `https://backend.yaytech.in${bike.imageUrl}`,
                fuel: `${bike.mileage || '60'} kmpl`,
                engine: `${cc}cc`,
                tag: bike.launchYear >= 2026 ? '2026 Fleet' : bike.mileage >= 65 ? 'Top Mileage' : ''
              };
            });
          setAllBikes(structuredBikes);
        }
      })
      .catch((err) => console.error('Error fetching catalog bikes:', err))
      .finally(() => {
        setLoading(false);
        setTimeout(() => setAnimateStrip(true), 50);
      });
  }, []);

  const handleActionClick = (bike) => {
    setSelectedBike(bike);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBike(null);
  };

  let filtered = allBikes.filter(
    (b) => activeCategory === 'All' || b.category.toLowerCase() === activeCategory.toLowerCase()
  );

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.rawPrice - b.rawPrice);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.rawPrice - a.rawPrice);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; overflow-x: hidden; }
        
        /* Keyframe Animations */
        @keyframes cubicFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatDynamics {
          0%, 100% { transform: translateY(0px) scale(1.05); }
          50% { transform: translateY(-12px) scale(1.1); }
        }

        .animate-hero-text { animation: cubicFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .hero-floating-bike { animation: floatDynamics 5s ease-in-out infinite; }
        
        /* Smooth Horizontal Scrolling Configurations */
        .horizontal-scroll-container {
          display: flex;
          gap: 28px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 20px 4px 40px 4px;
          webkit-overflow-scrolling: touch;
        }
        
        /* Hide scrollbars completely while maintaining operational touch/drag scroll */
        .horizontal-scroll-container::-webkit-scrollbar { display: none; }
        .horizontal-scroll-container { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Premium Card Structural Hover Triggers */
        .bike-card { 
          flex: 0 0 340px; /* Locks dynamic width inside the horizontal scroll row */
          background: #ffffff;
          border: 1px solid #e2e8f0;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .bike-card:hover { 
          transform: translateY(-6px); 
          border-color: #ef4444 !important;
          box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
        }
        .bike-card:hover .bike-img { transform: scale(1.06) rotate(-1deg); }
        .bike-img { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        
        .cat-btn { transition: all 0.2s ease; }
        .cat-btn:hover { background: #0f172a !important; color: #fff !important; transform: translateY(-1px); }
        
        .enquire-btn { 
          background: #ef4444;
          transition: all 0.25s ease; 
        }
        .enquire-btn:hover { 
          background: #dc2626 !important;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
        }

        @media (max-width: 640px) {
          .bike-card { flex: 0 0 290px; }
          .hero-bike-container { display: none !important; }
        }
      `}</style>

      {/* Pure White/Slate Premium Showroom Hero Section */}
      <section style={{
        position: 'relative',
        padding: 'clamp(70px, 12vw, 130px) 6vw clamp(50px, 10vw, 90px)',
        background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
        overflow: 'hidden',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="animate-hero-text" style={{ flex: '1 1 auto', maxWidth: 600 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fee2e2', padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: '#ef4444', textTransform: 'uppercase', marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%', display: 'inline-block' }} /> 
              AUTHORIZED HERO PARTNER
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 700, lineHeight: 0.98, letterSpacing: '-2.5px', color: '#0f172a', marginBottom: 20 }}>
              CHOOSE YOUR<br />
              <span style={{ color: '#ef4444' }}>NEXT HORIZON.</span>
            </h1>
            <p style={{ fontSize: 'clamp(15px, 2.2vw, 17px)', color: '#475569', fontWeight: 400, lineHeight: 1.6, maxWidth: 490 }}>
              Slide through our authorized 2026 machine catalogue. Engineered for absolute reliability and optimized performance.
            </p>
          </div>

          <div className="hero-bike-container" style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center' }}>
            <img 
              className="hero-floating-bike" 
              src="https://bikebazardelhi.com/uploads/vehicle/4545-removebg-preview.png" 
              alt="Hero Flagship" 
              style={{ width: '100%', maxWidth: '400px', objectFit: 'contain', filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.12))' }} 
            />
          </div>
        </div>
      </section>

      {/* Control Hub Navigation */}
      <section style={{ background: '#ffffff', position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid #e2e8f0', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                className="cat-btn" 
                onClick={() => setActiveCategory(cat)} 
                style={{
                  padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: activeCategory === cat ? '#0f172a' : '#f1f5f9',
                  color: activeCategory === cat ? '#ffffff' : '#475569',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <select 
            onChange={e => setSortBy(e.target.value)} 
            style={{ padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#334155', background: '#ffffff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="default">Sort Fleet Configuration</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Horizontal Carousel Section */}
      <section style={{ padding: '60px 0 80px 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Available Lineup</h2>
              <p style={{ fontSize: 13, color: '#64748b' }}>Swipe left or drag to explore fleet modifications</p>
            </div>
            {/* Elegant visual direction indicator */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>
              <span>Scroll Right</span>
              <span style={{ fontSize: 16 }}>→</span>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
              <div style={{ width: 32, height: 32, border: '2.5px solid #e2e8f0', borderTopColor: '#ef4444', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}>FETCHING APPOINTED FLEET...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div 
              className="horizontal-scroll-container"
              style={{
                opacity: animateStrip ? 1 : 0,
                transform: animateStrip ? 'translateX(0)' : 'translateX(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              {filtered.map((bike) => (
                <div 
                  key={bike.id} 
                  className="bike-card" 
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Image Presentation Bed */}
                  <div style={{ background: '#f1f5f9', padding: '30px 20px 10px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 170 }}>
                    {bike.tag && (
                      <span style={{ position: 'absolute', top: 14, left: 14, background: '#0f172a', color: '#ffffff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 5, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        {bike.tag}
                      </span>
                    )}
                    <img className="bike-img" src={bike.img} alt={bike.name} style={{ width: '100%', maxHeight: 120, objectFit: 'contain', display: 'block' }} />
                  </div>

                  {/* Specifications Content Container */}
                  <div style={{ padding: '20px 24px 24px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
                      {bike.brand} · {bike.category}
                    </div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, color: '#0f172a', marginBottom: 14, lineHeight: 1.25, height: 48, overflow: 'hidden' }}>
                      {bike.name}
                    </h3>
                    
                    {/* Metrics Pills */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                      <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Engine</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{bike.engine}</div>
                      </div>
                      <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Mileage</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{bike.fuel}</div>
                      </div>
                    </div>

                    {/* Financial Matrix */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 500 }}>EST. EX-SHOWROOM PRICE</div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                          {bike.price}
                        </div>
                      </div>
                    </div>

                    {/* CTA Primary Action */}
                    <button 
                      onClick={() => handleActionClick(bike)} 
                      className="enquire-btn" 
                      style={{ width: '100%', padding: '12px', color: '#ffffff', border: 'none', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, letterSpacing: '0.3px' }}
                    >
                      ENQUIRE NOW <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showModal && selectedBike && (
        <BikePurchaseModal bike={selectedBike} onClose={handleCloseModal} />
      )}
    </>
  );
}