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
  wizardStyles,
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
