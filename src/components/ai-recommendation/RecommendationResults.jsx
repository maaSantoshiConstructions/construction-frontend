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
  resultStyles,
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
