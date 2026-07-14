import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

/* ===== Style helpers ===== */
const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text)',
  marginBottom: '6px',
};

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '11px 14px',
  border: `1px solid ${hasError ? '#e55' : 'var(--line)'}`,
  borderRadius: '8px',
  fontSize: '14px',
  color: 'var(--text)',
  outline: 'none',
  transition: 'border-color .2s',
  background: '#fff',
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
});

const errStyle = {
  color: '#c0392b',
  fontSize: '11.5px',
  marginTop: '4px',
};

export default function BookVisitForm({
  projects,
  timeSlots,
  getMinDate,
  register,
  handleSubmitForm,
  errors,
  onSubmit,
  loading,
}) {
  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* ===== PAGE HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(91,79,224,.1)' }} />
        <div className="wrap">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>SECURE YOUR PLOT</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            Book a Site Visit
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Schedule a free site visit with our experts to explore your dream plot in person.
          </p>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* ===== FORM CARD ===== */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: '0 15px 40px rgba(20,20,60,.1)',
            padding: '36px',
          }}>
            <span className="eyebrow">SCHEDULE YOUR VISIT</span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '28px' }}>
              Select Date &amp; Time
            </h2>

            <form onSubmit={handleSubmitForm(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Select Project</label>
                <select
                  {...register('project', { required: 'Please select a project' })}
                  style={inputStyle(!!errors.project)}
                >
                  <option value="">Choose a project</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                {errors.project && <p style={errStyle}>{errors.project.message}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Preferred Date</label>
                  <div style={{ position: 'relative' }}>
                    <FaCalendarAlt style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', fontSize: '14px' }} />
                    <input
                      type="date"
                      min={getMinDate()}
                      {...register('date', { required: 'Please select a date' })}
                      style={{ ...inputStyle(!!errors.date), paddingLeft: '38px' }}
                    />
                  </div>
                  {errors.date && <p style={errStyle}>{errors.date.message}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Time Slot</label>
                  <div style={{ position: 'relative' }}>
                    <FaClock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', fontSize: '14px', pointerEvents: 'none', zIndex: 1 }} />
                    <select
                      {...register('timeSlot', { required: 'Please select a time' })}
                      style={{ ...inputStyle(!!errors.timeSlot), paddingLeft: '38px' }}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </div>
                  {errors.timeSlot && <p style={errStyle}>{errors.timeSlot.message}</p>}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Pickup Location</label>
                <div style={{ position: 'relative' }}>
                  <FaMapMarkerAlt style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', fontSize: '14px' }} />
                  <input
                    type="text"
                    {...register('pickupLocation', { required: 'Pickup location is required' })}
                    style={{ ...inputStyle(!!errors.pickupLocation), paddingLeft: '38px' }}
                    placeholder="Enter your pickup address"
                  />
                </div>
                {errors.pickupLocation && <p style={errStyle}>{errors.pickupLocation.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  border: 'none',
                  marginTop: '10px',
                }}
              >
                {loading && (
                  <motion.div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid var(--navy)',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      marginRight: '8px',
                      display: 'inline-block',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                )}
                {loading ? 'Booking...' : 'Book Site Visit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
