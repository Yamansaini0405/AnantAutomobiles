import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BikePurchaseModal = ({ bike, onClose }) => {
  const [formState, setFormState] = useState({
    fullName: '',
    phone: '',
    bikeName: bike?.name || '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setFormState({
      fullName: '',
      phone: '',
      bikeName: bike?.name || '',
      city: '',
      state: '',
      pincode: '',
    });
    setMessage({ type: '', text: '' });
  }, [bike]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fi-sender-fullName', formState.fullName);
      formDataToSend.append('fi-text-phone', formState.phone);
      formDataToSend.append('fi-text-bikeName', formState.bikeName);
      formDataToSend.append('fi-text-city', formState.city);
      formDataToSend.append('fi-text-state', formState.state);
      formDataToSend.append('fi-text-pincode', formState.pincode);

      const response = await fetch('https://forminit.com/f/x1mlf5p6870', {
        method: 'POST',
        body: formDataToSend,
      });

      let responseData = {};
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = { success: response.ok };
      }

      if (responseData.success === true || (response.ok && !responseData.error)) {
        setMessage({
          type: 'success',
          text: 'Thank you! Your bike purchase inquiry has been received. Our team will contact you soon with details.'
        });
        setTimeout(onClose, 2000);
      } else {
        setMessage({
          type: 'error',
          text: responseData.message || 'Error submitting form. Please try again.'
        });
      }
    } catch (error) {
      console.error('Form error:', error);
      setMessage({
        type: 'error',
        text: 'Error submitting form. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 'clamp(24px, 5vw, 36px)',
        width: '90%', maxWidth: 500,
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'none',
          border: 'none', fontSize: 24, cursor: 'pointer', color: '#888'
        }}>
          ×
        </button>
        <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 900, color: '#111', marginBottom: 8 }}>
          Purchase: <span style={{ color: '#FF0000' }}>{bike?.name}</span>
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
          Fill in your details to express your interest in this motorcycle.
        </p>

        <form onSubmit={handleFormSubmit} style={{ display: 'grid', gap: '16px' }}>

          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              name="fullName"
              placeholder="Your full name"
              required
              value={formState.fullName}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>Phone *</label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              required
              value={formState.phone}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          {/* Bike Model — pre-filled, disabled */}
          <div>
            <label style={labelStyle}>Bike Model</label>
            <input
              type="text"
              value={formState.bikeName}
              disabled
              style={{ ...inputStyle, background: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </div>

          {/* City + State side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>City *</label>
              <input
                type="text"
                name="city"
                placeholder="Your city"
                required
                value={formState.city}
                onChange={handleInputChange}
                style={inputStyle}
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label style={labelStyle}>State *</label>
              <input
                type="text"
                name="state"
                placeholder="Your state"
                required
                value={formState.state}
                onChange={handleInputChange}
                style={inputStyle}
                autoComplete="address-level1"
              />
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label style={labelStyle}>Pincode *</label>
            <input
              type="text"
              name="pincode"
              placeholder="6-digit pincode"
              required
              maxLength={6}
              value={formState.pincode}
              onChange={handleInputChange}
              style={inputStyle}
              autoComplete="postal-code"
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            ...submitButtonStyle,
            background: loading ? '#999' : '#FF0000',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Submitting...' : 'Submit Inquiry'}
          </button>

          {message.text && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              backgroundColor: message.type === 'success' ? '#e0ffe0' : '#ffe0e0',
              color: message.type === 'success' ? '#00c600' : '#c60000',
            }}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 700,
  color: '#555',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid #e0e0e0',
  borderRadius: 8,
  fontSize: '14px',
  fontFamily: "'Barlow'",
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const submitButtonStyle = {
  width: '100%',
  padding: '14px',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: '14px',
  fontWeight: 800,
  fontFamily: "'Barlow'",
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  transition: 'all 0.22s ease',
};

export default BikePurchaseModal;