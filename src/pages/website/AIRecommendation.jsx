import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { createRecommendation } from '../../api/aiRecommendations';
import {
  FaArrowRight, FaArrowLeft, FaMapMarkerAlt, FaHome, FaStar,
  FaCheckCircle, FaPhone, FaCompass, FaRegBuilding, FaSeedling,
  FaChartLine, FaBuilding, FaRoad, FaStarHalfAlt, FaRulerCombined,
  FaShieldAlt, FaAsterisk, FaRedo, FaMapPin,
} from 'react-icons/fa';

const steps = [
  { id: 1, title: 'Budget', description: 'What is your budget range?' },
  { id: 2, title: 'Location', description: 'Preferred location or city' },
  { id: 3, title: 'Property Type', description: 'Type of property you need' },
  { id: 4, title: 'Purpose', description: 'Purpose of purchase' },
];

const budgetRanges = [
  { label: 'Under ₹10 Lakhs', value: '0-1000000', icon: '🏠', desc: 'Affordable plots to get started' },
  { label: '₹10 – ₹15 Lakhs', value: '1000000-1500000', icon: '🏡', desc: 'Mid-range residential options' },
  { label: '₹15 – ₹20 Lakhs', value: '1500000-2000000', icon: '🏘️', desc: 'Premium plots in prime areas' },
  { label: 'Above ₹20 Lakhs', value: '2000000+', icon: '🏰', desc: 'Luxury & investment-grade land' },
];

const locations = [
  { name: 'Bhubaneswar', desc: 'Capital city — top appreciation', icon: FaMapPin },
  { name: 'Cuttack', desc: 'Historic city — growing fast', icon: FaMapMarkerAlt },
  { name: 'Puri', desc: 'Coastal town — tourism hub', icon: FaMapMarkerAlt },
  { name: 'Khordha', desc: 'Emerging corridor — great value', icon: FaMapMarkerAlt },
];

const propertyTypes = [
  { name: 'Residential Plot', desc: 'Build your dream home', icon: FaHome },
  { name: 'Commercial Plot', desc: 'Shops, offices & more', icon: FaBuilding },
  { name: 'Villa', desc: 'Luxury villa plots', icon: FaRegBuilding },
  { name: 'Farm Land', desc: 'Agricultural & farm plots', icon: FaSeedling },
];

const purposes = [
  { name: 'Investment', desc: 'High future value appreciation', icon: FaChartLine },
  { name: 'Self Use', desc: 'Build your own home or office', icon: FaHome },
  { name: 'Both', desc: 'Utility + investment growth', icon: FaAsterisk },
];

const PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80',
];

const formatCurrency = (val) => {
  if (!val) return '—';
  return '₹ ' + Number(val).toLocaleString('en-IN');
};

/* ===== Score Ring SVG ===== */
const ScoreRing = ({ score }) => {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? '#2ecc71' : score >= 50 ? '#f39c12' : '#e74c3c';
  return (
    <div className="score-ring-wrap">
      <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e6e6f0" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="score-ring-inner">
        <span className="score-ring-num" style={{ color }}>{score}</span>
        <span className="score-ring-lbl">% MATCH</span>
      </div>
    </div>
  );
};

