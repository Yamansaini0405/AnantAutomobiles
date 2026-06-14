import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BookYourDreamBike = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [models, setModels] = useState([]);
  const location = useLocation();

  const [formState, setFormState] = useState({
    fullName: '',
    phone: '',
    modelName: '',
    city: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [locationStatus, setLocationStatus] = useState('ready');

  // Handle screen resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 860);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fetch active models dynamically from the backend API
  useEffect(() => {
    fetch('https://backend.yaytech.in/api/bike-models/')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          const activeModels = resData.data
            .filter((bike) => !bike.isDeleted)
            .map((bike) => bike.name);
          setModels(activeModels);
        }
      })
      .catch((err) => console.error('Error fetching bike options:', err));
  }, []);

  // Listen for query parameter parameters to automatically select models
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modelParam = queryParams.get('model');
    if (modelParam) {
      setFormState((prev) => ({ ...prev, modelName: modelParam }));
    }
  }, [location, models]);

  // Integrated Geolocation system matching BikePurchaseModal.jsx logic
  const getGeolocation = () => {
    setLocationStatus('loading');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormState(prev => ({
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

  // Optional: Trigger location tracking system silently immediately upon page mount
  useEffect(() => {
    getGeolocation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        data: {
          fullName: formState.fullName,
          phone: formState.phone,
          model: formState.modelName,
          city: formState.city,
          state: formState.state,
          pincode: formState.pincode,
          latitude: formState.latitude ? parseFloat(formState.latitude) : null,
          longitude: formState.longitude ? parseFloat(formState.longitude) : null,
        },
      };

      const response = await fetch('https://backend.yaytech.in/api/inquiries/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success !== false) {
        setMessage({
          type: 'success',
          text: 'Thank you! Your inquiry has been received. Our team will contact you soon.',
        });
        setFormState({
          fullName: '',
          phone: '',
          modelName: '',
          city: '',
          state: '',
          pincode: '',
          latitude: null,
          longitude: null,
        });
        setLocationStatus('ready');
      } else {
        setMessage({
          type: 'error',
          text: responseData.message || 'Error submitting form. Please try again.',
        });
      }
    } catch (error) {
      console.error('Form error:', error);
      setMessage({
        type: 'error',
        text: 'Error submitting form. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700;800&display=swap');
        
        * {
          box-sizing: border-box;
        }

        .dream-bike-form input,
        .dream-bike-form select {
          width: 100%;
          padding: 13px 15px;
          font-size: 14px;
          color: #222;
          background-color: #fff;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          outline: none;
          font-family: 'Barlow', sans-serif;
          transition: all 0.2s ease;
        }

        .dream-bike-form input:focus,
        .dream-bike-form select:focus {
          border-color: #e60000;
          box-shadow: 0 0 0 3px rgba(230, 0, 0, 0.12);
        }

        .dream-bike-form label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 7px;
          font-family: 'Barlow', sans-serif;
          letter-spacing: 0.02em;
        }

        .dream-bike-form button.submit-btn {
          width: 100%;
          max-width: 420px;
          padding: 15px 40px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #fff;
          background-color: #e60000;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          transition: all 0.22s ease;
        }

        .dream-bike-form button.submit-btn:hover:not(:disabled) {
          background-color: #cc0000;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(230, 0, 0, 0.48);
        }

        .dream-bike-form button.submit-btn:disabled {
          background-color: #999;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .form-message {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Barlow', sans-serif;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }

        .form-message.success {
          background-color: #e0ffe0;
          color: #00c600;
        }

        .form-message.error {
          background-color: #ffe0e0;
          color: #c60000;
        }

        @media (max-width: 860px) {
          .content-wrapper {
            padding: 32px 16px;
          }
          .hero-text h1 {
            font-size: clamp(38px, 11vw, 58px);
          }
          .dream-bike-form {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            max-width: 100%;
          }
          .dream-bike-form button.submit-btn {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .hero-text h1 {
            font-size: clamp(32px, 10vw, 48px);
          }
        }
      `}</style>

      <section style={{
        position: 'relative',
        minHeight: '80vh',
        backgroundImage: 'url(/images/bg1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '60px 20px' : '40px 5vw',
      }}
      id="book-your-dream-bike">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.72))',
          zIndex: 1,
        }} />

        <div className="content-wrapper" style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? '36px' : '60px',
        }}>

          {/* Hero text */}
          <div className="hero-text" style={{
            color: '#fff',
            textAlign: 'center',
            maxWidth: '780px',
          }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(13px, 1.5vw, 16px)',
              fontWeight: 700,
              letterSpacing: '5px',
              color: '#ff4d4d',
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}>
              ── BOOK YOUR DREAM BIKE ──
            </div>

            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(48px, 7vw, 82px)',
              fontWeight: 900,
              margin: '0 0 20px',
              lineHeight: 0.96,
              letterSpacing: '-0.5px',
            }}>
              Get Your 
              <span style={{ color: '#ff4d4d' }}> Personalized </span>
              Quote
            </h1>
          </div>

          {/* Form */}
          <form className="dream-bike-form" onSubmit={handleFormSubmit} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '18px 24px',
            width: '100%',
            maxWidth: '620px',
            margin: '0 auto',
          }}>
            {/* Row 1: Full Name + Phone */}
            <div>
              <label style={{ color: '#fff' }}>Full Name <span style={{ color: '#ff4d4d' }}>*</span></label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={handleInputChange}
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label style={{ color: '#fff' }}>Phone <span style={{ color: '#ff4d4d' }}>*</span></label>
              <input
                type="tel"
                name="phone"
                value={formState.phone}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                required
                autoComplete="tel"
              />
            </div>

            {/* Row 2: Model Name + Pincode */}
            <div>
              <label style={{ color: '#fff' }}>Model Name <span style={{ color: '#ff4d4d' }}>*</span></label>
              <select
                name="modelName"
                value={formState.modelName}
                onChange={handleInputChange}
                required
                style={{ color: formState.modelName ? '#222' : '#999' }}
              >
                <option value="">Select a model</option>
                {models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color: '#fff' }}>Pincode <span style={{ color: '#ff4d4d' }}>*</span></label>
              <input
                type="text"
                name="pincode"
                value={formState.pincode}
                onChange={handleInputChange}
                placeholder="6-digit pincode"
                required
                maxLength={6}
                autoComplete="postal-code"
              />
            </div>

            {/* Row 3: City + State */}
            <div>
              <label style={{ color: '#fff' }}>City <span style={{ color: '#ff4d4d' }}>*</span></label>
              <input
                type="text"
                name="city"
                value={formState.city}
                onChange={handleInputChange}
                placeholder="Your city"
                required
                autoComplete="address-level2"
              />
            </div>

            <div>
              <label style={{ color: '#fff' }}>State <span style={{ color: '#ff4d4d' }}>*</span></label>
              <input
                type="text"
                name="state"
                value={formState.state}
                onChange={handleInputChange}
                placeholder="Your state"
                required
                autoComplete="address-level1"
              />
            </div>

            {/* Location Coordinates Row System across full row width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: '#fff' }}>Location Coordinates <span style={{ color: '#999' }}>(Optional)</span></label>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <input 
                    type="text" 
                    placeholder="Tap 'Get Location' if coordinates are empty" 
                    value={formState.latitude && formState.longitude ? `${formState.latitude.toFixed(5)}, ${formState.longitude.toFixed(5)}` : ''} 
                    readOnly 
                    style={{ background: '#f5f5f5', color: '#666' }} 
                  />
                </div>
                <button 
                  type="button"
                  onClick={getGeolocation} 
                  disabled={locationStatus === 'loading'} 
                  style={{ 
                    padding: '0 20px', 
                    background: locationStatus === 'success' ? '#00AA44' : (locationStatus === 'error' ? '#e60000' : '#fff'), 
                    color: locationStatus === 'success' || locationStatus === 'error' ? '#fff' : '#111', 
                    border: 'none', 
                    borderRadius: 8, 
                    cursor: locationStatus === 'loading' ? 'not-allowed' : 'pointer', 
                    fontFamily: "'Barlow', sans-serif", 
                    fontSize: 12, 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    whiteSpace: 'nowrap', 
                    opacity: locationStatus === 'loading' ? 0.7 : 1, 
                    transition: 'all 0.3s ease' 
                  }}
                >
                  {locationStatus === 'loading' ? 'Getting...' : (locationStatus === 'success' ? '✓ Got' : 'Get Location')}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ gridColumn: '1 / -1', marginTop: '12px', textAlign: 'center' }}>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Enquire Now →'}
              </button>

              {message.text && (
                <div className={`form-message ${message.type}`}>
                  {message.text}
                </div>
              )}
            </div>
          </form>

        </div>
      </section>
    </>
  );
};

export default BookYourDreamBike;