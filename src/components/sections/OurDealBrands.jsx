import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OurDealBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const CARD_WIDTH = 260;
  const CARD_GAP = 20;

  useEffect(() => {
    fetch('https://backend.yaytech.in/api/bike-models/')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          setBikes(resData.data.filter((bike) => !bike.isDeleted));
        }
      })
      .catch((err) => console.error('Error fetching bike models:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleScroll = () => {
    if (carouselRef.current) setScrollPos(carouselRef.current.scrollLeft);
  };

  const scroll = (dir) => {
    carouselRef.current?.scrollBy({ left: dir * (CARD_WIDTH + CARD_GAP) * 2, behavior: 'smooth' });
  };

  const atStart = scrollPos <= 10;
  const atEnd = carouselRef.current
    ? scrollPos >= carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10
    : false;

  const progressPct = carouselRef.current && carouselRef.current.scrollWidth > carouselRef.current.clientWidth
    ? (scrollPos / (carouselRef.current.scrollWidth - carouselRef.current.clientWidth)) * 100
    : 0;

  return (
    <section style={{
      backgroundImage: 'url(/images/bg1.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '80px 0',
      position: 'relative',
      overflow: 'hidden',
      color: '#fff',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;700;800&display=swap');
        @keyframes shimmer {
          0%   { background-position: -500px 0; }
          100% { background-position: 500px 0; }
        }
        .bike-card-inner { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .bike-card-inner:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 20px 40px rgba(0,0,0,0.45) !important; }
        .scroll-track::-webkit-scrollbar { display: none; }
        .scroll-track { -ms-overflow-style: none; scrollbar-width: none; }
        .arr-btn { transition: all 0.2s ease; }
        .arr-btn:hover:not(:disabled) { background: #e11d48 !important; border-color: #e11d48 !important; color: #fff !important; box-shadow: 0 6px 20px rgba(225,29,72,0.4) !important; }
      `}</style>

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', pointerEvents: 'none' }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* ── Header ── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 5vw', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ width: 40, height: 3, background: '#e11d48', borderRadius: 2, marginBottom: 14 }} />
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 900, margin: 0,
              letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1,
            }}>
              Explore Hero Bikes
            </h2>
            <p style={{ opacity: 0.6, marginTop: 8, fontSize: 14, fontWeight: 500 }}>
              Authorized Hero MotoCorp Dealer · {bikes.length} models
            </p>
          </div>

          {/* Arrow controls */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ dir: -1, label: '←' }, { dir: 1, label: '→' }].map(({ dir, label }) => {
              const disabled = dir === -1 ? atStart : atEnd;
              return (
                <button
                  key={dir}
                  className="arr-btn"
                  onClick={() => scroll(dir)}
                  disabled={disabled}
                  style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                    border: disabled ? '1.5px solid rgba(255,255,255,0.1)' : '1.5px solid rgba(255,255,255,0.3)',
                    color: disabled ? 'rgba(255,255,255,0.25)' : '#fff',
                    fontSize: 17, cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Carousel ── */}
      {loading ? (
        <div style={{ display: 'flex', gap: CARD_GAP, padding: `0 5vw`, overflowX: 'hidden' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              flex: `0 0 ${CARD_WIDTH}px`, height: 300, borderRadius: 16,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.07) 75%)',
              backgroundSize: '500px 100%',
              animation: 'shimmer 1.5s infinite',
            }} />
          ))}
        </div>
      ) : (
        <>
          <div
            ref={carouselRef}
            className="scroll-track"
            onScroll={handleScroll}
            style={{
              display: 'flex', gap: CARD_GAP,
              overflowX: 'auto',
              padding: `4px 5vw 16px`,
              scrollSnapType: 'x mandatory',
              cursor: 'grab',
              position: 'relative', zIndex: 1,
            }}
            onMouseDown={e => {
              const el = carouselRef.current;
              if (!el) return;
              el.style.cursor = 'grabbing';
              const startX = e.pageX - el.offsetLeft;
              const sl = el.scrollLeft;
              const onMove = ev => { el.scrollLeft = sl - (ev.pageX - el.offsetLeft - startX); };
              const onUp = () => { el.style.cursor = 'grab'; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
              window.addEventListener('mousemove', onMove);
              window.addEventListener('mouseup', onUp);
            }}
          >
            {bikes.map((bike, i) => {
              const imageUrl = bike.imageUrl.startsWith('http')
                ? bike.imageUrl
                : `https://backend.yaytech.in${bike.imageUrl}`;
              return (
                <div key={bike.id} style={{ scrollSnapAlign: 'start', flex: `0 0 ${CARD_WIDTH}px` }}>
                  <div
                    className="bike-card-inner"
                    style={{
                      background: '#fff', borderRadius: 16, padding: 20,
                      textAlign: 'center', color: '#111',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', height: '100%',
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={bike.name}
                      style={{ width: '100%', height: 140, objectFit: 'contain' }}
                      onError={e => { e.target.src = 'https://placehold.co/240x140?text=No+Image'; }}
                    />
                    <h3 style={{
                      margin: '14px 0 6px', fontSize: 16,
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 800, lineHeight: 1.2, color: '#111',
                    }}>
                      {bike.name}
                    </h3>
                    {bike.exShowroomPrice && (
                      <div style={{ fontSize: 13, color: '#e11d48', fontWeight: 700, marginBottom: 4 }}>
                        ₹{bike.exShowroomPrice.toLocaleString('en-IN')}*
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 16 }}>
                      {bike.engineCapacity}cc · {bike.mileage} kmpl
                    </div>
                    <button
                      onClick={() => {
                        navigate('/');
                        setTimeout(() => {
                          document.getElementById('book-your-dream-bike')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      style={{
                        marginTop: 'auto', width: '100%',
                        padding: '11px 14px', borderRadius: 8, border: 'none',
                        background: '#e11d48', color: '#fff',
                        cursor: 'pointer', fontWeight: 800, fontSize: 12,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#c01840'}
                      onMouseLeave={e => e.currentTarget.style.background = '#e11d48'}
                    >
                      Book Test Ride
                    </button>
                  </div>
                </div>
              );
            })}
            <div style={{ flex: `0 0 calc(5vw - ${CARD_GAP}px)`, minWidth: 0 }} />
          </div>

          {/* Progress bar */}
          <div style={{ padding: '8px 5vw 0', position: 'relative', zIndex: 1 }}>
            <div style={{ height: 2, background: 'rgba(255,255,255,0.12)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: '#e11d48', borderRadius: 2,
                width: `${progressPct}%`, transition: 'width 0.15s ease',
              }} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}