export default function AIRecommendation() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ budget: '', location: '', propertyType: '', purpose: '' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [analyzingStep, setAnalyzingStep] = useState(0);

  const updateField = (field, value) => setFormData((p) => ({ ...p, [field]: value }));
  const getFieldForStep = (s) => ({ 1: 'budget', 2: 'location', 3: 'propertyType', 4: 'purpose' })[s];

  const handleNext = () => {
    if (!formData[getFieldForStep(step)]) { toast.error('Please select an option to continue'); return; }
    if (step < 4) setStep(step + 1); else handleSubmit();
  };

  const handleBack = () => { if (step > 1) setStep(step - 1); };

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    setAnalyzingStep(0);
    const iv = setInterval(() => { i++; if (i < 4) setAnalyzingStep(i); }, 600);
    return () => clearInterval(iv);
  }, [loading]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await createRecommendation(formData);
      const rec = data?.data;
      if (rec?.recommendedPlots?.length > 0) {
        setResults(rec);
      } else {
        toast.error('No matching plots found. Try different preferences.');
        setResults({ recommendedPlots: [], totalResults: 0, preferences: formData });
      }
    } catch {
      toast.error('Unable to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setResults(null); setStep(1);
    setFormData({ budget: '', location: '', propertyType: '', purpose: '' });
  };

  /* ===== LOADING STATE ===== */
  if (loading) {
    return (
      <div className="ai-page">
        <div className="ai-loading-card">
          <motion.div className="ai-loading-spinner" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
          <h3 className="ai-loading-title">Finding Your Perfect Plot</h3>
          <p className="ai-loading-sub">Our intelligent engine is analyzing hundreds of plots to match your preferences.</p>
          <div className="ai-loading-steps">
            {['Scanning available plots...', 'Analyzing location data...', 'Calculating price matches...', 'Ranking best options...'].map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: analyzingStep >= i ? 1 : 0.35, x: 0 }} transition={{ delay: i * 0.15 }}
                className={`ai-loading-step ${analyzingStep >= i ? 'active' : ''}`}>
                {analyzingStep > i ? <FaCheckCircle className="ai-loading-step-icon done" />
                  : analyzingStep === i ? <motion.div className="ai-loading-step-spinner" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                    : <div className="ai-loading-step-dot" />}
                {msg}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ===== RESULTS STATE ===== */
  if (results) {
    const plots = results.recommendedPlots || [];
    return (
      <div className="ai-page">
        {/* Header */}
        <div className="ai-header">
          <div className="ai-header-orb" />
          <div className="wrap" style={{ textAlign: 'center' }}>
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--gold)' }}>AI POWERED ANALYSIS</span>
            <h1 className="ai-header-title">Your Matched Properties</h1>
            <p className="ai-header-desc">
              {plots.length > 0
                ? `Found ${results.totalResults || plots.length} plots — showing top ${plots.length} matches ranked by compatibility.`
                : 'No plots matched your exact criteria. Try adjusting your preferences.'}
            </p>
          </div>
        </div>

        <div className="wrap" style={{ marginTop: '-28px', position: 'relative', zIndex: 10 }}>
          <div className="ai-results-container">
            {/* Preference pills */}
            <div className="ai-prefs-bar">
              <span className="ai-prefs-label">Your Preferences:</span>
              <span className="ai-pill">{budgetRanges.find((b) => b.value === formData.budget)?.label || formData.budget}</span>
              <span className="ai-pill">{formData.location}</span>
              <span className="ai-pill">{formData.propertyType}</span>
              <span className="ai-pill">{formData.purpose}</span>
            </div>

            {plots.length === 0 ? (
              <div className="ai-empty-card">
                <div className="ai-empty-icon">🔍</div>
                <h3 className="ai-empty-title">No Matching Plots Found</h3>
                <p className="ai-empty-desc">We couldn't find plots matching your exact preferences. Try adjusting your budget range or exploring a different location.</p>
                <button onClick={resetWizard} className="ai-retry-btn"><FaRedo /> Adjust Preferences</button>
              </div>
            ) : (
              <div className="ai-results-list">
                {plots.map((rec, i) => {
                  const plot = rec.plot || {};
                  const project = rec.project || plot.project || {};
                  const image = project.images?.[0] || PROJECT_IMAGES[i % PROJECT_IMAGES.length];
                  return (
                    <motion.div key={rec.plot?._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="ai-result-card">
                      {i === 0 && <div className="ai-top-badge"><FaStar /> TOP MATCH</div>}
                      <div className="ai-result-img-wrap">
                        <img src={image} alt={plot.plotNumber || 'Plot'} className="ai-result-img" />
                        <div className="ai-result-plot-tag">Plot {plot.plotNumber || 'N/A'}</div>
                      </div>
                      <div className="ai-result-body">
                        <div className="ai-result-head">
                          <div className="ai-result-head-text">
                            <h3 className="ai-result-name">{project.name || 'Recommended Plot'}</h3>
                            <p className="ai-result-loc">
                              <FaMapMarkerAlt />
                              {project.location?.city || ''}{project.location?.state ? `, ${project.location.state}` : ''}
                            </p>
                          </div>
                          <ScoreRing score={rec.score} />
                        </div>

                        <div className="ai-result-meta">
                          <span className="ai-meta-badge"><FaRulerCombined /> {plot.size ? `${plot.size} sq.ft` : '—'}</span>
                          {plot.facing && <span className="ai-meta-badge"><FaCompass /> {plot.facing}</span>}
                          {plot.corner && <span className="ai-meta-badge ai-meta-green"><FaStarHalfAlt /> Corner</span>}
                          {plot.roadWidth && <span className="ai-meta-badge"><FaRoad /> {plot.roadWidth}ft road</span>}
                        </div>

                        {rec.matchReasons?.length > 0 && (
                          <div className="ai-reasons">
                            {rec.matchReasons.slice(0, 3).map((reason, ri) => (
                              <div key={ri} className="ai-reason"><FaCheckCircle className="ai-reason-icon" />{reason}</div>
                            ))}
                          </div>
                        )}

                        {rec.scoreBreakdown?.length > 0 && (
                          <div className="ai-breakdown">
                            {rec.scoreBreakdown.slice(0, 4).map((item, bi) => (
                              <span key={bi} className="ai-breakdown-tag">{item.label} +{item.points}</span>
                            ))}
                          </div>
                        )}

                        <div className="ai-result-foot">
                          <div className="ai-result-price-col">
                            <span className="ai-result-price">{formatCurrency(plot.price)}</span>
                            {plot.pricePerSqft && <span className="ai-result-psf">@ ₹{plot.pricePerSqft.toLocaleString('en-IN')}/sq.ft</span>}
                          </div>
                          <div className="ai-result-actions">
                            <Link to="/book-visit" className="btn-gold ai-visit-btn">Schedule Visit <FaArrowRight /></Link>
                            <a href="tel:+917000012345" className="ai-call-btn"><FaPhone /> Call</a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="ai-reset-row">
              <button onClick={resetWizard} className="ai-reset-link"><FaRedo /> Start New Search</button>
            </div>
          </div>
        </div>

        <style>{resultStyles}</style>
      </div>
    );
  }

  /* ===== WIZARD STATE ===== */
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

/* ===== ALL STYLES IN ONE <style> TAG ===== */
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

  /* --- Loading --- */
  .ai-loading-card {
    background: #fff; border-radius: 20px; padding: 48px 40px;
    box-shadow: 0 20px 60px rgba(20,20,60,.1); text-align: center;
    max-width: 440px; width: 90%; margin: 120px auto;
  }
  .ai-loading-spinner {
    width: 64px; height: 64px; margin: 0 auto 24px;
    border-radius: 50%; border: 4px solid #e6e6f0; border-top-color: var(--indigo);
  }
  .ai-loading-title { font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .ai-loading-sub { font-size: 13.5px; color: #6b6f8a; margin-bottom: 28px; line-height: 1.6; }
  .ai-loading-steps { display: flex; flex-direction: column; gap: 10px; text-align: left; }
  .ai-loading-step {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 600;
    background: #f7f7fb; color: #b7bade; transition: all .3s;
  }
  .ai-loading-step.active { background: #f1eefe; color: var(--indigo); }
  .ai-loading-step-icon.done { color: #2ecc71; font-size: 14px; }
  .ai-loading-step-spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid var(--indigo); border-top-color: transparent;
  }
  .ai-loading-step-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid #e6e6f0; }

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
    .ai-loading-card { margin: 80px auto; padding: 36px 24px; }
  }
`;

const resultStyles = `
  /* --- Results Container --- */
  .ai-results-container { max-width: 860px; margin: 0 auto; }

  /* --- Preference Bar --- */
  .ai-prefs-bar {
    background: #fff; border-radius: 14px; border: 1px solid var(--line);
    padding: 14px 20px; margin-bottom: 24px;
    display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
    box-shadow: 0 2px 10px rgba(20,20,60,.04);
  }
  .ai-prefs-label { color: #6b6f8a; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
  .ai-pill { font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 20px; background: #efeafe; color: var(--indigo); }

  /* --- Results List --- */
  .ai-results-list { display: flex; flex-direction: column; gap: 16px; }

  /* --- Result Card --- */
  .ai-result-card {
    background: #fff; border-radius: 16px; border: 1px solid var(--line);
    box-shadow: 0 4px 20px rgba(20,20,60,.05); overflow: hidden;
    display: flex; flex-direction: row; position: relative; transition: box-shadow .25s, transform .25s;
  }
  .ai-result-card:hover { box-shadow: 0 12px 36px rgba(20,20,60,.1); transform: translateY(-3px); }
  .ai-top-badge {
    position: absolute; top: 14px; left: 14px; z-index: 2;
    background: linear-gradient(135deg, var(--gold), var(--gold-dark));
    color: var(--navy); font-size: 10px; font-weight: 700;
    padding: 5px 12px; border-radius: 12px;
    display: flex; align-items: center; gap: 4px;
  }

  /* --- Result Image --- */
  .ai-result-img-wrap { width: 220px; min-height: 200px; position: relative; overflow: hidden; flex-shrink: 0; }
  .ai-result-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s; }
  .ai-result-card:hover .ai-result-img { transform: scale(1.04); }
  .ai-result-plot-tag {
    position: absolute; bottom: 10px; left: 10px;
    background: rgba(15,18,48,.85); backdrop-filter: blur(6px);
    color: #fff; font-size: 11px; font-weight: 600;
    padding: 5px 10px; border-radius: 8px;
  }

  /* --- Result Body --- */
  .ai-result-body { flex: 1; padding: 22px 26px; display: flex; flex-direction: column; min-width: 0; }
  .ai-result-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; margin-bottom: 4px; }
  .ai-result-head-text { flex: 1; min-width: 0; }
  .ai-result-name { font-size: 18px; font-weight: 800; color: var(--text); margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ai-result-loc { font-size: 12.5px; color: #6b6f8a; display: flex; align-items: center; gap: 5px; margin: 0; }

  /* --- Score Ring --- */
  .score-ring-wrap { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
  .score-ring-inner { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .score-ring-num { font-size: 16px; font-weight: 800; line-height: 1; }
  .score-ring-lbl { font-size: 8px; color: #6b6f8a; font-weight: 600; }

  /* --- Meta Badges --- */
  .ai-result-meta { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0 12px; }
  .ai-meta-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 600; padding: 4px 10px;
    border-radius: 8px; background: #f7f7fb; color: #6b6f8a; border: 1px solid #e6e6f0;
  }
  .ai-meta-green { background: #e6f7ed; color: #27ae60; border-color: #c3ecd4; }

  /* --- Reasons --- */
  .ai-reasons { margin-bottom: 12px; }
  .ai-reason { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b6f8a; margin-bottom: 4px; }
  .ai-reason-icon { color: #2ecc71; font-size: 10px; flex-shrink: 0; }

  /* --- Score Breakdown --- */
  .ai-breakdown { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
  .ai-breakdown-tag {
    font-size: 10px; font-weight: 600; padding: 3px 8px;
    border-radius: 6px; background: #f7f7fb; color: #6b6f8a; border: 1px solid #e6e6f0;
  }

  /* --- Result Footer --- */
  .ai-result-foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 14px; border-top: 1px solid #f0f0f6; }
  .ai-result-price-col { display: flex; gap: 12px; align-items: baseline; }
  .ai-result-price { font-weight: 800; color: var(--gold-dark); font-size: 18px; }
  .ai-result-psf { font-size: 11.5px; color: #6b6f8a; }
  .ai-result-actions { display: flex; gap: 8px; }
  .ai-visit-btn { text-decoration: none; font-size: 12.5px; padding: 9px 18px; border: none; border-radius: 8px; }
  .ai-call-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 9px 16px; border-radius: 8px; border: 1px solid var(--line);
    background: #fff; color: var(--text); font-size: 12.5px;
    font-weight: 600; cursor: pointer; text-decoration: none; transition: all .2s;
  }
  .ai-call-btn:hover { border-color: #c5c3ea; background: #f7f7fb; }

  /* --- Empty State --- */
  .ai-empty-card {
    background: #fff; border-radius: 16px; border: 1px solid var(--line);
    padding: 60px 32px; text-align: center;
    box-shadow: 0 4px 20px rgba(20,20,60,.05);
  }
  .ai-empty-icon { font-size: 48px; margin-bottom: 16px; }
  .ai-empty-title { font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .ai-empty-desc { font-size: 14px; color: #6b6f8a; max-width: 400px; margin: 0 auto 24px; line-height: 1.6; }
  .ai-retry-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, var(--gold), var(--gold-dark));
    color: var(--navy); padding: 12px 24px; border-radius: 10px;
    font-size: 14px; font-weight: 700; border: none; cursor: pointer;
  }

  /* --- Reset Row --- */
  .ai-reset-row { text-align: center; margin-top: 36px; }
  .ai-reset-link {
    background: none; border: none; color: var(--indigo);
    font-size: 14px; font-weight: 600; cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 20px; border-radius: 8px; transition: background .2s;
  }
  .ai-reset-link:hover { background: #f1eefe; }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .ai-header { padding: 48px 0 44px; }
    .ai-header-title { font-size: 28px; }
    .ai-header-desc { font-size: 14px; }
    .ai-result-card { flex-direction: column; }
    .ai-result-img-wrap { width: 100%; min-height: 180px; max-height: 200px; }
    .ai-result-body { padding: 18px 18px; }
    .ai-result-name { font-size: 16px; white-space: normal; }
    .ai-result-head { flex-direction: column-reverse; gap: 10px; }
    .score-ring-wrap { width: 56px; height: 56px; }
    .score-ring-num { font-size: 14px; }
    .ai-result-foot { flex-direction: column; align-items: flex-start; gap: 12px; }
    .ai-result-actions { width: 100%; }
    .ai-visit-btn { flex: 1; justify-content: center; }
    .ai-call-btn { flex: 1; justify-content: center; }
    .ai-top-badge { top: 10px; left: 10px; }
    .ai-prefs-bar { padding: 12px 16px; }
    .ai-empty-card { padding: 40px 20px; }
  }
`;
