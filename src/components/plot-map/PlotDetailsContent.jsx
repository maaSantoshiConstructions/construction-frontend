import React from 'react';
import { Link } from 'react-router-dom';
import {
  LuX,
  LuRuler,
  LuCompass,
  LuMilestone,
  LuMapPin,
  LuTrendingUp,
  LuStar,
  LuExternalLink,
  LuBookmark,
} from 'react-icons/lu';

const statusConfig = {
  available: { badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Available' },
  reserved: { badgeClass: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Reserved' },
  sold: { badgeClass: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Sold' },
  blocked: { badgeClass: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Blocked' },
};

const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');
const formatSize = (val) => (val || 0).toLocaleString('en-IN');

function getAIInsights(plot) {
  if (!plot) return null;
  const score = plot.status === 'available' ? (plot.corner ? 92 : 85) : 60;
  const bestFor = [];
  if (plot.corner) bestFor.push('Investment');
  if (plot.size > 1200) bestFor.push('Family Villa');
  if (plot.facing === 'East' || plot.facing === 'North-East') bestFor.push('Vastu Preferred');
  if (plot.status === 'available') bestFor.push('First-time Buyers');
  if (bestFor.length === 0) bestFor.push('Residential Plot');
  const highlights = [];
  if (plot.roadWidth >= 30) highlights.push('Wide Road Access');
  if (plot.corner) highlights.push('Corner Plot Advantage');
  if (plot.facing === 'East') highlights.push('Morning Sunlight');
  if (plot.facing === 'North-East') highlights.push('Ishaan Corner (Auspicious)');
  highlights.push('Developing Locality');
  return { score, bestFor, highlights, appreciation: score > 80 ? 'High (12-18% p.a.)' : 'Moderate (8-12% p.a.)' };
}

function InfoCard({ icon, label, value, highlight }) {
  return (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-slate-400 text-xs">{icon}</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-[15px] font-bold ${highlight ? 'text-amber-600' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}

export default function PlotDetailsContent({ plot, onClose, getProjectName }) {
  const ai = getAIInsights(plot);
  const st = statusConfig[plot.status] || statusConfig.available;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200 flex justify-between items-start">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{getProjectName(plot)}</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-['Poppins',sans-serif]">Plot {plot.plotNumber}</h2>
          <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-bold border ${st.badgeClass}`}>
            {st.label}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bg-white border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-colors outline-none shrink-0"
        >
          <LuX />
        </button>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <InfoCard icon={<LuRuler />} label="Plot Size" value={`${formatSize(plot.size)} sqft`} />
          <InfoCard icon={<LuCompass />} label="Facing" value={plot.facing || '—'} />
          {plot.roadWidth && <InfoCard icon={<LuMilestone />} label="Road Width" value={`${plot.roadWidth} ft`} />}
          {plot.corner && <InfoCard icon={<LuMapPin />} label="Type" value="Corner Plot" highlight />}
        </div>

        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">Total Price</div>
          <div className="text-2xl font-extrabold text-amber-800 font-['Poppins',sans-serif]">{formatCurrency(plot.price)}</div>
          {plot.pricePerSqft && <div className="text-xs text-amber-700 mt-0.5 font-medium">@ {formatCurrency(plot.pricePerSqft)}/sqft</div>}
        </div>

        {ai && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl border border-blue-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <LuTrendingUp className="text-blue-600 text-base" />
              <span className="text-xs font-bold text-blue-800 font-['Poppins',sans-serif]">AI Insights</span>
            </div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-11 h-11 rounded-xl bg-white border-2 border-blue-500 flex items-center justify-center shrink-0">
                <span className="text-base font-extrabold text-blue-600">{ai.score}</span>
              </div>
              <div>
                <div className="text-xs font-bold text-blue-800">Investment Score</div>
                <div className="text-[11px] text-slate-500">Based on location, price & demand</div>
              </div>
            </div>
            <div className="mb-2.5">
              <div className="text-[11px] font-bold text-blue-800 mb-1.5">Best For</div>
              <div className="flex gap-1.5 flex-wrap">
                {ai.bestFor.map((b) => (
                  <span key={b} className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white text-blue-800 border border-blue-200">{b}</span>
                ))}
              </div>
            </div>
            <div className="mb-2.5">
              <div className="text-[11px] font-bold text-blue-800 mb-1.5">Key Highlights</div>
              {ai.highlights.map((h) => (
                <div key={h} className="text-xs text-slate-600 py-0.5 flex items-center gap-1.5">
                  <LuStar className="text-amber-500 text-[10px] shrink-0 fill-amber-500" /> {h}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-blue-200">
              <LuTrendingUp className="text-emerald-500 text-xs" />
              <span className="text-xs text-slate-600">Future Appreciation: </span>
              <span className="text-xs font-bold text-emerald-700">{ai.appreciation}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col">
          {[
            { label: 'Plot Number', value: plot.plotNumber },
            { label: 'Facing', value: plot.facing },
            plot.roadWidth && { label: 'Road Width', value: `${plot.roadWidth} ft` },
            plot.corner !== undefined && { label: 'Corner Plot', value: plot.corner ? 'Yes' : 'No' },
            { label: 'Price/Sqft', value: plot.pricePerSqft ? formatCurrency(plot.pricePerSqft) : '—' },
          ].filter(Boolean).map((item, idx, arr) => (
            <div key={item.label} className={`flex justify-between py-2.5 ${idx < arr.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <span className="text-xs text-slate-500">{item.label}</span>
              <span className="text-xs font-semibold text-slate-700">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-2.5">
        {plot.status === 'available' ? (
          <>
            <Link to="/book-visit" className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-indigo-800 transition-all font-inter no-underline">
              <LuExternalLink className="text-xs" /> Book Site Visit
            </Link>
            <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-slate-700 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all font-inter no-underline">
              <LuBookmark className="text-xs" /> Reserve Plot
            </Link>
          </>
        ) : (
          <div className="w-full text-center py-3 bg-slate-50 text-slate-400 text-sm font-semibold rounded-xl border border-slate-200 capitalize">
            This plot is currently {plot.status}
          </div>
        )}
      </div>
    </div>
  );
}
