import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaCheckCircle, FaRobot, FaBell, FaUsers, FaArrowRight } from 'react-icons/fa';
import { getPlots } from '../../api/plots';

export default function WhatsAppCRM() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [template, setTemplate] = useState('property_alert');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPlotId, setSelectedPlotId] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        setLoading(true);
        const response = await getPlots({ limit: 100 });
        const plotsList = response.data?.data || [];
        
        const mappedProperties = plotsList.map((plot) => ({
          id: plot._id,
          plotNumber: plot.plotNumber,
          project: plot.project?.name || 'N/A',
          size: plot.size || 1800,
          price: plot.price ? (plot.price / 100000).toFixed(1) : '35.0',
          facing: plot.facing || 'East',
          status: plot.status || 'available'
        }));
        
        setProperties(mappedProperties);
        
        if (mappedProperties.length > 0) {
          setSelectedProject(mappedProperties[0].project);
          setSelectedPlotId(mappedProperties[0].id);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlots();
  }, []);

  const uniqueProjects = Array.from(new Set(properties.map((p) => p.project))).filter(Boolean);
  const filteredPlots = properties.filter((p) => p.project === selectedProject);

  useEffect(() => {
    if (filteredPlots.length > 0) {
      const exists = filteredPlots.some((p) => p.id === selectedPlotId);
      if (!exists) {
        setSelectedPlotId(filteredPlots[0].id);
      }
    } else {
      setSelectedPlotId('');
    }
  }, [selectedProject, properties]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const activePlot = properties.find((p) => p.id === selectedPlotId);
    const greetingName = customerName.trim() || 'Valued Customer';
    let messageText = '';
    
    if (template === 'property_alert') {
      const projName = activePlot?.project || selectedProject || 'Green City Phase II';
      const plotNum = activePlot?.plotNumber || 'GC-01';
      const plotSize = activePlot?.size || 1800;
      const plotFacing = activePlot?.facing || 'East';
      const plotPrice = activePlot?.price || '35.0';
      
      messageText = `🏡 *Maa Santoshi Constructions - Property Alert* 🏡\n\n` +
        `Hi ${greetingName}!\n\n` +
        `Here are the details of a premium property matching your preference:\n` +
        `📍 *Project*: ${projName}\n` +
        `📐 *Unit*: Plot ${plotNum}\n` +
        `📏 *Size*: ${plotSize} sq.ft\n` +
        `🧭 *Facing*: ${plotFacing}\n` +
        `💰 *Price*: ₹${plotPrice} Lakh\n\n` +
        `Reply to this chat to connect with our sales executive and schedule a visit!`;
    } else if (template === 'site_visit') {
      const projName = activePlot?.project || selectedProject || 'Green City Phase II';
      
      messageText = `📅 *Maa Santoshi Constructions - Guided Site Visit* 📅\n\n` +
        `Hi ${greetingName}!\n\n` +
        `We invite you to join us for a guided tour of our premium project: *${projName}*.\n\n` +
        `🚗 *Transportation*: Complementary pickup and drop-off service is available.\n` +
        `📞 Please reply with your preferred date and time slot to confirm your booking.`;
    } else if (template === 'payment_reminder') {
      const projName = activePlot?.project || selectedProject || 'Green City Phase II';
      const plotNum = activePlot?.plotNumber || 'GC-01';
      
      messageText = `💰 *Maa Santoshi Constructions - Installment Update* 💰\n\n` +
        `Dear ${greetingName},\n\n` +
        `This is a friendly update regarding your booking at *${projName}*.\n` +
        `🔖 *Unit*: Plot ${plotNum}\n` +
        `🗓 *Status*: Next installment is due shortly.\n\n` +
        `Please contact your relationship manager for online payment links or receipt updates. Thank you!`;
    }
    
    setCustomMessage(messageText);
  }, [template, selectedPlotId, selectedProject, customerName, properties]);

  const handleSendDemo = () => {
    if (!phone) {
      alert('Please enter a phone number.');
      return;
    }
    
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    if (!cleaned) {
      alert('Please enter a valid phone number.');
      return;
    }
    
    const whatsappUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(customMessage)}`;
    window.open(whatsappUrl, '_blank');
    
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
            padding: '28px 32px',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', margin: '0 0 6px', fontFamily: 'Poppins, sans-serif' }}>
              Smart Message Composer (WhatsApp CRM Demo)
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--gray)', margin: '0 0 20px', fontWeight: 500 }}>
              Test and customize dynamic templates powered by actual property records before opening WhatsApp:
            </p>

            {/* Step 1: Template Toggles */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                1. Select Communication Template:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'property_alert', label: '🏡 Property Alert' },
                  { id: 'site_visit', label: '📅 Site Visit Invitation' },
                  { id: 'payment_reminder', label: '💰 Payment Reminder' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: template === t.id ? 'var(--indigo)' : 'var(--line)',
                      background: template === t.id ? '#f1eefe' : '#fff',
                      color: template === t.id ? 'var(--indigo)' : 'var(--text)',
                      transition: 'all 0.2s',
                      outline: 'none',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Property Filter Dropdowns */}
            {(template === 'property_alert' || template === 'payment_reminder') && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  2. Select Property Details:
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      disabled={loading || uniqueProjects.length === 0}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--line)',
                        fontSize: '13px',
                        background: '#fff',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {uniqueProjects.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <select
                      value={selectedPlotId}
                      onChange={(e) => setSelectedPlotId(e.target.value)}
                      disabled={loading || filteredPlots.length === 0}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--line)',
                        fontSize: '13px',
                        background: '#fff',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {filteredPlots.map((p) => (
                        <option key={p.id} value={p.id}>
                          Plot {p.plotNumber} — {p.size} sq.ft (₹{p.price} L)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Recipient Personalization */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                {template === 'property_alert' || template === 'payment_reminder' ? '3.' : '2.'} Customer Personalization & Recipient:
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <input
                    type="text"
                    placeholder="Customer Name (e.g. Rahul)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <input
                    type="text"
                    placeholder="Recipient Phone (+91 XXXXX XXXXX)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Editable Message Preview Area */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Message Preview (Directly editable text):
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                style={{
                  width: '100%',
                  height: '180px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--indigo)',
                  fontSize: '13.5px',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.5,
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#fcfcfd',
                  color: 'var(--text)',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Step 5: Send Redirection */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <button
                onClick={handleSendDemo}
                disabled={loading || !phone}
                style={{
                  background: loading || !phone ? '#bdc3c7' : '#2ecc71',
                  color: '#fff',
                  padding: '12px 28px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading || !phone ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 0.2s',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!loading && phone) e.target.style.background = '#27ae60';
                }}
                onMouseLeave={(e) => {
                  if (!loading && phone) e.target.style.background = '#2ecc71';
                }}
              >
                <FaWhatsapp style={{ fontSize: '18px' }} /> Send Custom Alert on WhatsApp
              </button>

              {sent && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#2ecc71', fontWeight: 600 }}>
                  <FaCheckCircle /> Demo WhatsApp redirect triggered!
                </div>
              )}
            </div>
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
