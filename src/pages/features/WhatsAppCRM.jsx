import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaCheckCircle, FaRobot, FaBell, FaUsers, FaArrowRight } from 'react-icons/fa';

export default function WhatsAppCRM() {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendDemo = () => {
    if (!phone) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

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
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>CRM INTEGRATIONS</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            WhatsApp CRM Integration
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Never lose a lead. Automated project alerts and routing sent instantly to your phone.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10, maxWidth: '1000px' }}>
        
        {/* Main Features & Demo Section */}
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
          {/* Key pillars grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {[
              { icon: FaRobot, label: 'Auto Replies', desc: 'Instant WhatsApp responses for user queries 24/7' },
              { icon: FaBell, label: 'Instant Alerts', desc: 'Every booking & inquiry notified instantly to you' },
              { icon: FaUsers, label: 'Shared Team Inbox', desc: 'Collaborative inbox for sales team assignments' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '20px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#e6f7ed',
                  color: '#2ecc71',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <item.icon style={{ fontSize: '18px' }} />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px', fontFamily: 'Poppins, sans-serif' }}>
                  {item.label}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--gray)', lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Try WhatsApp Demo Box */}
          <div style={{
            background: '#fafbfc',
            border: '1.5px dashed var(--indigo)',
            borderRadius: '16px',
            padding: '24px 32px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px', fontFamily: 'Poppins, sans-serif' }}>
              Try WhatsApp Demo
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--gray)', margin: '0 0 16px', fontWeight: 500 }}>
              Enter your WhatsApp number to receive an active sample property alert:
            </p>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', maxWidth: '500px' }}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--line)',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleSendDemo}
                style={{
                  background: '#2ecc71',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 0.2s',
                  outline: 'none',
                }}
                onMouseEnter={(e) => e.target.style.background = '#27ae60'}
                onMouseLeave={(e) => e.target.style.background = '#2ecc71'}
              >
                <FaWhatsapp style={{ fontSize: '16px' }} /> {sent ? 'Sent!' : 'Send Alert Demo'}
              </button>
            </div>
            
            {sent && (
              <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#2ecc71', fontWeight: 600 }}>
                <FaCheckCircle /> Demo WhatsApp message sent! Check your phone.
              </div>
            )}
          </div>
        </motion.div>

        {/* Detailed Guidelines Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: '#fff',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              padding: '24px 32px',
              boxShadow: '0 4px 15px rgba(20,20,60,0.02)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginBottom: '20px', fontFamily: 'Poppins, sans-serif' }}>
              How It Works
            </h3>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Visitor submits a booking form or inquiries on website.',
                'The system auto-records details directly in CRM dashboard.',
                'Instant alerts are sent straight to coordinates via WhatsApp.',
                'Immediate brochures are sent to the visitor via automation.',
                'Team can instantly chat with customers via single interface.',
              ].map((step, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    background: '#e6f7ed',
                    color: '#2ecc71',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '13.5px', color: 'var(--gray)', lineHeight: 1.5, fontWeight: 500 }}>{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: '#fff',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              padding: '24px 32px',
              boxShadow: '0 4px 15px rgba(20,20,60,0.02)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginBottom: '20px', fontFamily: 'Poppins, sans-serif' }}>
              CRM Key Benefits
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Unchecked Lead Leakage', before: '35% Loss', after: '< 2% Loss', color: '#2ecc71' },
                { label: 'Average Response Time', before: '5 Hours', after: '< 2 Mins', color: '#2ecc71' },
                { label: 'Conversion Performance', before: '10% Avg', after: '32% High', color: '#2ecc71' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#f8fafc',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                  }}
                >
                  <div>
                    <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: 'var(--text)' }}>
                      {item.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600 }}>
                    <span style={{ color: 'var(--gray)', textDecoration: 'line-through' }}>{item.before}</span>
                    <FaArrowRight style={{ color: 'var(--line)', fontSize: '9px' }} />
                    <span style={{ color: item.color, fontWeight: 800, fontSize: '12.5px' }}>{item.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
