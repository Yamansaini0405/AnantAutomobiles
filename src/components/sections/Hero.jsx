import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';

// MEMOIZED FORM COMPONENT - isolated from carousel re-renders
const EnquiryFormComponent = memo(({ 
  formInputs, 
  onInputChange, 
  onSubmit, 
  loading, 
  message, 
  isMobile = false 
}) => {
  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: 7,
    fontSize: 13,
    fontFamily: "'Barlow', sans-serif",
    color: '#111',
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 22,
        fontWeight: 600,
        color: '#000',
        margin: `0 0 ${isMobile ? 14 : 16}px`,
        letterSpacing: '-0.02em',
      }}>
        Find Your Perfect Bike
      </h2>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input 
          type="text"
          name="fullName" 
          value={formInputs.fullName} 
          onChange={onInputChange}
          placeholder="Full Name" 
          required 
          style={inputStyle} 
          autoComplete="name"
        />
        <input 
          type="tel" 
          name="phone" 
          value={formInputs.phone} 
          onChange={onInputChange}
          placeholder="Phone Number" 
          required 
          style={inputStyle}
          autoComplete="tel"
        />
        <select 
          name="brand" 
          value={formInputs.brand} 
          onChange={onInputChange} 
          required
          style={{ ...inputStyle, color: formInputs.brand ? '#111' : '#777' }}
        >
          <option value="" disabled>Select Models</option>
          {BRANDS.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: 8 }}>
          <input 
            type="text"
            name="city" 
            value={formInputs.city} 
            onChange={onInputChange}
            placeholder="City" 
            style={{ ...inputStyle, width: '50%' }}
            autoComplete="off"
          />
          <input 
            type="text"
            name="pincode" 
            value={formInputs.pincode} 
            onChange={onInputChange}
            placeholder="Pincode" 
            style={{ ...inputStyle, width: '50%' }}
            autoComplete="address-level2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            marginTop: 6,
            padding: '13px',
            background: loading ? '#999' : (hovered ? '#cc0000' : '#000'),
            color: '#fff',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: 7,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: hovered && !loading ? '0 6px 20px rgba(204,0,0,0.35)' : '0 4px 14px rgba(0,0,0,0.2)',
            transform: hovered && !loading ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'all 0.2s ease',
            width: '100%',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Submitting...' : 'Submit Enquiry →'}
        </button>
        {message.text && (
          <div style={{
            marginTop: 10,
            padding: '10px 12px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Barlow', sans-serif",
            backgroundColor: message.type === 'success' ? '#e0ffe0' : '#ffe0e0',
            color: message.type === 'success' ? '#00c600' : '#c60000',
            textAlign: 'center',
          }}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
});

EnquiryFormComponent.displayName = 'EnquiryForm';

const heroSlides = [
  {
    image: '/images/banner7.png',
    // title: 'ROYAL\nENFIELD',
    // sub: 'LAUNCHED',
  },
  {
    image: '/images/banner4.png',
    // title: 'BAJAJ\nPULSAR',
    // sub: 'LAUNCHED',
  },
  {
    image: '/images/banner5.png',
    // title: 'HONDA\nCB500',
    // sub: 'LAUNCHED',
  },
  // {
  //   image: '/images/hero4.jpg',
  //   // title: 'KTM\nDUKE 390',
  //   // sub: 'LAUNCHED',
  // },
];

// const BRANDS = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha', 'Suzuki', 'KTM'];
const BRANDS = [
  'Splendor Plus',
  'HF Deluxe',
  'Super Splendor',
  'Glamour',
  'Passion Plus',
  'Passion XTEC',
  'Xtreme 125R',
  'Xtreme 160R',
  'Xpulse 200',
  'Xpulse 200T',
  'Karizma XMR',
  'Destini 125'
];
const DURATION = 5000;
const TRANSITION_MS = 800;

