import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import config from '../../config';

export default function BookVisitSuccess({ visitDetails, setSuccess, setVisitDetails }) {
  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* ===== PAGE HEADER ===== */}
      <div style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
        padding: '64px 0 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="wrap">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>SUCCESS</span>
          <h1 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '42px', fontWeight: 800, color: '#fff', margin: '12px 0 14px' }}>
            Booking Confirmed!
          </h1>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: '0 15px 40px rgba(20,20,60,.1)',
            padding: '36px',
            maxWidth: '520px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            background: '#e6f7ed',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <FaCheckCircle style={{ color: '#2ecc71', fontSize: '28px' }} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
            Visit Scheduled Successfully
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: '14.5px', marginBottom: '24px', lineHeight: 1.5 }}>
            Your site visit has been scheduled. Our executive will contact you shortly to confirm the details.
          </p>

          <div style={{
            background: '#f8f8fc',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            padding: '20px',
            marginBottom: '28px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project</span>
              <span style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 700 }}>{visitDetails.projectName}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preferred Date</span>
                <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>
                  {new Date(visitDetails.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time Slot</span>
                <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>{visitDetails.timeSlot}</span>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pickup Location</span>
              <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>{visitDetails.pickupLocation}</span>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '16px' }}>
            For instant confirmation, please share this booking with our support team:
          </p>

          <a
            href={`https://wa.me/${config.supportWhatsapp}?text=Hi! I have booked a site visit for project "${visitDetails.projectName}" on ${visitDetails.date} at ${visitDetails.timeSlot}. Please confirm.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 700,
              background: '#2ecc71',
              color: '#fff',
              border: 'none',
              textDecoration: 'none',
            }}
          >
            <FaWhatsapp style={{ fontSize: '18px' }} /> Confirm via WhatsApp
          </a>

          <button
            onClick={() => { setSuccess(false); setVisitDetails(null); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--indigo)',
              fontSize: '14px',
              fontWeight: 600,
              marginTop: '20px',
              cursor: 'pointer',
            }}
          >
            ← Book Another Visit
          </button>
        </motion.div>
      </div>
    </div>
  );
}
