import React, { useState, useEffect } from 'react';

const ServiceBookingModal = ({ service, onClose }) => {
  const [formState, setFormState] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceType: 'Paid',
    freeServiceChoice: '',
    serviceName: service.title,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Reset form when service changes
    setFormState({
      fullName: '',
      phone: '',
      email: '',
      serviceType: 'Paid',
      freeServiceChoice: '',
      serviceName: service.title,
    });
    setMessage({ type: '', text: '' });
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fi-sender-fullName', formState.fullName);
      formDataToSend.append('fi-sender-email', formState.email);
      formDataToSend.append('fi-text-phone', formState.phone);
      formDataToSend.append('fi-text-serviceName', formState.serviceName);
      formDataToSend.append('fi-text-serviceType', formState.serviceType);
      if (formState.serviceType === 'Free') {
        formDataToSend.append('fi-text-freeServiceChoice', formState.freeServiceChoice);
      }

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
          text: 'Thank you! Your service request has been received. Our team will contact you soon.'
        });
        setTimeout(onClose, 2000); // Close modal on success
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
          &times;
        </button>
        <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 900, color: '#111', marginBottom: 8 }}>
          Book Service: <span style={{ color: service.accent }}>{service.title}</span>
        </h3>
        <p style={{fontSize: '14px', color: '#666', marginBottom: '24px'}}>Fill in your details to schedule your service.</p>

        <form onSubmit={handleFormSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: 6 }}>Full Name *</label>
            <input type="text" name="fullName" placeholder="Your full name" required value={formState.fullName} onChange={handleInputChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: 6 }}>Phone *</label>
            <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" required value={formState.phone} onChange={handleInputChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: 6 }}>Email</label>
            <input type="email" name="email" placeholder="Your email address" value={formState.email} onChange={handleInputChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: 6 }}>Service Type *</label>
            <select name="serviceType" value={formState.serviceType} onChange={handleInputChange} style={inputStyle}>
              <option value="Paid">Paid Service</option>
              <option value="Free">Free Service</option>
            </select>
          </div>

          {formState.serviceType === 'Free' && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: 6 }}>Free Service Coupon *</label>
              <select name="freeServiceChoice" value={formState.freeServiceChoice} onChange={handleInputChange} required style={inputStyle}>
                <option value="">Select Free Service</option>
                <option value="free_1">Free Service 1</option>
                <option value="free_2">Free Service 2</option>
                <option value="free_3">Free Service 3</option>
                <option value="free_4">Free Service 4</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            ...submitButtonStyle,
            background: loading ? '#999' : service.accent,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Submitting...' : 'Confirm Booking'}
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

export default ServiceBookingModal;
