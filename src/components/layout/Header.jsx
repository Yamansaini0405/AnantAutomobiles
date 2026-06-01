import { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Wrench, Package, Star, ArrowRight, ChevronRight, Settings, BookOpen, Shield, Zap, Phone, RotateCcw, Gift, HeadphonesIcon, ArrowDownCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BikePurchaseModal from '../BikePurchaseModal';

const BikeImage = ({ src, size = 80, large = false }) => (
  <img 
    src={src} 
    alt="Bike" 
    style={{ 
      width: large ? 260 : size, 
      height: 'auto', 
      objectFit: 'contain' 
    }} 
  />
);

// ─── Services Data ─────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 6,
    icon: '🏠',
    title: 'Doorstep Service',
    desc: 'Can\'t visit us? We come to you! Book a doorstep service and our mechanic will service your bike at your home or office.',
    price: 'Starting ₹699',
    duration: '2–3 hrs',
    highlights: ['Home Visit', 'No Extra Charges', 'Same Day Booking', 'Expert Mechanics'],
    color: '#fff5fb',
    accent: '#CC0066',
  },
  {
    id: 1,
    icon: '🔧',
    title: 'General Service',
    desc: 'Complete bike servicing including oil change, filter replacement, brake check, and full safety inspection by certified Hero mechanics.',
    price: 'Starting ₹499',
    duration: '2–3 hrs',
    highlights: ['Engine Oil Change', 'Air Filter Check', 'Brake Adjustment', 'Chain Lubrication'],
    color: '#fff5f5',
    accent: '#FF0000',
  },
  {
    id: 2,
    icon: '⚙️',
    title: 'Engine Overhaul',
    desc: 'Deep engine diagnostics and repair. Our expert technicians ensure your bike runs at peak performance with genuine Hero spare parts.',
    price: 'Starting ₹1,999',
    duration: '1–2 days',
    highlights: ['Complete Diagnostics', 'Genuine Spare Parts', 'Performance Tuning', '6-Month Warranty'],
    color: '#f5f5ff',
    accent: '#4444FF',
  },
  {
    id: 3,
    icon: '🛞',
    title: 'Tyre & Wheel',
    desc: 'Tyre replacement, puncture repair, wheel balancing and alignment. We stock all Hero-recommended tyre sizes.',
    price: 'Starting ₹199',
    duration: '30–60 min',
    highlights: ['Tyre Replacement', 'Puncture Repair', 'Wheel Balancing', 'Rim Straightening'],
    color: '#f5fff5',
    accent: '#00AA44',
  },
  {
    id: 4,
    icon: '🏍️',
    title: 'Hero JoyRide Service',
    desc: 'Complete doorstep servicing experience for all Hero bikes including pickup support, quick inspection, washing, and smooth performance tuning.',
    price: 'Starting ₹599',
    duration: '1–2 hrs',
    highlights: ['Free Pickup Support', 'Bike Wash', 'Performance Check', 'Quick Service'],
    color: '#fffdf5',
    accent: '#FF8800',
  },
  {
    id: 5,
    icon: '🎨',
    title: 'Denting & Painting',
    desc: 'Professional dent removal and custom painting with OEM color-matched paint. Restore your bike to showroom condition.',
    price: 'Starting ₹799',
    duration: '2–3 days',
    highlights: ['Dent Removal', 'OEM Color Match', 'Scratch Repair', 'Full Panel Painting'],
    color: '#f5faff',
    accent: '#0088CC',
  },
];

