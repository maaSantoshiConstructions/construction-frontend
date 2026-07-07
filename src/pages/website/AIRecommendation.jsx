import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { createRecommendation } from '../../api/aiRecommendations';
import { FaArrowRight, FaMapMarkerAlt, FaHome, FaStar, FaCheckCircle, FaPhone, FaCompass, FaRegBuilding } from 'react-icons/fa';

const steps = [
  { id: 1, title: 'Budget', description: 'What is your budget range?' },
  { id: 2, title: 'Location', description: 'Preferred location or city' },
  { id: 3, title: 'Property Type', description: 'Type of property you need' },
  { id: 4, title: 'Purpose', description: 'Purpose of purchase' },
];

const recommendations = [
  {
    id: 1,
    name: 'Green City',
    location: 'Bhubaneswar, Odisha',
    price: 999000,
    size: 1200,
    score: 96,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
    reason: 'Excellent match for your budget and preferred location in Bhubaneswar.',
  },
  {
    id: 2,
    name: 'Royal Enclave',
    location: 'Cuttack, Odisha',
    price: 1450000,
    size: 1500,
    score: 89,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
    reason: 'Premium location in Cuttack with high growth and appreciation potential.',
  },
  {
    id: 3,
    name: 'Silver Spring',
    location: 'Puri, Odisha',
    price: 1175000,
    size: 1800,
    score: 84,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
    reason: 'Scenic area in Puri, perfect for a vacation villa or second home.',
  },
  {
    id: 4,
    name: 'Sunrise Meadows',
    location: 'Khordha, Odisha',
    price: 875000,
    size: 1000,
    score: 79,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
    reason: 'Affordable residential plots with good connectivity to Khordha.',
  },
];

