import { useState, useEffect, useRef } from 'react';

const services = [
  {
    id: 6, icon: '🏠', title: 'Doorstep Service',
    desc: "Can't visit us? We come to you. Our mechanic services your bike at your home or office — zero hassle.",
    price: '₹699', duration: '2–3 hrs',
    highlights: ['Home Visit', 'No Extra Charges', 'Same Day Booking', 'Expert Mechanics'],
    accent: '#CC0000',
  },
  {
    id: 1, icon: '🔧', title: 'General Service',
    desc: 'Complete servicing — oil change, filter replacement, brake check, and full safety inspection by certified Hero mechanics.',
    price: '₹499', duration: '2–3 hrs',
    highlights: ['Engine Oil Change', 'Air Filter Check', 'Brake Adjustment', 'Chain Lubrication'],
    accent: '#1A1A1A',
  },
  {
    id: 2, icon: '⚙️', title: 'Engine Repair',
    desc: 'Deep engine diagnostics and repair. Expert technicians ensure peak performance with genuine Hero spare parts.',
    price: '₹1,999', duration: '1–2 days',
    highlights: ['Complete Diagnostics', 'Genuine Spare Parts', 'Performance Tuning', '6-Month Warranty'],
    accent: '#CC0000',
  },
  {
    id: 3,
    icon: '🚚',
    title: 'Pick & Drop Service',
    desc: 'Convenient doorstep pickup and drop service for your bike. Get your Hero bike serviced without visiting the workshop.',
    price: '₹99',
    duration: 'Same Day',
    highlights: [
      'Doorstep Pickup',
      'Safe Transportation',
      'On-Time Delivery',
      'Hassle-Free Service'
    ],
    accent: '#1A1A1A',
  },
  {
    id: 4, icon: '🏍️', title: 'Hero JoyRide',
    desc: 'Complete doorstep servicing with free pickup support, quick inspection, washing, and smooth performance tuning.',
    price: '₹599', duration: '1–2 hrs',
    highlights: ['Free Pickup Support', 'Bike Wash', 'Performance Check', 'Quick Service'],
    accent: '#CC0000',
  },
  {
    id: 5,
    icon: '🛠️',
    title: 'Accidental Repair',
    desc: 'Complete accidental repair solutions including bodywork, parts replacement, dent fixing, and repainting to restore your bike perfectly.',
    price: '₹799',
    duration: '2–5 days',
    highlights: [
      'Accident Damage Repair',
      'Body Panel Replacement',
      'Dent & Scratch Fix',
      'Complete Repainting'
    ],
    accent: '#1A1A1A',
  },
];

const process = [
  { step: '01', title: 'Book Online', desc: 'Fill the booking form or call us to schedule your service appointment.' },
  { step: '02', title: 'Drop Your Bike', desc: 'Bring your bike to our workshop. Free pick-up available on select services.' },
  { step: '03', title: 'Expert Service', desc: 'Certified Hero technicians work on your bike using genuine parts only.' },
  { step: '04', title: 'Ready to Ride', desc: 'Get notified when done. Pick up a thoroughly inspected, run-perfect bike.' },
];