// ─── Explore Data (CONTAINS YOUR EXACT ORIGINAL CONTENT) ──────────────────────
const EXPLORE_SECTIONS = [
  {
    key: 'services',
    label: 'Services',
    icon: Wrench,
    color: '#FF0000',
    tagline: 'Expert care for your ride',
    items: SERVICES.map(service => ({
      icon: service.icon,
      title: service.title,
      desc: service.desc,
      path: '/services',
    })),
  },
  {
    key: 'parts',
    label: 'Parts',
    icon: Package,
    color: '#FF0000',
    tagline: 'Genuine OEM components',
    items: [
      { icon: Settings,    title: 'Engine Parts',    desc: 'Genuine engine components & assemblies',   path: '/parts/engine'    },
      { icon: Shield,      title: 'Brake & Clutch',  desc: 'Safety-critical brake & clutch systems',   path: '/parts/brake'     },
      { icon: Zap,         title: 'Electrical',      desc: 'OEM electrical parts & lighting',          path: '/parts/electrical'},
      { icon: Package,     title: 'Body Panels',     desc: 'Original body panels & covers',            path: '/parts/body'      },
      { icon: RotateCcw,   title: 'Tyres & Wheels',  desc: 'Recommended tyres for every model',        path: '/parts/tyres'     },
      { icon: Star,        title: 'Order Online',    desc: 'Get parts delivered to your doorstep',     path: '/parts/order'     },
    ],
  },
  {
    key: 'accessories',
    label: 'Accessories',
    icon: Star,
    color: '#FF0000',
    tagline: 'Personalise your machine',
    items: [
      { icon: Shield,         title: 'Safety Gear',     desc: 'Helmets, gloves & riding gear',       path: '/accessories/safety'      },
      { icon: Star,           title: 'Performance',     desc: 'Exhaust, air filters & upgrades',     path: '/accessories/performance' },
      { icon: Gift,           title: 'Merchandise',     desc: 'Hero branded apparel & collectibles', path: '/accessories/merchandise' },
      { icon: Package,        title: 'Bags & Carriers', desc: 'Saddle bags, tank bags & more',       path: '/accessories/bags'        },
      { icon: Zap,            title: 'Tech & Gadgets',  desc: 'GPS, dash cams & smart accessories',  path: '/accessories/tech'        },
      { icon: HeadphonesIcon, title: 'Custom Styling',  desc: 'Decals, wraps & visual upgrades',     path: '/accessories/styling'     },
    ],
  },
];

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'New Launch',  key: 'new-launch' },
  { label: '100 CC',      key: '100cc'      },
  { label: '125 CC',      key: '125cc'      },
  { label: 'Premium',     key: 'premium'    },
  { label: 'Explore All', key: 'all'        },
];

