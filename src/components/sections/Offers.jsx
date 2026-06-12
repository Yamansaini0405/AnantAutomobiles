import { useState, useEffect, useRef } from 'react';

const offerTypes = ['All', 'FLAT', 'PERCENTAGE'];
const typeLabels = { FLAT: 'Flat Discount', PERCENTAGE: 'Percentage Off' };

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function OfferCard({ offer, index }) {
  const [ref, vis] = useInView();
  const [hov, setHov] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const delay = index * 65;
  
  // Custom deterministic style parameters based on offer indexing
  const cardBg = index % 2 === 0 ? '#CC0000' : '#1A1A1A';
  const displayIcon = offer.type === 'PERCENTAGE' ? '%' : '₹';

  const scrollToBook = () => {
    const el = document.getElementById('book-your-dream-bike');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.location.href = '/#book-your-dream-bike';
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: 4,
        overflow: 'hidden',
        border: hov ? `1px solid ${cardBg}` : '1px solid #E0E0E0',
        boxShadow: hov ? `0 12px 40px rgba(0,0,0,0.15)` : '0 2px 12px rgba(0,0,0,0.05)',
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.98)',
        transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: cardBg }} />

      {/* Header block */}
      <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #F0F0F0', background: '#FAFAFA' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 4,
            background: cardBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 22, fontWeight: 600, color: '#fff',
          }}>
            {displayIcon}
          </div>
          <span style={{
            background: '#F5F5F5',
            border: '1px solid #E8E8E8',
            color: '#555',
            fontSize: 10,
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 2,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            {offer.type === 'PERCENTAGE' ? 'Limited Deal' : 'Instant Save'}
          </span>
        </div>

        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
          {offer.type === 'PERCENTAGE' ? 'Percentage Benefit' : 'Flat Cash Discount'}
        </div>
        <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 22, fontWeight: 600, color: '#111', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 0 }}>
          {offer.name} Offer
        </h3>
      </div>

      {/* Saving strip */}
      <div style={{ background: cardBg, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {offer.type === 'PERCENTAGE' ? 'Total Savings Up To' : 'Direct Rebate Value'}
        </span>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
          {offer.type === 'PERCENTAGE' ? `${offer.value}%` : `₹${offer.value.toLocaleString('en-IN')}`}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 400, color: '#666', lineHeight: 1.75, marginBottom: 16 }}>
          {offer.description || 'Special targeted campaign discount structure available across our authorized lineup limits.'}
        </p>

        {/* Dynamic Parameters/Limits tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif",
            padding: '3px 9px', background: '#F5F5F5', border: '1px solid #E5E5E5',
            borderRadius: 2, fontSize: 11, fontWeight: 600, color: '#444', letterSpacing: '0.04em',
          }}>
            Type: {offer.type}
          </span>
          {offer.upToLimit && (
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              padding: '3px 9px', background: '#FFF5F5', border: '1px solid #FFE0E0',
              borderRadius: 2, fontSize: 11, fontWeight: 600, color: '#CC0000', letterSpacing: '0.04em',
            }}>
              Max Limit: ₹{offer.upToLimit.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Validity block */}
        {/* <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: cardBg }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#888' }}>
            Created: {new Date(offer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div> */}

        {/* Terms accordion */}
        <div style={{ marginBottom: 20, borderTop: '1px solid #F0F0F0', paddingTop: 14 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '0.1em',
              textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = cardBg}
            onMouseLeave={e => e.currentTarget.style.color = '#888'}
          >
            <span style={{ fontSize: 8, display: 'inline-block', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)' }}>▲</span>
            {expanded ? 'Hide Terms' : 'View Terms & Conditions'}
          </button>
          
          <div style={{
            overflow: 'hidden',
            maxHeight: expanded ? 200 : 0,
            opacity: expanded ? 1 : 0,
            transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
            marginTop: expanded ? 12 : 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#BBB', flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#888', lineHeight: 1.6, wordBreak: 'break-all' }}>
                {offer.terms || 'Standard showroom policies apply. Bring valid authorization documentation upon purchase settlement processing.'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* CTA */}
        <button
          onClick={scrollToBook}
          style={{
            width: '100%', padding: '13px 16px',
            background: hov ? cardBg : '#111',
            color: '#fff', border: 'none', borderRadius: 3,
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            transition: 'background 0.3s cubic-bezier(0.22,1,0.36,1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          Claim This Offer
          <span style={{ fontSize: 14, fontWeight: 400, transition: 'transform 0.3s ease', display: 'inline-block', transform: hov ? 'translateX(4px)' : 'translateX(0)' }}>→</span>
        </button>
      </div>
    </div>
  );
}

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('All');
  const [heroRef, heroVis] = useInView(0.01);
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  // API Live Fetch Integration 
  useEffect(() => {
    fetch('https://backend.yaytech.in/api/discounts')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          // Filter out deleted items and verify that the discount is marked active
          const activeDiscounts = resData.data.filter(item => !item.isDeleted && item.isActive);
          setOffers(activeDiscounts);
        }
      })
      .catch((err) => console.error('Error fetching live discounts fleet:', err))
      .finally(() => setLoading(false));
  }, []);

  // Countdown clock handling
  useEffect(() => {
    const end = new Date('2026-06-30T23:59:59').getTime();
    const tick = setInterval(() => {
      const diff = end - Date.now();
      if (diff <= 0) { clearInterval(tick); setTimeLeft({ d: '00', h: '00', m: '00', s: '00' }); return; }
      setTimeLeft({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const filtered = offers.filter(o => activeType === 'All' || o.type === activeType);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #F2F2F2; -webkit-font-smoothing: antialiased; }

        .hero-kicker {
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s;
        }
        .hero-h1-line { overflow: hidden; }
        .hero-h1-inner { display: block; opacity: 0; transform: translateY(100%); }
        .hero-sub {
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.7s ease 0.55s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s;
        }
        .hero-timer {
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.7s ease 0.7s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.7s;
        }
        .hero-active .hero-kicker { opacity: 1; transform: none; }
        .hero-active .hero-h1-inner {
          opacity: 1; transform: translateY(0);
          transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .hero-active .hero-h1-inner:nth-child(1) { transition-delay: 0.18s; }
        .hero-active .hero-h1-inner:nth-child(2) { transition-delay: 0.28s; }
        .hero-active .hero-sub { opacity: 1; transform: none; }
        .hero-active .hero-timer { opacity: 1; transform: none; }

        .filter-btn {
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px; font-weight: 600;
          padding: 7px 16px; border-radius: 2px; cursor: pointer;
          letter-spacing: 0.1em; text-transform: uppercase;
          border: 1px solid #DDD; background: #fff; color: #666;
          transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
        }
        .filter-btn:hover { border-color: #CC0000; color: #CC0000; }
        .filter-btn.active { background: #CC0000; border-color: #CC0000; color: #fff; }
        .stripe-bg { background-image: repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 6px); }

        @media (max-width: 640px) {
          .offers-grid { grid-template-columns: 1fr !important; }
          .hero-h1 { font-size: clamp(40px, 12vw, 80px) !important; }
          .banner-inner { flex-direction: column !important; }
          .banner-buttons { flex-direction: column !important; width: 100% !important; }
        }
        @media (min-width: 641px) and (max-width: 960px) {
          .offers-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className={`stripe-bg ${heroVis ? 'hero-active' : ''}`}
        style={{
          background: '#0D0D0D',
          backgroundImage: 'url(/images/bg1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          padding: 'clamp(72px, 14vw, 120px) 5vw clamp(60px, 10vw, 96px)',
          color: '#fff',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.75) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#CC0000' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto' }}>
          <div className="hero-kicker" style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 600,
            letterSpacing: '0.22em', color: '#CC0000', textTransform: 'uppercase',
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ display: 'inline-block', width: 28, height: 1, background: '#CC0000' }} />
            Exclusive Dynamic System Discounts
            <span style={{ display: 'inline-block', width: 28, height: 1, background: '#CC0000' }} />
          </div>

          <h1 className="hero-h1" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(44px, 7.5vw, 96px)', fontWeight: 600, lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: 28 }}>
            <div className="hero-h1-line"><span className="hero-h1-inner">UNLOCKED STORES</span></div>
            <div className="hero-h1-line"><span className="hero-h1-inner" style={{ color: '#CC0000' }}>DISCOUNT REDEMPTION</span></div>
          </h1>

          <p className="hero-sub" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.60)', maxWidth: 460, lineHeight: 1.7, marginBottom: 44 }}>
            Maximize backend corporate rates. Claim personalized structural flat incentives and smart matrix coverage parameters instantly.
          </p>

          {/* Countdown Clock UI */}
          <div className="hero-timer" style={{ display: 'inline-flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Campaign ends in</span>
            <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
              {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([key, label], i) => (
                <div key={key} style={{ display: 'flex', alignItems: 'stretch' }}>
                  {i > 0 && <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', fontFamily: "'Rajdhani', sans-serif", fontSize: 22, color: 'rgba(255,255,255,0.2)' }}>:</div>}
                  <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '10px 16px', textAlign: 'center', minWidth: 64 }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 36, fontWeight: 700, color: '#CC0000', lineHeight: 1 }}>{timeLeft[key]}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8E8E8', position: 'sticky', top: 66, zIndex: 40, padding: '14px 5vw', boxShadow: '0 1px 0 #E8E8E8' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {offerTypes.map(t => (
              <button key={t} className={`filter-btn${activeType === t ? ' active' : ''}`} onClick={() => setActiveType(t)}>
                {t === 'All' ? 'All Benefits' : typeLabels[t]}
              </button>
            ))}
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 600, color: '#AAA', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {filtered.length} Reward Plans Active
          </div>
        </div>
      </div>

      {/* ── OFFER GRID ── */}
      <section style={{ background: '#F2F2F2', padding: '48px 5vw 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', fontFamily: "'Rajdhani', sans-serif", fontSize: 18, color: '#666' }}>Synchronizing Storefront Rates...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', fontFamily: "'Rajdhani', sans-serif", fontSize: 16, color: '#999', padding: '40px 0' }}>No specific vouchers matching filter criteria.</div>
          ) : (
            <div className="offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {filtered.map((o, i) => <OfferCard key={o.id} offer={o} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM CONTACT CTA ── */}
      <section style={{ background: '#111', borderTop: '3px solid #CC0000', padding: 'clamp(48px, 8vw, 72px) 5vw' }}>
        <div className="banner-inner" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600, color: '#CC0000', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>— Need Assistance?</div>
            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 600, color: '#fff', lineHeight: 0.95, marginBottom: 14 }}>Find the Best Offer<br />for Your Budget</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.45)', maxWidth: 400, lineHeight: 1.7 }}>Our finance managers will assist you in applying active system campaigns to provide massive savings on deliveries.</p>
          </div>

          <div className="banner-buttons" style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 260 }}>
            <a href="tel:+918650442200" className="banner-btn" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', background: '#CC0000', borderRadius: 3, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = '#AA0000'} onMouseLeave={e => e.currentTarget.style.background = '#CC0000'}
            >
              <div style={{ width: 40, height: 40, borderRadius: 2, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📞</div>
              <div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>Call Showroom</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>+91 86504 42200</div>
              </div>
            </a>

            <a href="https://wa.me/918650442200" target="_blank" rel="noopener noreferrer" className="banner-btn" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 2, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💬</div>
              <div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>WhatsApp Chat</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>Connect Instantly</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}