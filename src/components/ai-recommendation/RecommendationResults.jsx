import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaStar, FaMapMarkerAlt, FaRulerCombined, FaCompass,
  FaRoad, FaStarHalfAlt, FaCheckCircle, FaArrowRight,
  FaPhone, FaRedo,
} from 'react-icons/fa';

const budgetRanges = [
  { label: 'Under ₹10 Lakhs', value: '0-1000000', icon: '🏠', desc: 'Affordable plots to get started' },
  { label: '₹10 – ₹25 Lakhs', value: '1000000-2500000', icon: '🏡', desc: 'Value residential plots' },
  { label: '₹25 – ₹40 Lakhs', value: '2500000-4000000', icon: '🏘️', desc: 'Mid-range premium options' },
  { label: '₹40 – ₹60 Lakhs', value: '4000000-6000000', icon: '🏢', desc: 'Premium investment plots' },
  { label: 'Above ₹60 Lakhs', value: '6000000+', icon: '🏰', desc: 'Luxury & investment-grade land' },
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

export default function RecommendationResults({
  results,
  formData,
  resetWizard,
}) {
  const plots = results?.recommendedPlots || [];

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
              ? `Found ${results?.totalResults || plots.length} plots — showing top ${plots.length} matches ranked by compatibility.`
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
