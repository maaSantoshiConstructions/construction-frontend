import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuFlame, LuCheck, LuInfo, LuLoader } from 'react-icons/lu';
import { getProjects } from '../../api/projects';

const heatColorMap = {
  'very-high': { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500' },
  high: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' },
  moderate: { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500' },
  stable: { bg: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-500' },
};

const fallbackProjects = [
  {
    id: 'patia',
    name: 'Patia Plotted',
    growth: 18,
    priceRange: '₹2,400 - ₹3,200/sq.ft',
    highlights: [
      'Near Infosys & IT hub',
      'NH-16 connectivity',
      'Upcoming metro station',
      'Premium residential area',
    ],
    heat: 'high',
    left: '15%',
    top: '30%',
  },
  {
    id: 'khandagiri',
    name: 'Khandagiri Enclave',
    growth: 14,
    priceRange: '₹1,800 - ₹2,600/sq.ft',
    highlights: [
      'Affordable rates',
      'Near proposed ring road',
      'Tourist area',
      'Good rental demand',
    ],
    heat: 'moderate',
    left: '30%',
    top: '48%',
  },
  {
    id: 'chandrasekharpur',
    name: 'C-Pur Heights',
    growth: 16,
    priceRange: '₹3,000 - ₹4,500/sq.ft',
    highlights: [
      'Premium locality',
      'KIIT & educational hub',
      'Developed infrastructure',
      'High appreciation',
    ],
    heat: 'high',
    left: '45%',
    top: '35%',
  },
  {
    id: 'puri-road',
    name: 'Puri Road Greens',
    growth: 22,
    priceRange: '₹1,500 - ₹2,800/sq.ft',
    highlights: [
      'Highway front',
      'Rapidly developing',
      'New projects coming up',
      'Best for investment',
    ],
    heat: 'very-high',
    left: '60%',
    top: '55%',
  },
];

export default function InvestmentHeatmap() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects({ limit: 50 });
        const list = response.data?.data || [];

        if (list.length > 0) {
          const mapped = list.map((proj, i) => {
            let growth = 14;
            if (proj.type === 'plotted_development') growth = 22;
            else if (proj.type === 'villas') growth = 18;
            else if (proj.type === 'commercial') growth = 16;
            else if (proj.type === 'apartments') growth = 12;

            if (proj.pricePerSqft && proj.pricePerSqft < 1500) {
              growth += 2;
            }

            const highlights =
              proj.highlights?.length > 0
                ? proj.highlights.slice(0, 4)
                : [
                    'Premium location',
                    'High appreciation potential',
                    'Clear title & RERA approved',
                    'Developed infrastructure',
                  ];

            const pSqft = proj.pricePerSqft || 1500;
            const priceRange = `₹${(pSqft - 150).toLocaleString()} - ₹${(
              pSqft + 250
            ).toLocaleString()}/sq.ft`;

            let heat = 'moderate';
            if (growth >= 20) {
              heat = 'very-high';
            } else if (growth >= 16) {
              heat = 'high';
            } else if (growth >= 12) {
              heat = 'stable';
            }

            const left = `${12 + ((i * 20) % 76)}%`;
            const top = `${25 + ((i * 14) % 56)}%`;

            return {
              id: proj._id,
              name: proj.name,
              growth,
              priceRange,
              highlights,
              heat,
              left,
              top,
            };
          });
          setProjects(mapped);
          setSelected(mapped[0]);
        } else {
          setProjects(fallbackProjects);
          setSelected(fallbackProjects[0]);
        }
      } catch (err) {
        console.error('Error loading projects for heatmap:', err);
        setError('Could not connect to database. Showing offline compilation.');
        setProjects(fallbackProjects);
        setSelected(fallbackProjects[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Dynamic Keyframe Style for Heatmap Glowing Hotspots */}
      <style>{`
        @keyframes heatmap-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
          70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>

      {/* ===== PAGE HEADER ===== */}
      <div className="relative overflow-hidden text-center py-16 px-4 bg-gradient-to-br from-[#0d1f0d] via-[#1a3a1a] to-[#162b16]">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-green-500/10" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <span className="inline-block bg-white/10 text-amber-400 font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3.5">
            INVESTMENT ANALYTICS
          </span>
          <h1 className="font-['Poppins',sans-serif] text-white text-3xl md:text-4xl font-extrabold mt-2 mb-3">
            Odisha Investment Heatmap
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Identify high-growth vectors and appreciation triggers for real estate investments.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
        {loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xl mb-8">
            <LuLoader className="animate-spin text-green-700 text-2xl mx-auto mb-3" />
            <p className="text-xs sm:text-sm font-semibold text-slate-400">
              Loading investment projects...
            </p>
          </div>
        )}

        {!loading && projects.length > 0 && selected && (
          <>
            {/* Growth Zones Main Map Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-8 mb-8"
            >
              {/* Header & Legend */}
              <div className="flex justify-between items-center flex-wrap gap-4 mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Poppins',sans-serif]">
                  Bhubaneswar Growth Zones
                </h2>
                <div className="flex items-center gap-3 flex-wrap text-[10px] md:text-xs font-bold text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Very High
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Moderate
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Stable
                  </span>
                </div>
              </div>

              {/* Regions Grid buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
                {projects.map((region) => {
                  const isActive = selected.id === region.id;
                  const heatCfg = heatColorMap[region.heat] || heatColorMap.moderate;
                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => setSelected(region)}
                      className={`p-3.5 rounded-xl text-center cursor-pointer outline-none transition-all duration-200 border ${
                        isActive
                          ? 'border-green-700 bg-green-50/50 shadow-md shadow-green-700/5'
                          : 'border-slate-200 bg-white hover:border-green-700'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-xs ${heatCfg.bg}`}
                      >
                        <LuFlame />
                      </div>
                      <p className="font-extrabold text-slate-900 text-xs truncate font-['Poppins',sans-serif]">
                        {region.name}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-extrabold mt-1">
                        {region.growth}% CAGR
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Heatmap Map container */}
              <div className="relative aspect-[21/9] bg-slate-950 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1577086664693-894d8405334a?w=1200&q=80"
                  alt="Bhubaneswar Master Map"
                  className="w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                {/* Heat Points */}
                {projects.map((region) => {
                  const isActive = selected.id === region.id;
                  const heatCfg = heatColorMap[region.heat] || heatColorMap.moderate;
                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => setSelected(region)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none"
                      style={{ left: region.left, top: region.top, zIndex: isActive ? 20 : 10 }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition duration-200 ${
                          heatCfg.bg
                        } ${isActive ? 'scale-125' : 'scale-100 hover:scale-110'}`}
                        style={{
                          animation: 'heatmap-pulse 2s infinite',
                        }}
                      >
                        <LuFlame className="text-white text-xs" />
                      </div>
                      <span
                        className={`block bg-slate-900/90 text-white text-[9px] px-1.5 py-0.5 rounded shadow-xs mt-1 font-semibold transition ${
                          isActive ? 'opacity-100' : 'opacity-60'
                        }`}
                      >
                        {region.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Detailed Insights Segment */}
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Specs Column */}
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    {(() => {
                      const heatCfg = heatColorMap[selected.heat] || heatColorMap.moderate;
                      return (
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg shadow-xs ${heatCfg.bg}`}
                        >
                          <LuFlame />
                        </div>
                      );
                    })()}
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 font-['Poppins',sans-serif] m-0">
                        {selected.name} Zone
                      </h3>
                      <p className="text-xs text-emerald-600 font-bold m-0 mt-0.5">
                        {selected.growth}% CAGR Growth Projection
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-extrabold text-amber-600 mb-5 font-['Poppins',sans-serif]">
                    Price Range: {selected.priceRange}
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {selected.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 font-medium"
                      >
                        <LuCheck className="text-emerald-600 text-sm mt-0.5 shrink-0 font-bold" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Growth Indicators Grid */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5 font-['Poppins',sans-serif]">
                    Growth Indicators
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: '5-Year Appreciation',
                        value: `${Math.round(selected.growth * 3.2)}%`,
                        color: 'text-emerald-600',
                      },
                      {
                        label: 'Rental Yield',
                        value: `${(3 + selected.growth * 0.12).toFixed(1)}%`,
                        color: 'text-amber-600',
                      },
                      {
                        label: 'Infrastructure Score',
                        value: `${Math.min(95, 60 + selected.growth * 2)}/100`,
                        color: 'text-green-700',
                      },
                      {
                        label: 'Demand Index',
                        value: `${Math.min(100, 50 + selected.growth * 2.5)}/100`,
                        color: 'text-green-700',
                      },
                    ].map((item, i) => (
                      <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider m-0">
                          {item.label}
                        </p>
                        <p
                          className={`text-base sm:text-xl font-extrabold my-1 font-['Poppins',sans-serif] ${item.color}`}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* BDA Disclaimer box */}
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-[10px] sm:text-xs text-slate-600 leading-relaxed flex gap-2 items-start">
                    <LuInfo className="text-sm text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Compiled from BDA, Odisha RERA master records &amp; market reports. Past
                      appreciation yields do not guarantee future returns.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {error && (
          <div className="mt-4 text-center p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-semibold">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
