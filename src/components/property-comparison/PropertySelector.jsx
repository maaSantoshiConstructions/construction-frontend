import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes } from 'react-icons/fa';

export default function PropertySelector({
  selected = [],
  removeProperty,
  searchQuery,
  setSearchQuery,
  projectFilter,
  setProjectFilter,
  uniqueProjects = [],
  filtered = [],
  addProperty
}) {
  return (
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
  );
}
