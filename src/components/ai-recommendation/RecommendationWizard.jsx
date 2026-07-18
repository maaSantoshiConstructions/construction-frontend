import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle, FaArrowLeft, FaArrowRight, FaShieldAlt,
  FaMapPin, FaMapMarkerAlt, FaHome, FaRegBuilding,
  FaBuilding, FaCompass, FaChartLine, FaAsterisk,
} from 'react-icons/fa';

const steps = [
  { id: 1, title: 'Budget', description: 'What is your budget range?' },
  { id: 2, title: 'Location', description: 'Preferred location or city' },
  { id: 3, title: 'Property Type', description: 'Type of property you need' },
  { id: 4, title: 'Purpose', description: 'Purpose of purchase' },
];

const budgetRanges = [
  { label: 'Under ₹10 Lakhs', value: '0-1000000', icon: '🏠', desc: 'Affordable plots to get started' },
  { label: '₹10 – ₹25 Lakhs', value: '1000000-2500000', icon: '🏡', desc: 'Value residential plots' },
  { label: '₹25 – ₹40 Lakhs', value: '2500000-4000000', icon: '🏘️', desc: 'Mid-range premium options' },
  { label: '₹40 – ₹60 Lakhs', value: '4000000-6000000', icon: '🏢', desc: 'Premium investment plots' },
  { label: 'Above ₹60 Lakhs', value: '6000000+', icon: '🏰', desc: 'Luxury & investment-grade land' },
];

const locations = [
  { name: 'Bhubaneswar', desc: 'Capital city — top appreciation', icon: FaMapPin },
  { name: 'Cuttack', desc: 'Historic city — growing fast', icon: FaMapMarkerAlt },
  { name: 'Puri', desc: 'Coastal town — tourism hub', icon: FaMapMarkerAlt },
  { name: 'Khordha', desc: 'Emerging corridor — great value', icon: FaMapMarkerAlt },
];

const propertyTypes = [
  { name: 'Plotted Development', desc: 'Residential plots & land', icon: FaHome },
  { name: 'Villas', desc: 'Premium villa projects', icon: FaRegBuilding },
  { name: 'Apartments', desc: 'Flat & apartment units', icon: FaBuilding },
  { name: 'Commercial', desc: 'Shops, offices & more', icon: FaCompass },
];

const purposes = [
  { name: 'Investment', desc: 'High future value appreciation', icon: FaChartLine },
  { name: 'Self Use', desc: 'Build your own home or office', icon: FaHome },
  { name: 'Both', desc: 'Utility + investment growth', icon: FaAsterisk },
];

