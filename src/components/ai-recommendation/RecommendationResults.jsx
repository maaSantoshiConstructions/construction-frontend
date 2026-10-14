import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LuStar, LuMapPin, LuRuler, LuCompass, LuSparkles,
  LuMap, LuCheck, LuArrowRight, LuPhone, LuRotateCcw,
  LuSearch, LuHouse, LuBuilding, LuBuilding2, LuLandmark, LuCrown
} from 'react-icons/lu';

const budgetRanges = [
  { label: 'Under ₹10 Lakhs', value: '0-1000000', icon: LuHouse, desc: 'Affordable plots to get started' },
  { label: '₹10 – ₹25 Lakhs', value: '1000000-2500000', icon: LuBuilding, desc: 'Value residential plots' },
  { label: '₹25 – ₹40 Lakhs', value: '2500000-4000000', icon: LuBuilding2, desc: 'Mid-range premium options' },
  { label: '₹40 – ₹60 Lakhs', value: '4000000-6000000', icon: LuLandmark, desc: 'Premium investment plots' },
  { label: 'Above ₹60 Lakhs', value: '6000000+', icon: LuCrown, desc: 'Luxury & investment-grade land' },
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
  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? '#2ecc71' : score >= 50 ? '#f39c12' : '#e74c3c';
  return (
    <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
      <svg className="w-14 h-14 sm:w-16 sm:h-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e6e6f0" strokeWidth="4.5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm sm:text-base font-extrabold leading-none" style={{ color }}>
          {score}
        </span>
        <span className="text-[8px] text-slate-500 font-semibold mt-0.5">% MATCH</span>
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
    <div className="bg-[#f7f7fb] min-h-screen pb-[90px]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0d1f0d] via-[#1a3a1a] to-[#162b16] text-center py-16 px-4 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-green-500/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-white/10 text-amber-400 border border-white/10">
            AI POWERED ANALYSIS
          </span>
          <h1 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-extrabold text-white my-3">
            Your Matched Properties
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            {plots.length > 0
              ? `Found ${results?.totalResults || plots.length} plots — showing top ${plots.length} matches ranked by compatibility.`
              : 'No plots matched your exact criteria. Try adjusting your preferences.'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-7 relative z-10">
        <div>
          {/* Preference pills */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-5 mb-6 flex flex-wrap gap-2.5 items-center shadow-xs">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Your Preferences:</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700">
              {budgetRanges.find((b) => b.value === formData.budget)?.label || formData.budget}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700">{formData.location}</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700">{formData.propertyType}</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700">{formData.purpose}</span>
          </div>

          {plots.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-16 text-center shadow-xs">
              <LuSearch size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Matching Plots Found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                We couldn't find plots matching your exact preferences. Try adjusting your budget range or exploring a different location.
              </p>
              <button
                onClick={resetWizard}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                <LuRotateCcw size={16} /> Adjust Preferences
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {plots.map((rec, i) => {
                const plot = rec.plot || {};
                const project = rec.project || plot.project || {};
                const image = project.images?.[0] || PROJECT_IMAGES[i % PROJECT_IMAGES.length];
                return (
                  <motion.div
                    key={rec.plot?._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col md:flex-row relative group"
                  >
                    {i === 0 && (
                      <div className="absolute top-3.5 left-3.5 z-10 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                        <LuStar className="fill-current" size={12} /> TOP MATCH
                      </div>
                    )}
                    <div className="w-full md:w-56 h-48 md:h-auto relative overflow-hidden shrink-0">
                      <img src={image} alt={plot.plotNumber || 'Plot'} className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                        Plot {plot.plotNumber || 'N/A'}
                      </div>
                    </div>
                    <div className="flex-1 p-4.5 sm:p-6 flex flex-col min-w-0">
                      <div className="flex flex-row justify-between items-start gap-3.5 mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 m-0 truncate">
                            {project.name || 'Recommended Plot'}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <LuMapPin size={13} className="text-green-700 shrink-0" />
                            {project.location?.city || ''}{project.location?.state ? `, ${project.location.state}` : ''}
                          </p>
                        </div>
                        <ScoreRing score={rec.score} />
                      </div>

                      <div className="flex flex-wrap gap-2 my-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                          <LuRuler size={13} /> {plot.size ? `${plot.size} sq.ft` : '—'}
                        </span>
                        {plot.facing && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                            <LuCompass size={13} /> {plot.facing}
                          </span>
                        )}
                        {plot.corner && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <LuSparkles size={13} /> Corner
                          </span>
                        )}
                        {plot.roadWidth && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                            <LuMap size={13} /> {plot.roadWidth}ft road
                          </span>
                        )}
                      </div>

                      {rec.matchReasons?.length > 0 && (
                        <div className="mb-3">
                          {rec.matchReasons.slice(0, 3).map((reason, ri) => (
                            <div key={ri} className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                              <LuCheck size={13} className="text-emerald-500 shrink-0 font-bold" />
                              {reason}
                            </div>
                          ))}
                        </div>
                      )}

                      {rec.scoreBreakdown?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3.5">
                          {rec.scoreBreakdown.slice(0, 4).map((item, bi) => (
                            <span key={bi} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                              {item.label} +{item.points}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex gap-2 items-baseline">
                          <span className="font-extrabold text-amber-700 text-lg">{formatCurrency(plot.price)}</span>
                          {plot.pricePerSqft && <span className="text-[11.5px] text-slate-500">@ ₹{plot.pricePerSqft.toLocaleString('en-IN')}/sq.ft</span>}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Link to="/book-visit" className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs px-4.5 py-2.5 rounded-lg no-underline transition-all shadow-xs">
                            Schedule Visit <LuArrowRight size={14} />
                          </Link>
                          <a href="tel:+917000012345" className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-all no-underline">
                            <LuPhone size={14} /> Call
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-9">
            <button onClick={resetWizard} className="bg-transparent border-0 text-green-700 hover:bg-green-50 font-semibold text-sm cursor-pointer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg transition-colors">
              <LuRotateCcw size={16} /> Start New Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
