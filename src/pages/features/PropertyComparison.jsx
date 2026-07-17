import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes, FaArrowRight, FaCheck } from 'react-icons/fa';
import { getPlots } from '../../api/plots';

const attributes = [
  { key: 'project', label: 'Project' },
  { key: 'location', label: 'Location' },
  { key: 'size', label: 'Size (sq.ft)', format: (v) => `${v} sq.ft` },
  { key: 'price', label: 'Price', format: (v) => `₹${(v / 100000).toFixed(1)} Lakh` },
  { key: 'facing', label: 'Facing' },
  { key: 'road', label: 'Road Width', format: (v) => `${v} ft` },
  { key: 'status', label: 'Status', format: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
];

export default function PropertyComparison() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const uniqueProjects = Array.from(new Set(properties.map((p) => p.project))).filter(Boolean);

  const filtered = properties.filter((p) => {
    const matchesProject = !projectFilter || p.project === projectFilter;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.facing.toLowerCase().includes(searchQuery.toLowerCase());
    const isNotSelected = !selected.find((s) => s.id === p.id);
    return matchesProject && matchesSearch && isNotSelected;
  });

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        setLoading(true);
        const response = await getPlots({ limit: 100 });
        const plotsList = response.data?.data || [];
        
        const mappedProperties = plotsList.map((plot) => ({
          id: plot._id,
          name: `Plot ${plot.plotNumber}`,
          project: plot.project?.name || 'N/A',
          location: [
            plot.project?.location?.city,
            plot.project?.location?.state
          ].filter(Boolean).join(', ') || plot.project?.location?.address || 'Bhubaneswar',
          size: plot.size || 0,
          price: plot.price || 0,
          facing: plot.facing || 'N/A',
          road: plot.roadWidth || 0,
          status: plot.status || 'available'
        }));
        
        setProperties(mappedProperties);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties for comparison. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlots();
  }, []);

  const addProperty = (prop) => {
    if (selected.length < 4 && !selected.find((s) => s.id === prop.id)) {
      setSelected([...selected, prop]);
    }
  };

  const removeProperty = (id) => {
    setSelected(selected.filter((s) => s.id !== id));
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* ===== PAGE HEADER ===== */}
      <div className="relative overflow-hidden text-center py-16 px-4 bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <span className="inline-block bg-white/10 text-[#e8b355] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3.5">
            COMPARE TOOLS
          </span>
          <h1 className="font-poppins text-white text-3xl md:text-4xl font-extrabold mt-2 mb-3">
            Property Comparison
          </h1>
          <p className="text-indigo-200 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Select and compare up to 4 plots side-by-side to make the right choice.
          </p>
        </div>
      </div>

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <div className="max-w-6xl mx-auto px-6 -mt-7 relative z-10">
        
        {loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xl">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-400">Fetching live property listings...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-200 shadow-xl px-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <FaTimes className="text-lg" />
            </div>
            <h3 className="text-base font-bold text-red-600 mb-1 font-poppins">Error Loading Properties</h3>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xl px-4">
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <FaPlus className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 font-poppins">
              No Properties Available
            </h3>
            <p className="text-sm text-slate-400">
              There are currently no active properties or plots available for comparison.
            </p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <>
            {/* Selection Controller Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 mb-8"
            >
              <h2 className="text-base font-bold text-slate-800 mb-5 font-poppins">
                Select Properties to Compare ({selected.length}/4)
              </h2>

              {selected.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {selected.map((prop) => (
                    <div
                      key={prop.id}
                      className="relative border border-indigo-600 bg-indigo-50/50 rounded-xl px-4 py-3.5 flex flex-col justify-center"
                    >
                      <button
                        onClick={() => removeProperty(prop.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer shadow-sm hover:bg-red-600 transition"
                      >
                        <FaTimes />
                      </button>
                      <p className="font-bold text-slate-800 text-xs truncate">{prop.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{prop.project}</p>
                    </div>
                  ))}
                </div>
              )}

              {selected.length < 4 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 font-poppins">
                    Add properties to compare list:
                  </p>

                  {/* Filters Row */}
                  <div className="flex flex-wrap gap-3 mb-5">
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Search by plot number or facing..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-800 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <select
                        value={projectFilter}
                        onChange={(e) => setProjectFilter(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-700 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
                      >
                        <option value="">All Projects</option>
                        {uniqueProjects.map((proj) => (
                          <option key={proj} value={proj}>{proj}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Scrollable list of pills */}
                  <div className="max-h-[220px] overflow-y-auto border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    {filtered.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {filtered.map((prop) => (
                          <button
                            key={prop.id}
                            onClick={() => addProperty(prop)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-600 hover:text-indigo-600 hover:shadow-sm"
                          >
                            <FaPlus className="text-[8px] text-indigo-600" /> {prop.name} — {prop.project}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        No matching properties found. Try adjusting your search query or project filter.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Side-by-side Table Comparison Board */}
            {selected.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-40 font-poppins">
                          Specification
                        </th>
                        {selected.map((prop) => (
                          <th key={prop.id} className="text-center px-6 py-4 text-xs font-bold text-slate-800 min-w-[180px] font-poppins">
                            {prop.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {attributes.map((attr, idx) => (
                        <tr key={attr.key} className={`border-b border-slate-100 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                          <td className="px-6 py-4 font-semibold text-slate-500">{attr.label}</td>
                          {selected.map((prop) => {
                            const values = selected.map((s) => s[attr.key]);
                            const best = attr.key === 'price' ? Math.min(...values) : attr.key === 'size' ? Math.max(...values) : null;
                            const isBest = best !== null && prop[attr.key] === best;
                            return (
                              <td
                                key={prop.id}
                                className={`text-center px-6 py-4 transition ${isBest ? 'bg-emerald-50/60' : ''}`}
                              >
                                <span className={`block ${isBest ? 'font-bold text-emerald-600' : 'text-slate-800'}`}>
                                  {attr.format ? attr.format(prop[attr.key]) : prop[attr.key]}
                                </span>
                                {isBest && attr.key === 'price' && (
                                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                                    <FaCheck className="text-[7px]" /> Best Value
                                  </span>
                                )}
                                {isBest && attr.key === 'size' && (
                                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                                    <FaCheck className="text-[7px]" /> Largest Size
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center text-xs font-medium text-slate-400">
                  💡 Tip: Look for the green highlighted options representing optimal budget and layout sizing specifications.
                </div>
              </motion.div>
            )}

            {/* Dynamic Fallback views if less than 2 properties selected */}
            {selected.length < 2 && selected.length > 0 && (
              <div className="text-center py-16 px-8 bg-white rounded-2xl border border-slate-200 shadow-md">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <FaArrowRight className="text-lg animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1.5 font-poppins">Select Another Property</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">Add at least one more plot or villa above to view comparison specifications.</p>
              </div>
            )}

            {selected.length === 0 && (
              <div className="text-center py-20 px-8 bg-white rounded-2xl border border-slate-200 shadow-md">
                <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <FaPlus className="text-xl" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1.5 font-poppins">
                  No Properties Selected
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Add up to 4 plots or villas from the listing above to run a side-by-side spec comparison.
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
