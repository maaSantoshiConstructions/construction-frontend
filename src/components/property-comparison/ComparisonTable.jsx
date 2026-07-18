import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const attributes = [
  { key: 'project', label: 'Project' },
  { key: 'location', label: 'Location' },
  { key: 'size', label: 'Size (sq.ft)', format: (v) => `${v} sq.ft` },
  { key: 'price', label: 'Price', format: (v) => `₹${(v / 100000).toFixed(1)} Lakh` },
  { key: 'facing', label: 'Facing' },
  { key: 'road', label: 'Road Width', format: (v) => `${v} ft` },
  { key: 'status', label: 'Status', format: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
];

export default function ComparisonTable({ selected = [] }) {
  if (selected.length < 2) return null;

  return (
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
  );
}