export default function Hero() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [tab, setTab] = useState('new');
  const [mobileFormOpen, setMobileFormOpen] = useState(false);
  const transRef = useRef(false);

  // NEW FORM STATE
  const [formInputs, setFormInputs] = useState({
    fullName: '',
    phone: '',
    brand: '',
    model: '',
    city: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    heroSlides.forEach(s => { const img = new Image(); img.src = s.image; });
  }, []);

  const goTo = useCallback((idx) => {
    if (transRef.current || idx === current) return;
    transRef.current = true;
    setTextVisible(false);
    setTimeout(() => {
      setCurrent(idx);
      transRef.current = false;
      setTextVisible(true);
    }, TRANSITION_MS);
  }, [current]);

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % heroSlides.length), DURATION);
    return () => clearInterval(t);
  }, [current, goTo]);

  useEffect(() => {
    if (mobileFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileFormOpen]);

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setFormInputs(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fi-sender-fullName', formInputs.fullName);
      formDataToSend.append('fi-text-phone', formInputs.phone);
      formDataToSend.append('fi-text-brand', formInputs.brand);
      formDataToSend.append('fi-text-model', formInputs.model);
      formDataToSend.append('fi-text-city', formInputs.city);
      formDataToSend.append('fi-text-pincode', formInputs.pincode);

      const response = await fetch('https://forminit.com/f/x1mlf5p6870', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Thank you! Your inquiry has been received.'
        });
        setFormInputs({ fullName: '', phone: '', brand: '', model: '', city: '', pincode: '' });
        setTimeout(() => setMobileFormOpen(false), 1500);
      } else {
        setMessage({
          type: 'error',
          text: 'Error submitting form. Please try again.'
        });
      }
    } catch (error) {
      console.error('Form error:', error);
      setMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  }, [formInputs]);

  const slide = heroSlides[current];

  return (
    <>
      {/* ─────────────── DESKTOP HERO ─────────────── */}
      <section className="desktop-hero" style={{
        position: 'relative',
        width: '100%',
        height: '95vh',
        minHeight: 600,
        overflow: 'hidden',
        marginTop: 50,
      }}>
        {/* Background slides */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, }}>
          {heroSlides.map((s, i) => (
            <img key={i} src={s.image} alt="" style={{
              position: 'absolute', inset: 0,

              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: '72% center',
              opacity: i === current ? 1 : 0,
              transition: `opacity ${TRANSITION_MS}ms ease`,
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent 55%)',
          }} />
        </div>

        {/* Desktop content */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          padding: '60px 5vw',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          minHeight: '100%',
        }}>
          {/* Form card */}
          <div style={{
            width: 340, maxWidth: '40vw', flexShrink: 0,
            padding: '24px 28px',
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 14,
            boxShadow: '0 12px 56px rgba(0,0,0,0.28)',
            boxSizing: 'border-box',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <EnquiryFormComponent 
              formInputs={formInputs}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              loading={loading}
              message={message}
            />
          </div>

          {/* Right: bike title (commented as in original) */}
          <div style={{ marginLeft: 'auto', textAlign: 'right', maxWidth: '50%' }}>
            <div style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(18px)',
              transition: `opacity ${TRANSITION_MS * 0.6}ms ease, transform ${TRANSITION_MS * 0.6}ms ease`,
            }}>
              {/* title + sub commented out as in your original code */}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── MOBILE HERO ─────────────── */}
      <div className="mobile-hero" style={{
        display: 'none',
        width: '100%',
        background: '#f2f2f2',
        flexDirection: 'column',
        paddingBottom: 24,
        marginTop:12,

        boxSizing: 'border-box',
      }}>

        {/* Banner wrapper */}
        <div style={{
          position: 'relative',
          width: 'calc(100% - 24px)',
          margin: '62px 12px 0',
          borderRadius: 16,
          overflow: 'hidden',
          aspectRatio: '16 / 9',
          // boxShadow: '0 6px 28px rgba(0,0,0,0.18)',
          flexShrink: 0,
        }}>
          {/* Slides */}
          {heroSlides.map((s, i) => (
            <img key={i} src={s.image} alt="" style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              opacity: i === current ? 1 : 0,
              transition: `opacity ${TRANSITION_MS}ms ease`,
            }} />
          ))}

          {/* Updated gradient – stops earlier to protect button area */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '54%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.45) 32%, transparent 108%)',
            pointerEvents: 'none',
          }} />

          {/* Bottom-left: heading text – moved up */}
          <div style={{
            position: 'absolute',
            bottom: 82,  // ← increased from 46
            left: 16,
            zIndex: 5,
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity ${TRANSITION_MS * 0.6}ms ease, transform ${TRANSITION_MS * 0.6}ms ease`,
          }}>
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(20px,6vw,28px)',
              fontWeight: 900,
              lineHeight: 1,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
              margin: '0 0 2px',
              whiteSpace: 'pre-line',
            }}>{slide.title}</p>
            <p style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              margin: 0,
            }}>{slide.sub}</p>
          </div>

          {/* Enquire Now button – main fix area */}
          <button
            onClick={() => setMobileFormOpen(true)}
            style={{
              position: 'absolute',
              bottom: 'calc(16px + env(safe-area-inset-bottom))',
              left: 16,
              zIndex: 10,
              padding: '11px 22px',
              background: '#d90000',
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 800,
              fontFamily: "'Barlow', sans-serif",
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: 10,
              boxShadow: '0 6px 20px rgba(217,0,0,0.48)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minWidth: 140,
            }}
          >
            Enquire Now →
          </button>
        </div>

        {/* 4 Feature Cards grid – unchanged */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: '14px 12px 0',
        }}>
          {[
            // { label: 'New Bikes', sub: 'with Exciting Offers', bg: '#fff', color: '#111', icon: '', route: '/public-bikes' },
            { label: 'Services',  sub: 'with Exciting Offers', bg: '#111', color: '#fff', icon: '⚙️', route: '/services' },
            // { label: 'Blogs',     sub: 'with Exciting Offers', bg: '#111', color: '#fff', icon: '', route: '/blogs' },
            { label: 'Offers',    sub: 'with Exciting Offers', bg: '#fff', color: '#111', icon: '', route: '/offers' },
          ].map((card, idx) => (
            <div key={idx} onClick={() => navigate(card.route)} style={{
              background: card.bg,
              borderRadius: 14,
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 100,
              boxShadow: card.bg === '#fff'
                ? '0 2px 12px rgba(0,0,0,0.07), inset 0 0 0 1.5px #e8e8e8'
                : '0 2px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
              onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <div>
                <p style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 18, fontWeight: 800,
                  color: card.color, margin: '0 0 2px',
                  letterSpacing: '-0.01em',
                }}>{card.label}</p>
                <p style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 10, fontWeight: 500,
                  color: card.bg === '#fff' ? '#999' : 'rgba(255,255,255,0.6)',
                  margin: 0,
                }}>{card.sub}</p>
              </div>
              <div style={{ fontSize: 28, lineHeight: 1, marginTop: 8 }}>{card.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────── MOBILE OVERLAY FORM ─────────────── */}
      {mobileFormOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setMobileFormOpen(false); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex', alignItems: 'flex-end',
          }}
        >
          <div style={{
            width: '100%', background: '#fff',
            borderRadius: '20px 20px 0 0',
            padding: '0 22px 48px',
            maxHeight: '92vh', overflowY: 'auto',
            boxSizing: 'border-box',
            animation: 'slideUp 0.32s cubic-bezier(0.32,0.72,0,1)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', position: 'relative',
              paddingTop: 14, marginBottom: 20,
            }}>
              <div style={{ width: 40, height: 5, background: '#e0e0e0', borderRadius: 4 }} />
              <button
                onClick={() => setMobileFormOpen(false)}
                style={{
                  position: 'absolute', right: 0, top: 8,
                  width: 32, height: 32, borderRadius: '50%',
                  border: 'none', background: '#f2f2f2',
                  cursor: 'pointer', fontSize: 14, color: '#444',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>
            <EnquiryFormComponent 
              formInputs={formInputs}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              loading={loading}
              message={message}
              isMobile
            />
          </div>
        </div>
      )}

      {/* ─────────────── FLOATING WHATSAPP BUTTON ─────────────── */}
      <a
        href="https://wa.me/8650442200?text=I%20want%20to%20buy%20bike%20from%20anant%20automobiles"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 999,
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#25d366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 28px rgba(37, 211, 102, 0.4)',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          animation: 'floatUpDown 2.5s ease-in-out infinite',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(37, 211, 102, 0.4)';
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24	c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path><path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"></path><path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3	l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"></path><path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8l6-1.6l0.6,0.3	c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path><path fill="#fff" fill-rule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4	s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6	s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4	c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8	C20.6,19.3,19.7,17,19.3,16z" clip-rule="evenodd"></path>
</svg>
      </a>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700;800&display=swap');

        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @media (max-width: 940px) {
          .desktop-hero { display: none !important; }
          .mobile-hero  { display: flex !important; }
        }
        @media (min-width: 941px) {
          .desktop-hero { display: block !important; }
          .mobile-hero  { display: none !important; }
        }
        .mobile-hero * { box-sizing: border-box; }

        @media (max-width: 640px) {
          a[href*="wa.me"] {
            bottom: 20px !important;
            right: 20px !important;
            width: 56px !important;
            height: 56px !important;
          }
        }
      `}</style>
    </>
  );
}