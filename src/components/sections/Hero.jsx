import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// MEMOIZED FORM COMPONENT
const EnquiryFormComponent = memo(({
  formInputs,
  onInputChange,
  onSubmit,
  loading,
  message,
  bikeOptions,
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

  const labelStyle = {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: 4,
    display: 'block',
  };

  const fieldWrap = (label, children) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );

  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 22,
        fontWeight: 700,
        color: '#000',
        margin: `0 0 ${isMobile ? 14 : 18}px`,
        letterSpacing: '-0.02em',
      }}>
        Find Your Perfect Bike
      </h2>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Row 1: Name + Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {fieldWrap('Full Name *',
            <input
              type="text"
              name="fullName"
              value={formInputs.fullName}
              onChange={onInputChange}
              placeholder="Your name"
              required
              style={inputStyle}
              autoComplete="name"
            />
          )}
          {fieldWrap('Phone Number *',
            <input
              type="tel"
              name="phone"
              value={formInputs.phone}
              onChange={onInputChange}
              placeholder="+91 XXXXX XXXXX"
              required
              style={inputStyle}
              autoComplete="tel"
            />
          )}
        </div>

        {/* Row 2: Model Name (Dynamic) */}
        {fieldWrap('Model Name *',
          <select
            name="model"
            value={formInputs.model}
            onChange={onInputChange}
            required
            style={{ ...inputStyle, color: formInputs.model ? '#111' : '#777' }}
          >
            <option value="" disabled>Select a model</option>
            {bikeOptions.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        )}

        {/* Row 3: City + State */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {fieldWrap('City *',
            <input
              type="text"
              name="city"
              value={formInputs.city}
              onChange={onInputChange}
              placeholder="Your city"
              required
              style={inputStyle}
              autoComplete="address-level2"
            />
          )}
          {fieldWrap('State *',
            <input
              type="text"
              name="state"
              value={formInputs.state}
              onChange={onInputChange}
              placeholder="Your state"
              required
              style={inputStyle}
              autoComplete="address-level1"
            />
          )}
        </div>

        {/* Row 4: Pincode */}
        {fieldWrap('Pincode *',
          <input
            type="text"
            name="pincode"
            value={formInputs.pincode}
            onChange={onInputChange}
            placeholder="6-digit pincode"
            required
            maxLength={6}
            style={inputStyle}
            autoComplete="postal-code"
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            marginTop: 4,
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
            marginTop: 4,
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
  { image: '/images/banner7.png' },
  { image: '/images/banner4.png' },
  { image: '/images/banner5.png' },
];

const DURATION = 5000;
const TRANSITION_MS = 800;

export default function Hero() {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [mobileFormOpen, setMobileFormOpen] = useState(false);
  const [bikeOptions, setBikeOptions] = useState([]);
  const transRef = useRef(false);

  // FORM STATE
  const [formInputs, setFormInputs] = useState({
    fullName: '',
    phone: '',
    model: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch real fleet dynamic models
  useEffect(() => {
    fetch('https://backend.yaytech.in/api/bike-models/')
      .then(res => res.json())
      .then(resData => {
        if(resData.success && Array.isArray(resData.data)) {
          const names = resData.data.filter(b => !b.isDeleted).map(b => b.name);
          setBikeOptions(names);
        }
      })
      .catch(err => console.error("Error global-fetching options", err));
  }, []);

  // Listen for query url parameters to auto select models
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modelParam = queryParams.get('model');
    if (modelParam) {
      setFormInputs(prev => ({ ...prev, model: modelParam }));
    }
  }, [location, bikeOptions]);

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
      const payload = {
        data: {
          fullName: formInputs.fullName,
          phone: formInputs.phone,
          model: formInputs.model,
          city: formInputs.city,
          state: formInputs.state,
          pincode: formInputs.pincode
        }
      };

      const response = await fetch('https://backend.yaytech.in/api/inquiries/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok && resData.success !== false) {
        setMessage({
          type: 'success',
          text: 'Thank you! Your inquiry has been received.'
        });
        setFormInputs({ fullName: '', phone: '', model: '', city: '', state: '', pincode: '' });
        setTimeout(() => setMobileFormOpen(false), 1500);
      } else {
        setMessage({
          type: 'error',
          text: resData.message || 'Error submitting form. Please try again.'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
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
              bikeOptions={bikeOptions}
            />
          </div>

          <div style={{ marginLeft: 'auto', textAlign: 'right', maxWidth: '50%' }}>
            <div style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(18px)',
              transition: `opacity ${TRANSITION_MS * 0.6}ms ease, transform ${TRANSITION_MS * 0.6}ms ease`,
            }} />
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
          flexShrink: 0,
        }}>
          {heroSlides.map((s, i) => (
            <img key={i} src={s.image} alt="" style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              opacity: i === current ? 1 : 0,
              transition: `opacity ${TRANSITION_MS}ms ease`,
            }} />
          ))}

          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '54%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.45) 32%, transparent 108%)',
            pointerEvents: 'none',
          }} />

          {/* Enquire Button */}
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

        {/* Feature grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: '14px 12px 0',
        }}>
          {[
            { label: 'Services',  sub: 'with Exciting Offers', bg: '#111', color: '#fff', icon: '⚙️', route: '/services' },
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
              bikeOptions={bikeOptions}
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
          position: 'fixed', bottom: '30px', right: '30px', zIndex: 999,
          width: '64px', height: '64px', borderRadius: '50%', background: '#25d366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 28px rgba(37, 211, 102, 0.4)', cursor: 'pointer',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48">
          <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path>
          <path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path>
          <path fill="#fff" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z"></path>
        </svg>
      </a>

      <style>{`
        @media (max-width: 940px) {
          .desktop-hero { display: none !important; }
          .mobile-hero  { display: flex !important; }
        }
        @media (min-width: 941px) {
          .desktop-hero { display: block !important; }
          .mobile-hero  { display: none !important; }
        }
      `}</style>
    </>
  );
}