const BIKES = {
  'new-launch': [
    { name: 'XPULSE 210 DAKAR EDITION', cc: 210, badge: 'NEW',             badgeRed: true,  specs: ['4 Stroke 4 Valve Single Cylinder Liquid Cooled DOHC', '280mm | 270mm Rear and Front suspension travel'], image: 'https://imgd.aeplcdn.com/1056x594/n/ldh00fb_1809009.jpg?q=80' },
    { name: 'XTREME 250R',              cc: 250, badge: 'PREMIA EXCLUSIVE', badgeRed: false, specs: ['249cc Single Cylinder Liquid Cooled', 'USD Front Fork, Monoshock Rear'], image: 'https://imgd.aeplcdn.com/1056x594/n/lx6daib_1891039.png?q=80' },
    { name: 'XPULSE 210',               cc: 210, badge: 'PREMIA EXCLUSIVE', badgeRed: false, specs: ['210cc Single Cylinder DOHC', 'Long Travel Suspension'], image: 'https://imgd.aeplcdn.com/1056x594/n/ldh00fb_1809009.jpg?q=80' },
    { name: 'HARLEY-DAVIDSON X440 T',   cc: 440, badge: 'NEW',             badgeRed: true,  specs: ['440cc Single Cylinder Liquid Cooled', 'USD Forks, Dual Channel ABS'], image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/213667/x440-t-right-side-view-4.png?isig=0' },
  ],
  '100cc': [
    { name: 'HF 100',    cc: 97.2, badge: null, specs: ['97.2cc Air Cooled Engine', 'Drum Brakes'], image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/1/versions/--hf-100-obd-2b1744803664892.jpg?q=80' },
    { name: 'HF DELUXE', cc: 97.2, badge: null, specs: ['97.2cc Air Cooled Engine', 'Self Start Available'], image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/212719/hf-deluxe-right-side-view-2.png?isig=0' },
  ],
  '125cc': [
    { name: 'GLAMOUR',        cc: 124.7, badge: null, specs: ['124.7cc Fi Engine', 'USB Charging Port'], image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/1/versions/--drum-obd-2b1744873987453.jpg?q=80' },
    { name: 'SUPER SPLENDOR', cc: 124.7, badge: null, specs: ['124.7cc Air Cooled Engine', 'i3S Technology'], image: 'https://imgd.aeplcdn.com/664x374/bw/models/hero-super-splendor-electric-start-85.jpg?20190103151915&q=80' },
  ],
  'premium': [
    { name: 'XTREME 160R 4V', cc: 163, badge: null, specs: ['163cc 4-Valve Engine', 'Dual Channel ABS'], image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/150591/xtreme-160r-4v-right-side-view-2.png?isig=0' },
    { name: 'MAVRICK 440',    cc: 440, badge: null, specs: ['440cc Liquid Cooled', 'Traction Control'], image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/169219/mavrick-440-right-side-view-3.png?isig=0' },
  ],
  'all': [
    { name: 'HF 100',         cc: 97.2,  badge: null, specs: ['97.2cc Air Cooled Engine'], image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/1/versions/--hf-100-obd-2b1744803664892.jpg?q=80' },
    { name: 'GLAMOUR',        cc: 124.7, badge: null, specs: ['124.7cc Fi Engine']       , image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/1/versions/--drum-obd-2b1744873987453.jpg?q=80' },
    { name: 'XTREME 160R 4V', cc: 163,   badge: null, specs: ['163cc 4-Valve Engine']    , image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/150591/xtreme-160r-4v-right-side-view-2.png?isig=0' },
    { name: 'XPULSE 210',     cc: 210,   badge: null, specs: ['210cc DOHC Engine']       , image: 'https://imgd.aeplcdn.com/1056x594/n/ldh00fb_1809009.jpg?q=80' },
    { name: 'XTREME 250R',    cc: 250,   badge: null, specs: ['249cc Liquid Cooled']     , image: 'https://imgd.aeplcdn.com/1056x594/n/lx6daib_1891039.png?q=80' },
    { name: 'MAVRICK 440',    cc: 440,   badge: null, specs: ['440cc Liquid Cooled']     , image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/169219/mavrick-440-right-side-view-3.png?isig=0' },
  ],
};

export default function Header() {
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [motoOpen, setMotoOpen]             = useState(false);
  const [exploreOpen, setExploreOpen]       = useState(false);
  const [activeExplore, setActiveExplore]   = useState('services');
  const [activeCategory, setActiveCategory] = useState('new-launch');
  const [hoveredBike, setHoveredBike]       = useState(null);
  const [selectedPreviewBike, setSelectedPreviewBike] = useState(null);
  const [windowWidth, setWindowWidth]       = useState(() => window.innerWidth);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedBike, setSelectedBike]     = useState(null);
  const { isAuthenticated } = useAuth();
  const headerRef = useRef(null);

  const openBikePurchaseModal = (bike) => {
    setSelectedBike(bike);
    setPurchaseModalOpen(true);
  };

  const closeBikePurchaseModal = () => {
    setPurchaseModalOpen(false);
    setSelectedBike(null);
  };

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMotoOpen(false);
        setExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isSmUp = windowWidth >= 640;
  const isLgUp = windowWidth >= 1024;

  const bikes   = BIKES[activeCategory] ?? [];
  const preview = hoveredBike ?? selectedPreviewBike ?? BIKES['new-launch'][0];

  const navItems = [
    { name: 'Home',     path: '/'             },
    { name: 'Buy Bike', path: '/public-bikes' },
    { name: 'Services', path: '/services'     },
    { name: 'Offers',   path: '/offers'       },
  ];

  const authAction = isAuthenticated
    ? { label: 'Dashboard', path: '/dashboard' }
    : { label: 'Login',     path: '/login'     };

  return (
    <header
      ref={headerRef}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* ── Navbar ── */}
      <div style={{
        maxWidth: '100%', margin: '0 auto',
        padding: isSmUp ? '0 2rem' : '0 1rem',
        display: 'flex', alignItems: 'center',
        height: '64px', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', textDecoration:'none', flexShrink:0, marginRight:'1.5rem' }}>
          <img src="/Logo_header.jpg" alt="Anant Automobiles Logo" style={{ height:'50px', width:'auto', objectFit:'contain' }} />
        </Link>

        {/* Desktop Nav */}
        {isLgUp && (
          <nav style={{ display:'flex', alignItems:'stretch', gap:'0', flexShrink:0, flex:1, height:'64px' }}>
            {navItems.map((item) => (
              <NavLink key={item.name} to={item.path}
                style={({ isActive }) => ({
                  display:'inline-flex', alignItems:'center',
                  padding:'0 18px', fontSize:'15px', fontWeight:600,
                  textDecoration:'none', color: isActive ? '#111' : '#444',
                  borderBottom: isActive ? '3px solid #FF0000' : '3px solid transparent',
                  transition:'all 150ms ease',
                })}
              >
                {item.name}
              </NavLink>
            ))}

            <button
              onClick={() => { setMotoOpen(o => !o); setActiveCategory('new-launch'); setHoveredBike(null); setSelectedPreviewBike(BIKES['new-launch'][0]); setExploreOpen(false); }}
              style={{
                display:'inline-flex', alignItems:'center',
                padding:'0 18px', fontSize:'15px',
                fontWeight: motoOpen ? 700 : 600,
                color: motoOpen ? '#FF0000' : '#444',
                background:'none', border:'none',
                borderBottom: motoOpen ? '3px solid #FF0000' : '3px solid transparent',
                cursor:'pointer', transition:'all 150ms ease', outline:'none',
              }}
            >
              Motorcycles
            </button>

            {/* ── Explore Button ── */}
            <button
              onClick={() => { setExploreOpen(o => !o); setMotoOpen(false); setActiveExplore('services'); }}
              style={{
                display:'inline-flex', alignItems:'center', gap:'5px',
                padding:'0 18px', fontSize:'15px',
                fontWeight: exploreOpen ? 700 : 600,
                color: exploreOpen ? '#FF0000' : '#444',
                background:'none', border:'none',
                borderBottom: exploreOpen ? '3px solid #FF0000' : '3px solid transparent',
                cursor:'pointer', transition:'all 150ms ease', outline:'none',
              }}
            >
              Explore
              <span style={{
                fontSize: '10px',
                transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease',
                display: 'inline-block',
                marginTop: '1px',
              }}>▼</span>
            </button>
          </nav>
        )}

        {isSmUp && (
          <button
                onClick={() => openBikePurchaseModal(preview)}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1rem', padding: '11px 36px', alignSelf: 'flex-start',
                  border: '1.5px solid #FF0000', background: 'transparent',
                  color: '#FF0000', fontWeight: 700, fontSize: '13px',
                  letterSpacing: '1.5px', textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'all 150ms ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF0000'; }}
              >
                Buy Bike
              </button>
        )}

        {!isSmUp && (
          <button onClick={() => setMobileOpen(o => !o)}
            style={{ width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center', border:'none', background:'transparent', cursor:'pointer', color: mobileOpen ? '#FF0000' : '#444' }}
          >
            {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        )}
      </div>

      {/* ── Exact Matching Explore Mega Dropdown ── */}
      {exploreOpen && isLgUp && (() => {
        const section = EXPLORE_SECTIONS.find(s => s.key === activeExplore);
        return (
          <div style={{
            position: 'absolute', top: '64px', left: 0, right: 0,
            display: 'flex',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            zIndex: 999,
            height: '460px',
            background: '#ffffff',
            borderTop: '1px solid #eaeaea',
          }}>
            {/* LEFT SIDEBAR — Pitch Black Layout Container */}
            <div style={{
              width: '280px', flexShrink: 0,
              background: '#000000',
              display: 'flex', flexDirection: 'column',
              paddingTop: '20px',
              position: 'relative',
            }}>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '40px' }}>
                {EXPLORE_SECTIONS.map((sec) => {
                  const active = activeExplore === sec.key;
                  return (
                    <button
                      key={sec.key}
                      onMouseEnter={() => setActiveExplore(sec.key)}
                      style={{
                        width: '100%',
                        display: 'block',
                        padding: '16px 36px',
                        border: 'none', 
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        background: 'transparent',
                        color: '#ffffff',
                        fontSize: '18px', 
                        fontWeight: active ? '700' : '400',
                        cursor: 'pointer', 
                        textAlign: 'left',
                        transition: 'all 150ms ease', 
                        outline: 'none',
                        position: 'relative',
                        textDecoration: active ? 'underline' : 'none',
                        textUnderlineOffset: '6px',
                        textDecorationThickness: '2px',
                      }}
                    >
                      {sec.label}
                    </button>
                  );
                })}
              </div>

              {/* Scroll For More Indicator */}
              <div style={{ 
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '16px 36px', 
                background: '#000000',
                display: 'flex', alignItems: 'center', gap: '8px',
                color: 'rgba(255,255,255,0.4)', fontSize: '11px',
                fontWeight: '600', letterSpacing: '0.5px',
                borderTop: '1px solid rgba(255,255,255,0.08)'
              }}>
                <ArrowDownCircle size={14} color="rgba(255,255,255,0.4)" />
                <span>Scroll For More</span>
              </div>
            </div>

            {/* RIGHT MAIN CONTENT — Clean 3-Column Content Grid */}
            <div style={{
              flex: 1,
              background: '#ffffff',
              padding: '40px 50px',
              overflowY: 'auto',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                columnGap: '40px',
                rowGap: '32px',
              }}>
                {section?.items.map((item) => {
                  const ItemIcon = typeof item.icon === 'string' ? null : item.icon;
                  return (
                    <Link
                      key={item.title}
                      to={item.path}
                      onClick={() => setExploreOpen(false)}
                      style={{
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        textDecoration: 'none',
                        background: 'transparent',
                      }}
                    >
                      {/* Icon + Capitalized Bold Title Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        {typeof item.icon === 'string' ? (
                          <span style={{ fontSize: '24px' }}>{item.icon}</span>
                        ) : (
                          <ItemIcon size={20} color="#111111" strokeWidth={1.75} />
                        )}
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '700', 
                          color: '#111111', 
                          letterSpacing: '0.3px',
                          textTransform: 'uppercase'
                        }}>
                          {item.title}
                        </div>
                      </div>
                      
                      {/* Muted regular description text */}
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#4b5563', 
                        lineHeight: '1.5',
                        fontWeight: '400',
                        maxWidth: '90%'
                      }}>
                        {item.desc}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Motorcycles Mega Dropdown ── */}
      {motoOpen && isLgUp && (
        <div style={{
          position: 'absolute', top: '64px', left: 0, right: 0,
          display: 'flex',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
          zIndex: 999,
          height: '420px',
        }}>

          {/* LEFT — dark categories */}
          <div style={{
            width: '230px', flexShrink: 0,
            background: '#1a1a1a',
            display: 'flex', flexDirection: 'column',
          }}>
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onMouseEnter={() => { setActiveCategory(cat.key); setHoveredBike(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 26px',
                    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: active ? '#FF0000' : 'transparent',
                    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                    fontSize: '15px', fontWeight: active ? 800 : 500,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 120ms ease', outline: 'none',
                  }}
                >
                  {cat.label}
                  {active && <span style={{ fontSize: '20px', lineHeight: 1 }}>›</span>}
                </button>
              );
            })}

            <div style={{ marginTop: 'auto', padding: '20px 20px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', background: '#FF0000', borderRadius: '0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <span style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>↗</span>
              </div>
              <div style={{ opacity: 0.3 }}><BikeImage src={BIKES['new-launch'][0].image} size={80}/></div>
            </div>
          </div>

          {/* MIDDLE — bike rows */}
          <div style={{
            width: '380px', flexShrink: 0,
            background: '#f2f2f2',
            borderRight: '1px solid #ddd',
            display: 'flex', overflowY: 'auto',
          }}>
            <div style={{ width: '26px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
              {bikes.map((bike, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1, minHeight: '80px',
                    background: bike.badge ? (bike.badgeRed ? '#FF0000' : '#222') : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {bike.badge && (
                    <span style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                      fontSize: '8px', fontWeight: 800,
                      letterSpacing: '1px', textTransform: 'uppercase',
                      color: '#fff',
                    }}>
                      {bike.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }}>
              {bikes.map((bike) => {
                const isHov = hoveredBike?.name === bike.name;
                return (
                  <button
                    key={bike.name}
                    onMouseEnter={() => {
                      setHoveredBike(bike);
                      setSelectedPreviewBike(bike);
                    }}
                    onMouseLeave={() => setHoveredBike(null)}
                    style={{
                      display: 'flex', alignItems: 'center',
                      padding: '12px 16px',
                      background: isHov ? '#fff' : 'transparent',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      textDecoration: 'none',
                      transition: 'background 120ms ease',
                      minHeight: '80px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: '100px', height: '60px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isHov ? '#f8f8f8' : '#eaeaea',
                      borderRadius: '4px', marginRight: '14px',
                    }}>
                      <BikeImage src={bike.image} size={85}/>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '14px', fontWeight: 800,
                        color: '#111', lineHeight: 1.2,
                        fontStyle: 'italic', letterSpacing: '-0.3px',
                      }}>
                        {bike.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        {bike.cc} <sup style={{ fontSize: '9px' }}>CC</sup> engine
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — preview */}
          <div style={{
            flex: 1,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            padding: '2.5rem 3rem',
            overflow: 'hidden',
          }}>
            <div style={{
              fontSize: 'clamp(24px, 3vw, 42px)',
              fontWeight: 900, fontStyle: 'italic',
              color: '#d0d0d0', lineHeight: 1.05,
              letterSpacing: '-1px', textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}>
              {preview.name}
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1 }}>
              <div style={{ flex: '1 1 50%' }}>
                <BikeImage src={preview.image} large />
              </div>

              <div style={{ flex: '1 1 50%' }}>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 900, color: '#FF0000', lineHeight: 1 }}>
                    {preview.cc}
                  </span>
                  <sup style={{ fontSize: '13px', fontWeight: 800, color: '#FF0000', marginLeft: '4px', verticalAlign: 'super' }}>
                    CC
                  </sup>
                </div>

                {preview.specs?.map((sp, i) => (
                  <div key={i}>
                    <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                    <div style={{ fontSize: '12.5px', color: '#555' }}>
                      {/^\d/.test(sp)
                        ? <><span style={{ fontWeight: 800, color: '#FF0000', fontSize: '16px' }}>{sp.split(' ')[0]}</span>
                          <span style={{ color: '#888', fontSize: '12px', marginLeft: '4px' }}>{sp.split(' ').slice(1).join(' ')}</span></>
                        : sp
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => openBikePurchaseModal(preview)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '1.5rem', padding: '11px 36px', alignSelf: 'flex-start',
                border: '1.5px solid #FF0000', background: 'transparent',
                color: '#FF0000', fontWeight: 700, fontSize: '13px',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'all 150ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF0000'; }}
            >
              Buy Bike
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile Menu ── */}
      {mobileOpen && !isLgUp && (
        <div style={{ padding: '0.75rem', background: '#fff', borderTop: '1px solid rgba(255,0,0,0.2)' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[...navItems, { name: 'Motorcycles', path: '/public-bikes' }, { name: 'Services', path: '/services' }, { name: 'Parts', path: '/parts' }, { name: 'Accessories', path: '/accessories' }].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '15px', fontWeight: 600, padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: 'rgba(0,0,0,0.75)', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF0000'; e.currentTarget.style.background = 'rgba(255,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(0,0,0,0.75)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <button
              onClick={() => openBikePurchaseModal(preview)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '1.5rem', padding: '11px 36px', alignSelf: 'flex-start',
                border: '1.5px solid #FF0000', background: 'transparent',
                color: '#FF0000', fontWeight: 700, fontSize: '13px',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'all 150ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF0000'; }}
            >
              Buy Bike
            </button>
        </div>
      )}

      {/* Bike Purchase Modal */}
      {purchaseModalOpen && selectedBike && (
        <BikePurchaseModal bike={selectedBike} onClose={closeBikePurchaseModal} />
      )}
    </header>
  );
}