const freeServices = [
  { id: 1, name: 'Free Bike Inspection' },
  { id: 2, name: 'Free Diagnostic Check' },
  { id: 3, name: 'Free Cleaning Service' },
  { id: 4, name: 'Free Initial Consultation' },
];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function ServiceCard({ s, index, onBookClick }) {
  const [ref, vis] = useInView();
  const [hov, setHov] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const delay = index * 70;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => setExpanded(!expanded)}
      style={{
        background: '#fff',
        borderRadius: 4,
        overflow: 'hidden',
        border: hov ? `1px solid ${s.accent}` : '1px solid #E5E5E5',
        boxShadow: hov ? `0 14px 40px rgba(0,0,0,0.09)` : '0 2px 12px rgba(0,0,0,0.04)',
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.985)',
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ height: 3, background: s.accent, flexShrink: 0 }} />

      <div style={{ padding: '22px 24px 20px', borderBottom: '1px solid #F2F2F2', background: '#FAFAFA' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 4,
            background: s.accent === '#CC0000' ? '#FFF0F0' : '#F2F2F2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            {s.icon}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, fontWeight: 600, color: '#AAA', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>Starting from</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 20, fontWeight: 700, color: s.accent, lineHeight: 1 }}>{s.price}</div>
          </div>
        </div>
        <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 20, fontWeight: 600, color: '#111', letterSpacing: '-0.01em', marginBottom: 6 }}>{s.title}</h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400, color: '#777', lineHeight: 1.75 }}>{s.desc}</p>
      </div>

      <div style={{ padding: '14px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#CCC' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#888' }}>{s.duration}</span>
          </div>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600,
            color: s.accent, letterSpacing: '0.1em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {expanded ? 'Close' : 'Details'}
            <span style={{ display: 'inline-block', transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)', transform: expanded ? 'rotate(180deg)' : 'none', fontSize: 8 }}>▲</span>
          </span>
        </div>

        <div style={{
          overflow: 'hidden',
          maxHeight: expanded ? 260 : 0,
          opacity: expanded ? 1 : 0,
          transition: 'max-height 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
          marginTop: expanded ? 16 : 0,
        }}>
          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, fontWeight: 600, color: '#AAA', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>What's Included</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 8px', marginBottom: 18 }}>
              {s.highlights.map(h => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.accent, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#555' }}>{h}</span>
                </div>
              ))}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onBookClick(s); }}
              style={{
                width: '100%', padding: '12px', background: s.accent, color: '#fff',
                border: 'none', borderRadius: 3, cursor: 'pointer',
                fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                transition: 'opacity 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Book This Service <span style={{ fontWeight: 400 }}>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [globalForm, setGlobalForm] = useState({ name: '', phone: '', latitude: null, longitude: null, serviceType: '', isPaid: 'paid', freeServiceId: '' });
  const [locationStatus, setLocationStatus] = useState('ready');
  const [heroRef, heroVis] = useInView(0.01);

  const getGeolocation = () => {
    setLocationStatus('loading');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGlobalForm(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setLocationStatus('success');
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationStatus('error');
          alert('Unable to get location. Please enable location services.');
        }
      );
    } else {
      setLocationStatus('error');
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #F2F2F2; -webkit-font-smoothing: antialiased; }

        .hero-kicker {
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.65s ease 0.08s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.08s;
        }
        .hero-h1-line { overflow: hidden; }
        .hero-h1-inner { display: block; opacity: 0; transform: translateY(100%); }
        .hero-sub {
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.65s ease 0.5s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.5s;
        }
        .hero-stats {
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.65s ease 0.65s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.65s;
        }
        .hero-active .hero-kicker { opacity: 1; transform: none; }
        .hero-active .hero-h1-inner {
          opacity: 1; transform: translateY(0);
          transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .hero-active .hero-h1-inner:nth-child(1) { transition-delay: 0.16s; }
        .hero-active .hero-h1-inner:nth-child(2) { transition-delay: 0.26s; }
        .hero-active .hero-h1-inner:nth-child(3) { transition-delay: 0.36s; }
        .hero-active .hero-sub { opacity: 1; transform: none; }
        .hero-active .hero-stats { opacity: 1; transform: none; }

        input, select {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          width: 100%;
          padding: 11px 14px;
          border: 1px solid #E0E0E0;
          border-radius: 3px;
          outline: none;
          background: #fff;
          color: #111;
          transition: border-color 0.2s ease;
        }
        input:focus, select:focus { border-color: #CC0000; }

        .process-connector { color: #DDD; font-size: 20px; padding-top: 28px; flex-shrink: 0; }

        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr !important; }
          .process-row { flex-direction: column !important; gap: 20px !important; align-items: center !important; }
          .process-connector { display: none !important; }
          .booking-row { flex-direction: column !important; }
          .booking-form { max-width: 100% !important; }
        }
        @media (min-width: 641px) and (max-width: 960px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className={heroVis ? 'hero-active' : ''}
        style={{
          background: '#0D0D0D',
          backgroundImage: 'url(/images/bg1.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          position: 'relative',
          padding: 'clamp(72px, 14vw, 120px) 5vw clamp(60px, 10vw, 96px)',
          color: '#fff', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.72) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#CC0000' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
          <div className="hero-kicker" style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: '0.22em', color: '#CC0000', textTransform: 'uppercase',
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: '#CC0000' }} />
            Authorized Service Center
            <span style={{ display: 'inline-block', width: 24, height: 1, background: '#CC0000' }} />
          </div>

          <h1 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(44px, 7.5vw, 92px)', fontWeight: 600, lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: 26 }}>
            <div className="hero-h1-line"><span className="hero-h1-inner">EXPERT BIKE</span></div>
            <div className="hero-h1-line"><span className="hero-h1-inner" style={{ color: '#CC0000' }}>SERVICING</span></div>
            <div className="hero-h1-line"><span className="hero-h1-inner">AT YOUR DOOR</span></div>
          </h1>

          <p className="hero-sub" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.55)', maxWidth: 460, lineHeight: 1.75, marginBottom: 40 }}>
            Certified technicians, genuine parts, and transparent pricing — at our workshop or your doorstep.
          </p>

          <div className="hero-stats" style={{ display: 'flex', gap: 'clamp(24px, 6vw, 48px)', flexWrap: 'wrap', paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[['Certified', 'Hero Technicians'], ['Genuine', 'Spare Parts Only'], ['10,000+', 'Services Done'], ['Same Day', 'Delivery*']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: '#CC0000', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section style={{ background: '#F2F2F2', padding: 'clamp(52px, 10vw, 80px) 5vw' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 'clamp(36px, 7vw, 56px)' }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600, color: '#CC0000', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 20, height: 1, background: '#CC0000', display: 'inline-block' }} />
              What We Offer
            </div>
            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 600, color: '#111', letterSpacing: '-0.02em', lineHeight: 1 }}>Our Services</h2>
          </div>
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {services.map((s, i) => <ServiceCard key={s.id} s={s} index={i} onBookClick={() => setGlobalForm(prev => ({ ...prev, serviceType: s.title }))} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#fff', padding: 'clamp(52px, 10vw, 80px) 5vw', borderTop: '1px solid #EBEBEB' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 7vw, 60px)' }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600, color: '#CC0000', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>Simple Process</div>
            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 600, color: '#111', letterSpacing: '-0.02em' }}>How It Works</h2>
          </div>
          <div className="process-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            {process.map((p, i) => (
              <div key={p.step} style={{ display: 'flex', alignItems: 'flex-start' }}>
                {i > 0 && <div className="process-connector">→</div>}
                <div style={{ flex: '1 1 clamp(140px, 18vw, 200px)', maxWidth: 220, textAlign: 'center', padding: '0 clamp(8px, 2vw, 20px)' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 4,
                    background: i === 0 ? '#CC0000' : '#111',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 18px',
                    fontFamily: "'Rajdhani', sans-serif", fontSize: 22, fontWeight: 700, color: '#fff',
                  }}>{p.step}</div>
                  <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 18, fontWeight: 600, color: '#111', marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400, color: '#888', lineHeight: 1.7 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBAL SERVICE FORM ── */}
      <section style={{ background: '#111', borderTop: '3px solid #CC0000', padding: 'clamp(52px, 10vw, 80px) 5vw' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 7vw, 60px)' }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600, color: '#CC0000', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ width: 20, height: 1, background: '#CC0000', display: 'inline-block' }} />
              Book Your Service
              <span style={{ width: 20, height: 1, background: '#CC0000', display: 'inline-block' }} />
            </div>
            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 600, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
              Schedule Your <span style={{ color: '#CC0000' }}>Service</span> Today
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.45)', maxWidth: 500, lineHeight: 1.75, marginTop: 18, margin: '18px auto 0' }}>
              Fill in your details and select a service. We'll get in touch with you shortly to confirm your appointment.
            </p>
          </div>

          {/* Global Form */}
          <div style={{ background: '#fff', borderRadius: 8, padding: 'clamp(28px, 5vw, 40px)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
              {/* Name */}
              <div>
                <label style={{ fontFamily: "'Rajdhani', sans-serif", display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={globalForm.name}
                  onChange={e => setGlobalForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontFamily: "'Rajdhani', sans-serif", display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={globalForm.phone}
                  onChange={e => setGlobalForm(p => ({ ...p, phone: e.target.value }))}
                />
              </div>

              {/* Location */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontFamily: "'Rajdhani', sans-serif", display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Location *</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Tap 'Get Location' to enable auto-detection"
                      value={globalForm.latitude && globalForm.longitude ? `${globalForm.latitude.toFixed(5)}, ${globalForm.longitude.toFixed(5)}` : ''}
                      readOnly
                      style={{ background: '#f5f5f5', color: '#888' }}
                    />
                  </div>
                  <button
                    onClick={getGeolocation}
                    disabled={locationStatus === 'loading'}
                    style={{
                      padding: '11px 20px',
                      background: locationStatus === 'success' ? '#00AA44' : (locationStatus === 'error' ? '#CC0000' : '#111'),
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: locationStatus === 'loading' ? 'not-allowed' : 'pointer',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      opacity: locationStatus === 'loading' ? 0.7 : 1,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => locationStatus !== 'loading' && (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => locationStatus !== 'loading' && (e.currentTarget.style.opacity = '1')}
                  >
                    {locationStatus === 'loading' ? 'Getting...' : (locationStatus === 'success' ? '✓ Got' : 'Get Location')}
                  </button>
                </div>
              </div>

              {/* Service Type */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontFamily: "'Rajdhani', sans-serif", display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Service Type *</label>
                <select
                  value={globalForm.serviceType}
                  onChange={e => setGlobalForm(p => ({ ...p, serviceType: e.target.value }))}
                >
                  <option value="">Select a service</option>
                  {services.map(s => <option key={s.id} value={s.title}>{s.title} - {s.price}</option>)}
                </select>
              </div>

              {/* Paid/Free Toggle */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontFamily: "'Rajdhani', sans-serif", display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Service Type</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['paid', 'free'].map(type => (
                    <button
                      key={type}
                      onClick={() => setGlobalForm(p => ({ ...p, isPaid: type, freeServiceId: '' }))}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        background: globalForm.isPaid === type ? '#CC0000' : '#f0f0f0',
                        color: globalForm.isPaid === type ? '#fff' : '#111',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => globalForm.isPaid !== type && (e.currentTarget.style.background = '#e0e0e0')}
                      onMouseLeave={e => globalForm.isPaid !== type && (e.currentTarget.style.background = '#f0f0f0')}
                    >
                      {type === 'paid' ? 'Paid Service' : 'Free Service'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free Service Selection */}
              {globalForm.isPaid === 'free' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontFamily: "'Rajdhani', sans-serif", display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Select Free Service *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {freeServices.map(fs => (
                      <button
                        key={fs.id}
                        onClick={() => setGlobalForm(p => ({ ...p, freeServiceId: fs.id.toString() }))}
                        style={{
                          padding: '12px 14px',
                          background: globalForm.freeServiceId === fs.id.toString() ? '#00AA44' : '#f5f5f5',
                          color: globalForm.freeServiceId === fs.id.toString() ? '#fff' : '#111',
                          border: globalForm.freeServiceId === fs.id.toString() ? '1px solid #00AA44' : '1px solid #e0e0e0',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 12,
                          fontWeight: 500,
                          textAlign: 'center',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => globalForm.freeServiceId !== fs.id.toString() && (e.currentTarget.style.background = '#efefef')}
                        onMouseLeave={e => globalForm.freeServiceId !== fs.id.toString() && (e.currentTarget.style.background = '#f5f5f5')}
                      >
                        {fs.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={() => {
                  if (!globalForm.name || !globalForm.phone || !globalForm.serviceType || (globalForm.isPaid === 'free' && !globalForm.freeServiceId) || !globalForm.latitude || !globalForm.longitude) {
                    alert('Please fill in all required fields.');
                    return;
                  }
                  console.log('Form submitted:', globalForm);
                  alert(`Service booking request submitted!\n\nName: ${globalForm.name}\nPhone: ${globalForm.phone}\nLocation: ${globalForm.latitude.toFixed(5)}, ${globalForm.longitude.toFixed(5)}\nService: ${globalForm.serviceType}\nType: ${globalForm.isPaid === 'paid' ? 'Paid' : 'Free'}`);
                  setGlobalForm({ name: '', phone: '', latitude: null, longitude: null, serviceType: '', isPaid: 'paid', freeServiceId: '' });
                  setLocationStatus('ready');
                }}
                style={{
                  gridColumn: '1 / -1',
                  padding: '14px',
                  background: '#CC0000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginTop: 8,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#AA0000'}
                onMouseLeave={e => e.currentTarget.style.background = '#CC0000'}
              >
                Book Service <span style={{ fontWeight: 400 }}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
