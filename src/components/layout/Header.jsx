import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Star, ArrowDownCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BikePurchaseModal from '../BikePurchaseModal';

const BikeImage = ({ src, size = 80, large = false }) => (
  <img 
    src={src} 
    alt="Asset" 
    style={{ 
      width: large ? 260 : size, 
      height: 'auto', 
      objectFit: 'contain' 
    }} 
  />
);

const CATEGORIES = [
  { label: 'New Launch',  key: 'new-launch' },
  { label: '100 CC',      key: '100cc'      },
  { label: '125 CC',      key: '125cc'      },
  { label: 'Premium',     key: 'premium'    },
  { label: 'Explore All', key: 'all'        },
];

export default function Header() {
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [motoOpen, setMotoOpen]             = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('new-launch');
  const [hoveredBike, setHoveredBike]       = useState(null);
  const [selectedPreviewBike, setSelectedPreviewBike] = useState(null);
  
  // Accessories state hooks
  const [accessoriesList, setAccessoriesList] = useState([]);
  const [hoveredAccessory, setHoveredAccessory] = useState(null);
  const [selectedPreviewAccessory, setSelectedPreviewAccessory] = useState(null);

  const [windowWidth, setWindowWidth]       = useState(() => window.innerWidth);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedBike, setSelectedBike]     = useState(null);
  const { isAuthenticated } = useAuth();
  const headerRef = useRef(null);
  const navigate = useNavigate();

  const [backendBikes, setBackendBikes] = useState({
    'new-launch': [],
    '100cc': [],
    '125cc': [],
    'premium': [],
    'all': []
  });

  // Fetch Motorcycles
  useEffect(() => {
    fetch('http://backend.yaytech.in/api/bike-models/')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          const fetchedList = resData.data.filter((b) => !b.isDeleted).map((b) => ({
            name: b.name,
            cc: b.engineCapacity || 110,
            badge: b.launchYear >= 2026 ? 'NEW' : null,
            badgeRed: true,
            specs: [`${b.fuelType || 'Petrol'} FI Engine`, `Mileage: ${b.mileage || 50} kmpl`],
            image: b.imageUrl.startsWith('http') ? b.imageUrl : `http://backend.yaytech.in${b.imageUrl}`,
            category: (b.category || 'commuter').toLowerCase().trim()
          }));

          const sortedCategories = {
            'new-launch': fetchedList.filter(b => b.badge === 'NEW'),
            '100cc': fetchedList.filter(b => b.cc <= 110),
            '125cc': fetchedList.filter(b => b.cc > 110 && b.cc <= 150),
            'premium': fetchedList.filter(b => b.cc > 150),
            'all': fetchedList
          };

          setBackendBikes(sortedCategories);
          
          if (sortedCategories['new-launch'].length > 0) {
            setSelectedPreviewBike(sortedCategories['new-launch'][0]);
          } else if (fetchedList.length > 0) {
            setSelectedPreviewBike(fetchedList[0]);
          }
        }
      })
      .catch((err) => console.error('Error fetching dynamic header fleet:', err));
  }, []);

  // Fetch Dynamic Accessories
  useEffect(() => {
    fetch('http://backend.yaytech.in/api/accessories')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          const validAccessories = resData.data
            .filter((item) => !item.isDeleted)
            .map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              stock: item.quantityInStock,
              remark: item.remark || 'Genuine Rider Gear',
              image: item.imageUrl.startsWith('http') ? item.imageUrl : `http://backend.yaytech.in${item.imageUrl}`
            }));
          setAccessoriesList(validAccessories);
          if (validAccessories.length > 0) {
            setSelectedPreviewAccessory(validAccessories[0]);
          }
        }
      })
      .catch((err) => console.error('Error downloading dashboard accessories:', err));
  }, []);

  const openBikePurchaseModal = (bike) => {
    setMotoOpen(false);
    setAccessoriesOpen(false);
    setMobileOpen(false);
    navigate(`/?model=${encodeURIComponent(bike.name)}`);
    setTimeout(() => {
      const element = document.getElementById('book-your-dream-bike');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 250);
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
        setAccessoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isSmUp = windowWidth >= 640;
  const isLgUp = windowWidth >= 1024;

  const bikes = backendBikes[activeCategory] || [];
  const preview = hoveredBike || selectedPreviewBike || (bikes.length > 0 ? bikes[0] : { name: 'Hero Bike', cc: 110, specs: [], image: '' });
  const accessoryPreview = hoveredAccessory || selectedPreviewAccessory || { name: 'Accessory', price: 0, remark: '', image: '' };

  const navItems = [
    { name: 'Home',     path: '/'             },
    { name: 'Buy Bike', path: '/public-bikes' },
    { name: 'Services', path: '/services'     },
    { name: 'Offers',   path: '/offers'       },
  ];

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
              onClick={() => { setMotoOpen(o => !o); setActiveCategory('new-launch'); setHoveredBike(null); if(backendBikes['new-launch'].length > 0) { setSelectedPreviewBike(backendBikes['new-launch'][0]); } setAccessoriesOpen(false); }}
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

            {/* ── Accessories Interactive Button ── */}
            <button
              onClick={() => { setAccessoriesOpen(o => !o); setMotoOpen(false); }}
              style={{
                display:'inline-flex', alignItems:'center', gap:'5px',
                padding:'0 18px', fontSize:'15px',
                fontWeight: accessoriesOpen ? 700 : 600,
                color: accessoriesOpen ? '#FF0000' : '#444',
                background:'none', border:'none',
                borderBottom: accessoriesOpen ? '3px solid #FF0000' : '3px solid transparent',
                cursor:'pointer', transition:'all 150ms ease', outline:'none',
              }}
            >
              Accessories
              <span style={{
                fontSize: '10px',
                transform: accessoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease',
                display: 'inline-block',
                marginTop: '1px',
              }}>▼</span>
            </button>
          </nav>
        )}

        {isSmUp && (
          <button
            onClick={() => preview.name && openBikePurchaseModal(preview)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '11px 36px', alignSelf: 'center',
              border: '1.5px solid #FF0000', background: 'transparent',
              color: '#FF0000', fontWeight: 700, fontSize: '13px',
              letterSpacing: '1.5px', textTransform: 'uppercase',
              transition: 'all 150ms ease', cursor: 'pointer',
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

      {/* ── Accessories Dynamic Mega Dropdown ── */}
      {accessoriesOpen && isLgUp && (
        <div style={{
          position: 'absolute', top: '64px', left: 0, right: 0,
          display: 'flex', boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
          zIndex: 999, height: '420px', background: '#fff'
        }}>
          
          {/* LEFT SIDEBAR — Dynamic scroll column list */}
          <div style={{ width: '380px', background: '#f2f2f2', overflowY: 'auto', borderRight: '1px solid #ddd', position: 'relative' }}>
            {accessoriesList.length === 0 ? (
              <div style={{ padding: '20px', color: '#666', fontSize: '14px', textAlign:'center' }}>No Accessories Registered.</div>
            ) : (
              accessoriesList.map((item, idx) => {
                const isHov = hoveredAccessory?.id === item.id;
                return (
                  <button 
                    key={idx} 
                    onMouseEnter={() => { setHoveredAccessory(item); setSelectedPreviewAccessory(item); }}
                    onMouseLeave={() => setHoveredAccessory(null)}
                    onClick={() => { setAccessoriesOpen(false); navigate('/public-bikes'); }}
                    style={{ 
                      width: '100%', display: 'flex', alignItems: 'center', padding: '14px 20px', 
                      background: isHov ? '#fff' : 'transparent', border: 'none', 
                      borderBottom: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'background 120ms ease'
                    }}
                  >
                    <div style={{ 
                      width: '90px', height: '60px', background: isHov ? '#f8f8f8' : '#eaeaea', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', borderRadius: '4px' 
                    }}>
                      <BikeImage src={item.image} size={70} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#111' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#FF0000', fontWeight: 700, marginTop: '2px' }}>₹{item.price.toLocaleString('en-IN')}</div>
                    </div>
                  </button>
                );
              })
            )}
            <div style={{ position: 'sticky', bottom: 0, background: '#e5e7eb', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '11px', fontWeight: 600 }}>
              <ArrowDownCircle size={14} />
              <span>Scroll For Full Collection</span>
            </div>
          </div>

          {/* RIGHT PREVIEW LAYER — Item showcases block */}
          <div style={{ flex: 1, padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#111', textTransform: 'uppercase', marginBottom: '1rem', fontStyle: 'italic', color: '#d0d0d0' }}>
              {accessoryPreview.name || 'Hero Gear'}
            </div>
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flex: 1 }}>
              <div style={{ flex: '1 1 45%', display: 'flex', justifyContent: 'center' }}>
                {accessoryPreview.image && <BikeImage src={accessoryPreview.image} large />}
              </div>
              <div style={{ flex: '1 1 55%', textAlign: 'left' }}>
                <div style={{ fontSize: '13px', color: '#FF0000', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>Authorized Showroom Price</div>
                <div style={{ fontSize: '42px', fontWeight: 900, color: '#111', margin: '6px 0 12px' }}>
                  Extra ₹{accessoryPreview.price?.toLocaleString('en-IN')}
                </div>
                <div style={{ height: '1px', background: '#e5e7eb', margin: '12px 0' }} />
                <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                  {accessoryPreview.remark || 'Premium design architecture calibrated explicitly to perfectly complement your signature structural ride.'}
                </div>
                {accessoryPreview.stock !== undefined && (
                  <div style={{ fontSize: '12px', color: '#222', marginTop: '10px', fontWeight: 600 }}>
                    ⚡ Available In Stock: {accessoryPreview.stock} Units left
                  </div>
                )}
              </div>
            </div>
            {/* <button 
              onClick={() => { setAccessoriesOpen(false); navigate('/public-bikes'); }}
              style={{ padding: '12px 36px', background: '#111', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FF0000'}
              onMouseLeave={e => e.currentTarget.style.background = '#111'}
            >
              Explore In Store Catalog
            </button> */}
          </div>

        </div>
      )}

      {/* ── Motorcycles Mega Dropdown ── */}
      {motoOpen && isLgUp && (
        <div style={{
          position: 'absolute', top: '64px', left: 0, right: 0,
          display: 'flex', boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
          zIndex: 999, height: '420px',
        }}>

          {/* LEFT — dark categories */}
          <div style={{ width: '230px', flexShrink: 0, background: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onMouseEnter={() => { setActiveCategory(cat.key); setHoveredBike(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 26px', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: active ? '#FF0000' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                    fontSize: '15px', fontWeight: active ? 800 : 500, cursor: 'pointer', textAlign: 'left',
                    transition: 'all 120ms ease', outline: 'none',
                  }}
                >
                  {cat.label}
                  {active && <span style={{ fontSize: '20px', lineHeight: 1 }}>›</span>}
                </button>
              );
            })}
          </div>

          {/* MIDDLE — bike rows */}
          <div style={{ width: '380px', flexShrink: 0, background: '#f2f2f2', borderRight: '1px solid #ddd', display: 'flex', overflowY: 'auto' }}>
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
                      writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)',
                      fontSize: '8px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff',
                    }}>
                      {bike.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }}>
              {bikes.map((bike, idx) => {
                const isHov = hoveredBike?.name === bike.name;
                return (
                  <button
                    key={idx}
                    onMouseEnter={() => { setHoveredBike(bike); setSelectedPreviewBike(bike); }}
                    onMouseLeave={() => setHoveredBike(null)}
                    onClick={() => openBikePurchaseModal(bike)}
                    style={{
                      display: 'flex', alignItems: 'center', padding: '12px 16px',
                      background: isHov ? '#fff' : 'transparent', borderBottom: '1px solid rgba(0,0,0,0.06)',
                      textDecoration: 'none', transition: 'background 120ms ease', minHeight: '80px',
                      border: 'none', cursor: 'pointer', width: '100%'
                    }}
                  >
                    <div style={{
                      width: '100px', height: '60px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isHov ? '#f8f8f8' : '#eaeaea', borderRadius: '4px', marginRight: '14px',
                    }}>
                      {bike.image && <BikeImage src={bike.image} size={85}/>}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#111', lineHeight: 1.2, fontStyle: 'italic', letterSpacing: '-0.3px' }}>
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
          <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', padding: '2.5rem 3rem', overflow: 'hidden' }}>
            <div style={{ fontSize: 'clamp(24px, 3vw, 42px)', fontWeight: 900, fontStyle: 'italic', color: '#d0d0d0', lineHeight: 1.05, letterSpacing: '-1px', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'left' }}>
              {preview.name}
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1 }}>
              <div style={{ flex: '1 1 50%' }}>
                {preview.image && <BikeImage src={preview.image} large />}
              </div>

              <div style={{ flex: '1 1 50%', textAlign: 'left' }}>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 900, color: '#FF0000', lineHeight: 1 }}>{preview.cc}</span>
                  <sup style={{ fontSize: '13px', fontWeight: 800, color: '#FF0000', marginLeft: '4px', verticalAlign: 'super' }}>CC</sup>
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
                letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'all 150ms ease', cursor: 'pointer',
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
            {[...navItems, { name: 'Motorcycles', path: '/public-bikes' }, { name: 'Accessories', path: '/public-bikes' }].map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '15px', fontWeight: 600, padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: 'rgba(0,0,0,0.75)', textDecoration: 'none', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF0000'; e.currentTarget.style.background = 'rgba(255,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(0,0,0,0.75)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => preview.name && openBikePurchaseModal(preview)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginTop: '1.5rem', padding: '11px 36px', alignSelf: 'flex-start',
              border: '1.5px solid #FF0000', background: 'transparent',
              color: '#FF0000', fontWeight: 700, fontSize: '13px',
              letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'all 150ms ease', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF0000'; }}
          >
            Buy Bike
          </button>
        </div>
      )}

      {purchaseModalOpen && selectedBike && (
        <BikePurchaseModal bike={selectedBike} onClose={closeBikePurchaseModal} />
      )}
    </header>
  );
}