import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRobot, FaEnvelope, FaWhatsapp, FaSms, FaUsers, FaChartLine, FaClock } from 'react-icons/fa';

const sequences = [
  {
    id: 1, name: 'New Lead Nurture', trigger: 'Form Submission',
    steps: [
      { time: 'Instant', channel: 'WhatsApp', message: 'Thank you for your interest! Here\'s our project brochure.' },
      { time: '1 hour', channel: 'Email', message: 'Detailed project PDF with pricing & payment plans.' },
      { time: '24 hours', channel: 'WhatsApp', message: 'Would you like to schedule a site visit this weekend?' },
      { time: '3 days', channel: 'SMS', message: 'Special launch offer: Get 5% discount on booking this week!' },
    ],
  },
  {
    id: 2, name: 'Site Visit Follow-up', trigger: 'Visit Booked',
    steps: [
      { time: 'Instant', channel: 'WhatsApp', message: 'Visit confirmed! Google Maps link & executive details shared.' },
      { time: '1 day before', channel: 'WhatsApp', message: 'Reminder: Your site visit is tomorrow at 11 AM.' },
      { time: 'Post visit', channel: 'Email', message: 'Thank you for visiting! Here\'s the property summary.' },
      { time: '3 days after', channel: 'WhatsApp', message: 'Still thinking? We have special discounts for first 10 bookings.' },
    ],
  },
  {
    id: 3, name: 'Post-Booking Engagement', trigger: 'Booking Confirmed',
    steps: [
      { time: 'Instant', channel: 'WhatsApp', message: 'Congratulations! Booking confirmed. Welcome to the JSM family!' },
      { time: 'Weekly', channel: 'WhatsApp', message: 'Construction progress update with photos & videos.' },
      { time: 'Monthly', channel: 'Email', message: 'Monthly construction report & payment schedule.' },
      { time: 'Quarterly', channel: 'SMS', message: 'Quarterly project newsletter & community events.' },
    ],
  },
];

export default function AIFollowupAutomation() {
  const [active, setActive] = useState(sequences[0]);

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
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>AI WORKFLOWS</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            AI Follow-up Automation
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Intelligent multi-channel nurturing sequences that convert plot leads into bookings.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10, maxWidth: '800px' }}>
        
        {/* Main Workflows Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: '0 15px 40px rgba(20,20,60,.1)',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          {/* Workflow selection tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {sequences.map((seq) => {
              const isActive = active.id === seq.id;
              return (
                <button
                  key={seq.id}
                  onClick={() => setActive(seq)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s',
                    background: isActive ? 'var(--indigo)' : '#fff',
                    color: isActive ? '#fff' : 'var(--text)',
                    border: `1.5px solid ${isActive ? 'transparent' : 'var(--line)'}`,
                    boxShadow: isActive ? '0 4px 12px rgba(58, 47, 184, 0.15)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.borderColor = 'var(--indigo)';
                      e.target.style.color = 'var(--indigo)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.borderColor = 'var(--line)';
                      e.target.style.color = 'var(--text)';
                    }
                  }}
                >
                  {seq.name}
                </button>
              );
            })}
          </div>

          {/* Trigger Detail */}
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Sequence Trigger:
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginLeft: '8px' }}>
              ⚡ {active.trigger}
            </span>
          </div>

          {/* Steps Timeline Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {active.steps.map((step, i) => {
              const isWhatsApp = step.channel === 'WhatsApp';
              const isEmail = step.channel === 'Email';
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px 20px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    position: 'relative',
                  }}
                >
                  {/* Left Icon Panel & Connector Line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isWhatsApp ? '#e6f7ed' : isEmail ? '#efeafe' : '#fef9e7',
                      color: isWhatsApp ? '#2ecc71' : isEmail ? 'var(--indigo)' : '#f1c40f',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}>
                      {isWhatsApp ? <FaWhatsapp style={{ fontSize: '18px' }} /> :
                       isEmail ? <FaEnvelope style={{ fontSize: '16px' }} /> :
                       <FaSms style={{ fontSize: '18px' }} />}
                    </div>
                  </div>

                  {/* Right Content Panel */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{
                        padding: '4px 10px',
                        background: '#f0effc',
                        color: 'var(--indigo)',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '12px',
                      }}>
                        {step.time}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray)' }}>
                        via {step.channel}
                      </span>
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                      &ldquo;{step.message}&rdquo;
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Summary Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[
            { icon: FaUsers, label: 'Lead Capture Rate', value: '100%', sub: 'Zero lead leakage guaranteed' },
            { icon: FaChartLine, label: 'Conversion Rate', value: '35%', sub: 'vs Real estate avg: 12%' },
            { icon: FaClock, label: 'Average Response', value: '< 2 Mins', sub: 'Instant chatbot handover' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid var(--line)',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(20,20,60,0.02)',
                textAlign: 'center',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                background: '#efeafe',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <stat.icon style={{ color: 'var(--indigo)', fontSize: '16px' }} />
              </div>
              <h4 style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                {stat.label}
              </h4>
              <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', margin: '6px 0 2px' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--gray)', margin: 0, fontWeight: 500 }}>
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