export default function RecommendationWizard({
  step,
  formData,
  updateField,
  getFieldForStep,
  handleBack,
  handleNext,
  loading,
}) {
  return (
    <div className="ai-page">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-orb" />
        <div className="wrap" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>AI PROPERTY FINDER</span>
          <h1 className="ai-header-title">Find Your Perfect Plot</h1>
          <p className="ai-header-desc">Answer 4 quick questions and our intelligent engine will match you with the best available plots.</p>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10 }}>
        <div className="ai-wizard-container">
          <div className="ai-wizard-card">
            {/* Stepper */}
            <div className="ai-stepper">
              {steps.map((s) => (
                <div key={s.id} className="ai-stepper-item">
                  <div className={`ai-stepper-circle ${step > s.id ? 'done' : step === s.id ? 'active' : ''}`}>
                    {step > s.id ? <FaCheckCircle /> : s.id}
                  </div>
                  <span className={`ai-stepper-title ${step >= s.id ? 'active' : ''}`}>{s.title}</span>
                  {s.id < 4 && <div className={`ai-stepper-line ${step > s.id ? 'done' : ''}`} />}
                </div>
              ))}
            </div>

            <div className="ai-step-counter">Step {step} of 4</div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                {step === 1 && (
                  <div>
                    <h2 className="ai-form-title">What's your budget?</h2>
                    <p className="ai-form-sub">Select the range that works best for you.</p>
                    <div className="ai-wizard-grid">
                      {budgetRanges.map((r) => (
                        <button key={r.value} type="button" onClick={() => updateField('budget', r.value)}
                          className={`ai-option-card ${formData.budget === r.value ? 'selected' : ''}`}>
                          <span className="ai-option-emoji">{r.icon}</span>
                          <span className="ai-option-label">{r.label}</span>
                          <span className="ai-option-desc">{r.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <h2 className="ai-form-title">Preferred Location</h2>
                    <p className="ai-form-sub">Where are you looking to buy or invest?</p>
                    <div className="ai-wizard-grid">
                      {locations.map((loc) => (
                        <button key={loc.name} type="button" onClick={() => updateField('location', loc.name)}
                          className={`ai-option-card ${formData.location === loc.name ? 'selected' : ''}`}>
                          <loc.icon className={`ai-option-icon ${formData.location === loc.name ? 'active' : ''}`} />
                          <span className="ai-option-label">{loc.name}</span>
                          <span className="ai-option-desc">{loc.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <h2 className="ai-form-title">Property Type</h2>
                    <p className="ai-form-sub">What kind of property are you looking for?</p>
                    <div className="ai-wizard-grid">
                      {propertyTypes.map((t) => (
                        <button key={t.name} type="button" onClick={() => updateField('propertyType', t.name)}
                          className={`ai-option-card ${formData.propertyType === t.name ? 'selected' : ''}`}>
                          <t.icon className={`ai-option-icon ${formData.propertyType === t.name ? 'active' : ''}`} />
                          <span className="ai-option-label">{t.name}</span>
                          <span className="ai-option-desc">{t.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {step === 4 && (
                  <div>
                    <h2 className="ai-form-title">Purpose of Purchase</h2>
                    <p className="ai-form-sub">What's your primary goal?</p>
                    <div className="ai-purpose-list">
                      {purposes.map((p) => (
                        <button key={p.name} type="button" onClick={() => updateField('purpose', p.name)}
                          className={`ai-purpose-card ${formData.purpose === p.name ? 'selected' : ''}`}>
                          <div className={`ai-purpose-icon-box ${formData.purpose === p.name ? 'active' : ''}`}>
                            <p.icon />
                          </div>
                          <div className="ai-purpose-text">
                            <span className="ai-purpose-name">{p.name}</span>
                            <span className="ai-purpose-desc">{p.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="ai-form-actions">
              <button type="button" onClick={handleBack} disabled={step === 1}
                className={`ai-back-btn ${step === 1 ? 'disabled' : ''}`}>
                <FaArrowLeft /> Back
              </button>
              <button type="button" onClick={handleNext} disabled={loading}
                className={`btn-gold ai-next-btn ${!formData[getFieldForStep(step)] ? 'dim' : ''}`}>
                {step === 4 ? <>Get Recommendations <FaArrowRight /></> : <>Continue <FaArrowRight /></>}
              </button>
            </div>
          </div>

          <p className="ai-privacy-note"><FaShieldAlt /> Your preferences are secure and never shared with third parties.</p>
        </div>
      </div>

      <style>{wizardStyles}</style>
    </div>
  );
}

const wizardStyles = `
  .ai-page { background: #f7f7fb; min-height: 100vh; padding-bottom: 90px; }

  /* --- Header --- */
  .ai-header {
    background: radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%),
                linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%);
    padding: 64px 0 60px; position: relative; overflow: hidden; text-align: center;
  }
  .ai-header-orb { position: absolute; top: -80px; left: -80px; width: 320px; height: 320px; border-radius: 50%; background: rgba(91,79,224,.1); }
  .ai-header-title { font-family: Poppins,Inter,sans-serif; font-size: 40px; font-weight: 800; color: #fff; margin: 8px 0 14px; }
  .ai-header-desc { color: #b7bade; font-size: 16px; max-width: 500px; margin: 0 auto; line-height: 1.6; }

  /* --- Wizard Container --- */
  .ai-wizard-container { max-width: 620px; margin: 0 auto; }
  .ai-wizard-card {
    background: #fff; border-radius: 16px; border: 1px solid var(--line);
    box-shadow: 0 15px 40px rgba(20,20,60,.1); padding: 36px;
  }

  /* --- Stepper --- */
  .ai-stepper { display: flex; align-items: center; margin-bottom: 28px; }
  .ai-stepper-item { display: flex; align-items: center; flex: 1; }
  .ai-stepper-item:last-child { flex: none; }
  .ai-stepper-circle {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; transition: all .3s;
    background: #e6e6f0; color: #6b6f8a;
  }
  .ai-stepper-circle.active { background: var(--indigo); color: #fff; box-shadow: 0 4px 14px rgba(58,47,184,.3); }
  .ai-stepper-circle.done { background: #2ecc71; color: #fff; }
  .ai-stepper-title { font-size: 12px; font-weight: 600; color: #b7bade; margin-left: 10px; white-space: nowrap; }
  .ai-stepper-title.active { color: var(--text); }
  .ai-stepper-line { flex: 1; height: 3px; margin: 0 12px; border-radius: 2px; background: #e6e6f0; transition: all .3s; }
  .ai-stepper-line.done { background: #2ecc71; }
  .ai-step-counter { font-size: 11px; color: #6b6f8a; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 18px; }

  /* --- Form Title / Sub --- */
  .ai-form-title { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
  .ai-form-sub { font-size: 13.5px; color: #6b6f8a; margin-bottom: 24px; }

  /* --- Wizard Grid (2-col) --- */
  .ai-wizard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* --- Option Card --- */
  .ai-option-card {
    width: 100%; padding: 20px 16px; border-radius: 12px;
    border: 2px solid #e6e6f0; background: #fff;
    text-align: center; cursor: pointer; transition: all .2s;
    outline: none; display: flex; flex-direction: column; align-items: center;
  }
  .ai-option-card:hover { border-color: #c5c3ea; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(20,20,60,.07); }
  .ai-option-card.selected { border-color: var(--indigo); background: #f1eefe; }
  .ai-option-emoji { font-size: 26px; margin-bottom: 8px; }
  .ai-option-icon { font-size: 22px; margin-bottom: 8px; color: #b7bade; transition: color .2s; }
  .ai-option-icon.active { color: var(--indigo); }
  .ai-option-label { font-size: 14px; font-weight: 600; color: var(--text); transition: color .2s; }
  .ai-option-card.selected .ai-option-label { color: var(--indigo); font-weight: 700; }
  .ai-option-desc { font-size: 11.5px; color: #6b6f8a; font-weight: 400; margin-top: 3px; }

  /* --- Purpose List --- */
  .ai-purpose-list { display: flex; flex-direction: column; gap: 10px; }
  .ai-purpose-card {
    width: 100%; padding: 16px 20px; border-radius: 12px;
    border: 2px solid #e6e6f0; background: #fff;
    display: flex; align-items: center; gap: 14px;
    cursor: pointer; transition: all .2s; outline: none;
  }
  .ai-purpose-card:hover { border-color: #c5c3ea; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(20,20,60,.06); }
  .ai-purpose-card.selected { border-color: var(--indigo); background: #f1eefe; }
  .ai-purpose-icon-box {
    width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #f7f7fb; color: #6b6f8a; font-size: 16px; transition: all .2s;
  }
  .ai-purpose-icon-box.active { background: var(--indigo); color: #fff; }
  .ai-purpose-text { text-align: left; }
  .ai-purpose-name { font-size: 14.5px; font-weight: 600; color: var(--text); display: block; transition: color .2s; }
  .ai-purpose-card.selected .ai-purpose-name { color: var(--indigo); font-weight: 700; }
  .ai-purpose-desc { font-size: 12px; color: #6b6f8a; font-weight: 400; }

  /* --- Form Actions --- */
  .ai-form-actions { display: flex; justify-content: space-between; margin-top: 32px; align-items: center; }
  .ai-back-btn {
    padding: 12px 24px; border: 1px solid var(--line); background: #fff;
    color: #6b6f8a; border-radius: 10px; font-size: 14px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 6px; outline: none; transition: all .2s;
  }
  .ai-back-btn:hover { border-color: #c5c3ea; color: var(--text); }
  .ai-back-btn.disabled { color: #e6e6f0; cursor: not-allowed; }
  .ai-back-btn.disabled:hover { border-color: var(--line); }
  .ai-next-btn { padding: 12px 28px; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; outline: none; transition: all .2s; }
  .ai-next-btn.dim { opacity: .55; }

  .ai-privacy-note { text-align: center; font-size: 12px; color: #b7bade; margin-top: 16px; display: flex; align-items: center; justify-content: center; gap: 6px; }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .ai-header { padding: 48px 0 44px; }
    .ai-header-title { font-size: 28px; }
    .ai-header-desc { font-size: 14px; }
    .ai-wizard-card { padding: 24px 20px; }
    .ai-stepper-title { display: none; }
    .ai-stepper-circle { width: 32px; height: 32px; font-size: 12px; }
    .ai-stepper-line { margin: 0 6px; height: 2px; }
    .ai-wizard-grid { grid-template-columns: 1fr; }
    .ai-form-title { font-size: 18px; }
    .ai-option-card { padding: 16px 14px; }
    .ai-option-emoji { font-size: 22px; }
    .ai-next-btn { padding: 12px 20px; font-size: 13px; }
    .ai-back-btn { padding: 12px 18px; font-size: 13px; }
  }
`;