export default function AIRecommendation() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    budget: '',
    location: '',
    propertyType: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!formData[getFieldForStep(step)]) {
      toast.error('Please select an option to proceed');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const getFieldForStep = (s) => {
    const map = { 1: 'budget', 2: 'location', 3: 'propertyType', 4: 'purpose' };
    return map[s];
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await createRecommendation(formData);
      const apiResults = data?.data;
      if (apiResults && apiResults.length > 0) {
        setResults(apiResults.map((r, i) => ({
          id: i + 1,
          name: r.name || r.projectName || 'Recommended Plot',
          location: r.location || 'Bhubaneswar, Odisha',
          price: r.price || 990000,
          size: r.size || 1200,
          score: r.score || 85,
          image: `https://images.unsplash.com/photo-${1600585154526 + i * 1000}-990dced4db0d?w=600`,
          reason: r.reason || 'Great match based on your preferences.',
        })));
      } else {
        setResults(recommendations);
      }
    } catch {
      setResults(recommendations);
    } finally {
      setLoading(false);
    }
  };

  const budgetRanges = [
    { label: 'Under ₹10 Lakhs', value: '0-1000000' },
    { label: '₹10 - ₹15 Lakhs', value: '1000000-1500000' },
    { label: '₹15 - ₹20 Lakhs', value: '1500000-2000000' },
    { label: 'Above ₹20 Lakhs', value: '2000000+' },
  ];

  const locations = ['Bhubaneswar', 'Cuttack', 'Puri', 'Khordha'];
  const propertyTypes = ['Residential Plot', 'Commercial Plot', 'Villa', 'Farm Land'];
  const purposes = ['Investment', 'Self Use', 'Both'];

  const formatCurrency = (val) => '₹ ' + val.toLocaleString('en-IN');

  if (results) {
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
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>AI FINDER</span>
            <h1 style={{ fontFamily: 'Poppins,Inter,sans-serif', fontSize: '42px', fontWeight: 800, color: '#fff', margin: '12px 0 14px' }}>
              Your Recommendations
            </h1>
            <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
              Here are the top-matching properties matching your unique investment and utility preferences.
            </p>
          </div>
        </div>

        <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>

            {/* Preferences Badge Row */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
            }}>
              <span style={{ color: 'var(--gray)', fontSize: '13px', fontWeight: 600 }}>Preferences:</span>
              <span style={pillStyle}>{budgetRanges.find((b) => b.value === formData.budget)?.label}</span>
              <span style={pillStyle}>{formData.location}</span>
              <span style={pillStyle}>{formData.propertyType}</span>
              <span style={pillStyle}>{formData.purpose}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {results.map((rec, i) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid var(--line)',
                    boxShadow: '0 4px 20px rgba(20,20,60,0.05)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ width: '200px', minHeight: '160px', flexGrow: 1 }}>
                    <img src={rec.image} alt={rec.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: '2', padding: '24px', minWidth: '280px', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>{rec.name}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <FaMapMarkerAlt /> {rec.location}
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        background: '#e6f7ed',
                        borderRadius: '8px',
                        color: '#2ecc71',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}>
                        <FaStar style={{ color: '#f1c40f', fontSize: '12px' }} />
                        <span>{rec.score}% Match</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '13.5px', color: 'var(--gray)', margin: '12px 0 16px', lineHeight: 1.5 }}>{rec.reason}</p>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', marginBottom: '20px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: 'var(--gold-dark)', fontSize: '16px' }}>{formatCurrency(rec.price)}</span>
                      <span style={{ color: 'var(--line)' }}>|</span>
                      <span style={{ color: 'var(--text)', fontWeight: 600 }}>{rec.size} sq ft</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <Link to="/book-visit" className="btn-gold" style={{ textDecoration: 'none', fontSize: '13.5px', padding: '10px 20px', border: 'none' }}>
                        Schedule Site Visit <FaArrowRight style={{ fontSize: '11px', marginLeft: '4px' }} />
                      </Link>
                      <a href="tel:+917000012345" style={outlineBtnStyle}>
                        <FaPhone style={{ fontSize: '12px', marginRight: '6px' }} /> Contact Sales
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <button
                onClick={() => { setResults(null); setStep(1); setFormData({ budget: '', location: '', propertyType: '', purpose: '' }); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--indigo)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ← Find Different Recommendations
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

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
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>AI PROPERTY FINDER</span>
          <h1 style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: '40px', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '14px' }}>
            AI Recommendation
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Answer a few quick questions and our intelligent model will suggest the best plots for you.
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

            {/* Stepper Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              {steps.map((s) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: s.id < 4 ? '1' : 'none' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    transition: 'all 0.3s',
                    background: step > s.id ? '#2ecc71' : step === s.id ? 'var(--indigo)' : '#e6e6f0',
                    color: step >= s.id ? '#fff' : 'var(--gray)',
                  }}>
                    {step > s.id ? <FaCheckCircle style={{ fontSize: '14px' }} /> : s.id}
                  </div>
                  {s.id < 4 && (
                    <div style={{
                      flex: 1,
                      height: '2px',
                      margin: '0 8px',
                      background: step > s.id ? '#2ecc71' : '#e6e6f0',
                      transition: 'all 0.3s',
                    }} />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
              >
                {step === 1 && (
                  <div>
                    <h2 style={formTitleStyle}>What is your budget?</h2>
                    <p style={formSubtitleStyle}>Select your preferred budget range for the plot.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {budgetRanges.map((range) => (
                        <button
                          key={range.value}
                          type="button"
                          onClick={() => updateField('budget', range.value)}
                          style={optionCardStyle(formData.budget === range.value)}
                        >
                          <span style={{ fontSize: '14.5px', fontWeight: formData.budget === range.value ? 700 : 600 }}>{range.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 style={formTitleStyle}>Preferred Location</h2>
                    <p style={formSubtitleStyle}>Where are you looking to buy or invest?</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => updateField('location', loc)}
                          style={gridOptionCardStyle(formData.location === loc)}
                        >
                          <FaMapMarkerAlt style={{ fontSize: '18px', marginBottom: '8px', color: formData.location === loc ? 'var(--indigo)' : 'var(--gray)' }} />
                          <span style={{ fontSize: '13.5px', fontWeight: formData.location === loc ? 700 : 600 }}>{loc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 style={formTitleStyle}>Property Type</h2>
                    <p style={formSubtitleStyle}>What kind of land or property are you looking for?</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
                      {propertyTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateField('propertyType', type)}
                          style={gridOptionCardStyle(formData.propertyType === type)}
                        >
                          {type.includes('Commercial') ? (
                            <FaCompass style={{ fontSize: '18px', marginBottom: '8px', color: formData.propertyType === type ? 'var(--indigo)' : 'var(--gray)' }} />
                          ) : (
                            <FaHome style={{ fontSize: '18px', marginBottom: '8px', color: formData.propertyType === type ? 'var(--indigo)' : 'var(--gray)' }} />
                          )}
                          <span style={{ fontSize: '13.5px', fontWeight: formData.propertyType === type ? 700 : 600 }}>{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 style={formTitleStyle}>Purpose of Purchase</h2>
                    <p style={formSubtitleStyle}>What is your primary goal for this purchase?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {purposes.map((purpose) => (
                        <button
                          key={purpose}
                          type="button"
                          onClick={() => updateField('purpose', purpose)}
                          style={optionCardStyle(formData.purpose === purpose)}
                        >
                          <span style={{ fontSize: '14.5px', fontWeight: formData.purpose === purpose ? 700 : 600, display: 'block' }}>{purpose}</span>
                          <span style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '4px', display: 'block', fontWeight: 400 }}>
                            {purpose === 'Investment' && 'Looking for high future value appreciation.'}
                            {purpose === 'Self Use' && 'Planning to build your dream home/office space.'}
                            {purpose === 'Both' && 'Want utility use and also benefit from future appreciation.'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                style={{
                  padding: '11px 24px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  color: step === 1 ? 'var(--line)' : 'var(--gray)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: step === 1 ? 'not-allowed' : 'pointer',
                  outline: 'none',
                }}
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="btn-gold"
                style={{
                  padding: '11px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  outline: 'none',
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      style={{
                        width: '14px',
                        height: '14px',
                        border: '2px solid var(--navy)',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        display: 'inline-block',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    Analyzing...
                  </>
                ) : step === 4 ? (
                  <>Get Recommendations <FaArrowRight /></>
                ) : (
                  <>Next <FaArrowRight /></>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Styled Helper Objects ===== */
const formTitleStyle = {
  fontSize: '20px',
  fontWeight: 800,
  color: 'var(--text)',
  marginBottom: '6px',
};

const formSubtitleStyle = {
  fontSize: '13.5px',
  color: 'var(--gray)',
  marginBottom: '24px',
};

const optionCardStyle = (isActive) => ({
  width: '100%',
  padding: '16px 20px',
  borderRadius: '12px',
  border: `1px solid ${isActive ? 'var(--indigo)' : 'var(--line)'}`,
  background: isActive ? '#f1eefe' : '#fff',
  color: isActive ? 'var(--indigo)' : 'var(--text)',
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.2s',
  outline: 'none',
  boxSizing: 'border-box',
  display: 'block',
});

const gridOptionCardStyle = (isActive) => ({
  padding: '20px 12px',
  borderRadius: '12px',
  border: `1px solid ${isActive ? 'var(--indigo)' : 'var(--line)'}`,
  background: isActive ? '#f1eefe' : '#fff',
  color: isActive ? 'var(--indigo)' : 'var(--text)',
  textAlign: 'center',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.2s',
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
});

const pillStyle = {
  fontSize: '12.5px',
  fontWeight: 600,
  padding: '6px 14px',
  borderRadius: '20px',
  background: '#efeafe',
  color: 'var(--indigo)',
};

const outlineBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '10px 20px',
  borderRadius: '8px',
  border: '1px solid var(--line)',
  background: '#fff',
  color: 'var(--text)',
  fontSize: '13.5px',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
};
