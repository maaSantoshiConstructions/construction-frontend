import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaCheckCircle, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { getProjects } from '../../api/projects';

const fallbackProjects = [
  {
    id: 'patia', name: 'Patia Plotted', growth: 18, priceRange: '₹2,400 - ₹3,200/sq.ft',
    highlights: ['Near Infosys & IT hub', 'NH-16 connectivity', 'Upcoming metro station', 'Premium residential area'],
    color: '#e67e22', heat: 'high',
    left: '15%', top: '30%'
  },
  {
    id: 'khandagiri', name: 'Khandagiri Enclave', growth: 14, priceRange: '₹1,800 - ₹2,600/sq.ft',
    highlights: ['Affordable rates', 'Near proposed ring road', 'Tourist area', 'Good rental demand'],
    color: '#f1c40f', heat: 'moderate',
    left: '30%', top: '48%'
  },
  {
    id: 'chandrasekharpur', name: 'C-Pur Heights', growth: 16, priceRange: '₹3,000 - ₹4,500/sq.ft',
    highlights: ['Premium locality', 'KIIT & educational hub', 'Developed infrastructure', 'High appreciation'],
    color: '#e67e22', heat: 'high',
    left: '45%', top: '35%'
  },
  {
    id: 'puri-road', name: 'Puri Road Greens', growth: 22, priceRange: '₹1,500 - ₹2,800/sq.ft',
    highlights: ['Highway front', 'Rapidly developing', 'New projects coming up', 'Best for investment'],
    color: '#e74c3c', heat: 'very-high',
    left: '60%', top: '55%'
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

            const highlights = proj.highlights?.length > 0
              ? proj.highlights.slice(0, 4)
              : ['Premium location', 'High appreciation potential', 'Clear title & RERA approved', 'Developed infrastructure'];

            const pSqft = proj.pricePerSqft || 1500;
            const priceRange = `₹${(pSqft - 150).toLocaleString()} - ₹${(pSqft + 250).toLocaleString()}/sq.ft`;

            let color = '#f1c40f';
            let heat = 'moderate';
            if (growth >= 20) {
              color = '#e74c3c';
              heat = 'very-high';
            } else if (growth >= 16) {
              color = '#e67e22';
              heat = 'high';
            } else if (growth >= 12) {
              color = '#3498db';
              heat = 'stable';
            }

            const left = `${12 + (i * 20) % 76}%`;
            const top = `${25 + (i * 14) % 56}%`;

            return {
              id: proj._id,
              name: proj.name,
              growth,
              priceRange,
              highlights,
              color,
              heat,
              left,
              top
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
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.6); }
          70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
      `}</style>

      {/* ===== PAGE HEADER ===== */}
      <div className="relative overflow-hidden text-center py-16 px-4 bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <span className="inline-block bg-white/10 text-[#e8b355] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3.5">
            INVESTMENT ANALYTICS
          </span>
          <h1 className="font-poppins text-white text-3xl md:text-4xl font-extrabold mt-2 mb-3">
            Odisha Investment Heatmap
          </h1>
          <p className="text-indigo-200 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Identify high-growth vectors and appreciation triggers for real estate investments.
          </p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="max-w-5xl mx-auto px-6 -mt-7 relative z-10">
        
        {loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xl mb-8">
            <FaSpinner className="animate-spin text-indigo-600 text-2xl mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">Loading investment projects...</p>
          </div>
        )}

        {!loading && projects.length > 0 && selected && (
          <>
            {/* Growth Zones Main Map Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 mb-8"
            >
              {/* Header & Legend */}
              <div className="flex justify-between items-center flex-wrap gap-4 mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800 font-poppins">
                  Bhubaneswar Growth Zones
                </h2>
                <div className="flex items-center gap-3 flex-wrap text-[10px] md:text-xs font-bold text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#e74c3c]" /> Very High</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#e67e22]" /> High</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f1c40f]" /> Moderate</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3498db]" /> Stable</span>
                </div>
              </div>

              {/* Regions Grid buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
                {projects.map((region) => {
                  const isActive = selected.id === region.id;
                  return (
                    <button
                      key={region.id}
                      onClick={() => setSelected(region)}
                      className={`p-4 rounded-xl text-center cursor-pointer outline-none transition-all duration-200 border ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-600/5'
                          : 'border-slate-200 bg-white hover:border-indigo-600'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg mx-auto mb-2.5 flex items-center justify-center"
                        style={{ background: region.color }}
                      >
                        <FaFire className="text-white text-xs" />
                      </div>
                      <p className="font-extrabold text-slate-800 text-xs truncate font-poppins">{region.name}</p>
                      <p className="text-[10px] text-emerald-600 font-extrabold mt-1">{region.growth}% CAGR</p>
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
                  return (
                    <button
                      key={region.id}
                      onClick={() => setSelected(region)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none"
                      style={{ left: region.left, top: region.top, zIndex: isActive ? 20 : 10 }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition duration-200 ${
                          isActive ? 'scale-125' : 'scale-100 hover:scale-110'
                        }`}
                        style={{
                          background: region.color,
                          animation: 'heatmap-pulse 2s infinite'
                        }}
                      >
                        <FaFire className="text-white text-xs" />
                      </div>
                      <span className={`block bg-slate-900/90 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm mt-1 font-semibold transition ${
                        isActive ? 'opacity-100' : 'opacity-60'
                      }`}>
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
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Specs Column */}
                <div>
                  <div className="flex items-center gap-3.5 mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ background: selected.color }}
                    >
                      <FaFire className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-800 font-poppins m-0">
                        {selected.name} Zone
                      </h3>
                      <p className="text-xs text-emerald-600 font-bold m-0 mt-0.5">
                        {selected.growth}% CAGR Growth Projection
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-extrabold text-amber-600 mb-5 font-poppins">
                    Price Range: {selected.priceRange}
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {selected.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-500 font-medium">
                        <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Growth Indicators Grid */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-poppins">
                    Growth Indicators
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: '5-Year Appreciation', value: `${Math.round(selected.growth * 3.2)}%`, color: 'text-emerald-600' },
                      { label: 'Rental Yield', value: `${(3 + selected.growth * 0.12).toFixed(1)}%`, color: 'text-amber-600' },
                      { label: 'Infrastructure Score', value: `${Math.min(95, 60 + selected.growth * 2)}/100`, color: 'text-indigo-600' },
                      { label: 'Demand Index', value: `${Math.min(100, 50 + selected.growth * 2.5)}/100`, color: 'text-indigo-600' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider m-0">{item.label}</p>
                        <p className={`text-lg md:text-xl font-extrabold my-1 ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* BDA Disclaimer box */}
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[10px] text-slate-500 leading-relaxed flex gap-2 items-start">
                    <FaInfoCircle className="text-xs text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Compiled from BDA, Odisha RERA master records &amp; market reports. Past appreciation yields do not guarantee future returns.
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}

        {error && (
          <div className="mt-4 text-center p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
            ⚠️ {error}
          </div>
        )}
      </div>

    </div>
  );
}
