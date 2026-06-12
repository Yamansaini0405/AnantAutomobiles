import { useEffect, useRef, useState } from 'react';

export default function CustomerGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    // Replace 'YOUR_BEARER_TOKEN_HERE' with your active token string
    const token = 'YOUR_BEARER_TOKEN_HERE';

    fetch('https://backend.yaytech.in/api/gallery', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          setPhotos(resData.data);
        }
      })
      .catch((err) => console.error('Error synchronizing gallery items:', err))
      .finally(() => setLoading(false));
  }, []);

  // Infinite Auto-Scrolling Engine Loop
  useEffect(() => {
    if (loading || photos.length <= 1) return;

    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 4500); // Transitions to the next image seamlessly every 4.5 seconds

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [loading, photos]);

  return (
    <section
      style={{
        background: '#ffffff',
        padding: '60px 0 80px 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #e2e8f0'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Space+Grotesk:wght@700&display=swap');
        
        /* Premium Crossfade Animation Structure */
        .slideshow-track {
          position: relative;
          width: 100%;
          height: clamp(320px, 60vh, 550px);
          border-radius: 24px;
          overflow: hidden;
          background: #f1f5f9;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
        }

        .slide-layer {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), visibility 1.2s;
          display: flex;
          align-items: flex-end;
        }

        .slide-layer.active {
          opacity: 1;
          visibility: visible;
          z-index: 10;
        }

        /* Subtle scaling on active image setup */
        .slide-layer.active .slide-img {
          transform: scale(1.02);
        }

        .slide-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 5s ease-out;
        }

        /* Micro-indicator bars navigation setup */
        .indicator-bar {
          height: 4px;
          background: rgba(15, 23, 42, 0.15);
          border-radius: 10px;
          flex: 1;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .indicator-bar.active {
          background: #ef4444;
        }
      `}</style>

      {/* Synchronized Clean Section Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto 36px',
          padding: '0 24px',
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', letterSpacing: '1.5px', marginBottom: '8px', textTransform: 'uppercase' }}>
          CELEBRATING OUR BIKE FAMILY
        </div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(32px, 5vw, 44px)',
            fontWeight: 700,
            margin: 0,
            letterSpacing: '-1.5px',
            color: '#0f172a'
          }}
        >
          Happy Deliveries
        </h2>
      </div>

      {/* Full-Width Auto Slider Container Matrix */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', padding: '100px 0' }}>
            <div style={{ width: 28, height: 28, border: '2.5px solid #e2e8f0', borderTopColor: '#ef4444', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            <p>Loading handover celebrations...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : photos.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 0', border: '1px dashed #e2e8f0', borderRadius: 20 }}>No delivery photos available currently.</div>
        ) : (
          <>
            <div className="slideshow-track">
              {photos.map((item, index) => {
                const absoluteImgUrl = item.imageUrl.startsWith('http')
                  ? item.imageUrl
                  : `https://backend.yaytech.in${item.imageUrl}`;

                const deliveryDate = new Date(item.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });

                return (
                  <div
                    key={item.id}
                    className={`slide-layer ${index === activeIndex ? 'active' : ''}`}
                  >
                    {/* Absolute Presentation Layer Image */}
                    <img
                      className="slide-img"
                      src={absoluteImgUrl}
                      alt={item.title || "Hero Delivery Frame"}
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/1200x600?text=Delivery+Celebration+Moment';
                      }}
                    />

                    {/* Dark Premium Radial Mask Layer for Metadata Text Contrast */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(15, 23, 42, 0.85) 100%)',
                      zIndex: 11
                    }} />

                    {/* Floating Text Meta Board */}
                    <div style={{
                      position: 'relative',
                      zIndex: 12,
                      padding: 'clamp(24px, 5vw, 48px)',
                      width: '100%',
                      color: '#ffffff'
                    }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ff7676', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                        🔑 Official Handover Complete
                      </div>
                      
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 700, marginBottom: '6px', lineHeight: '1.2' }}>
                        {item.title?.trim() || "Welcoming a New Ride"}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}>
                        <span>📅 Delivery Logged:</span>
                        <span style={{ color: '#ffffff', fontWeight: 600 }}>{deliveryDate}</span>
                      </div>

                      {item.description && (
                        <p style={{ marginTop: '12px', fontSize: '14px', color: '#94a3b8', lineHeight: '1.5', maxWidth: '650px' }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Micro progress indicator dashboard tracker element */}
            <div style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '20px auto 0 auto' }}>
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`indicator-bar ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}