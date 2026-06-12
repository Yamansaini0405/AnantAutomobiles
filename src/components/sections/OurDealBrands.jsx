import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OurDealBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch bikes from your API
  useEffect(() => {
    fetch('https://backend.yaytech.in/api/bike-models/')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          // Filter out deleted items
          const activeBikes = resData.data.filter((bike) => !bike.isDeleted);
          setBikes(activeBikes);
        }
      })
      .catch((err) => console.error('Error fetching bike models:', err))
      .finally(() => setLoading(false));
  }, []);

  // Intersection Observer for fade-in entrance
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [loading]); // Re-run when loading finishes to catch the populated grid

  const Card = ({ bike, delay }) => {
    // Construct absolute backend image URL
    const imageUrl = bike.imageUrl.startsWith('http')
      ? bike.imageUrl
      : `https://backend.yaytech.in${bike.imageUrl}`;

    return (
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 20,
          textAlign: 'center',
          boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: `all 0.7s ease ${delay}ms`,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-10px) scale(1.04)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
        }}
      >
        <div style={{ width: '100%' }}>
          <img
            src={imageUrl}
            alt={bike.name}
            style={{
              width: '100%',
              height: 140,
              objectFit: 'contain'
            }}
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = 'https://placehold.co/240x140?text=No+Image';
            }}
          />

          <h3 
            style={{ 
              margin: '16px 0 0', 
              color: '#111', 
              fontSize: '18px',
              fontFamily: 'sans-serif',
              lineHeight: '1.3'
            }}
          >
            {bike.name}
          </h3>
        </div>

        <button
          onClick={() => {
            navigate('/', { replace: false });
            setTimeout(() => {
              const element = document.getElementById('book-your-dream-bike');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '12px 14px',
            borderRadius: 8,
            border: 'none',
            background: '#e11d48',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.2s'
          }}
        >
          Book Test Ride
        </button>
      </div>
    );
  };

  return (
    <section
      style={{
        backgroundImage: 'url(/images/bg1.jpg)',
        padding: '80px 5vw',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
        minHeight: '400px'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;700;800&display=swap');
      `}</style>

      {/* Background overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 1px),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")
          `,
          backgroundSize: '24px 24px, 200px 200px',
          pointerEvents: 'none',
          mixBlendMode: 'screen'
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          marginBottom: 60
        }}
      >
        <div
          style={{
            width: 180,
            height: 3,
            background: 'linear-gradient(to right, transparent, #ffffff88, transparent)',
            margin: '0 auto 28px'
          }}
        />

        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(36px, 6vw, 52px)',
            fontWeight: 900,
            margin: 0,
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}
        >
          Explore Hero Bikes
        </h2>

        <p style={{ opacity: 0.7, marginTop: 10 }}>
          Authorized Hero MotoCorp Dealer
        </p>
      </div>

      {/* Bikes CSS Grid Container */}
      {loading ? (
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, fontSize: '18px' }}>
          Loading Bike Fleet...
        </div>
      ) : (
        <div
          ref={sectionRef}
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 32,
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%'
          }}
        >
          {bikes.map((bike, i) => (
            <Card key={bike.id} bike={bike} delay={i * 80} />
          ))}
        </div>
      )}
    </section>
  );
}