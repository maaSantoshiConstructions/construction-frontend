import React from 'react';

const statusConfig = {
  available: { badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', activeRow: 'bg-emerald-50/60', label: 'Available' },
  reserved: { badgeClass: 'bg-amber-50 text-amber-700 border-amber-200', activeRow: 'bg-amber-50/60', label: 'Reserved' },
  sold: { badgeClass: 'bg-rose-50 text-rose-700 border-rose-200', activeRow: 'bg-rose-50/60', label: 'Sold' },
  blocked: { badgeClass: 'bg-slate-100 text-slate-600 border-slate-200', activeRow: 'bg-slate-100/60', label: 'Blocked' },
};

const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');
const formatSize = (val) => (val || 0).toLocaleString('en-IN');

export default function TableView({
  filteredPlots,
  selectedPlot,
  setSelectedPlot,
  getProjectName,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Plot #', 'Project', 'Size (sqft)', 'Facing', 'Road', 'Price', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPlots.map((plot) => {
              const cfg = statusConfig[plot.status] || statusConfig.available;
              const sel = selectedPlot?._id === plot._id;
              return (
                <tr
                  key={plot._id}
                  onClick={() => setSelectedPlot(plot)}
                  className={`cursor-pointer transition-colors ${
                    sel ? cfg.activeRow : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="px-4 py-3.5 text-xs font-bold text-slate-900">{plot.plotNumber}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-medium">{getProjectName(plot)}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-800 font-bold">{formatSize(plot.size)}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-medium">{plot.facing}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-medium">
                    {plot.roadWidth ? `${plot.roadWidth} ft` : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-xs font-extrabold text-amber-600">
                    {formatCurrency(plot.price)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md border ${cfg.badgeClass}`}
                    >
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredPlots.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 px-4 text-slate-400 text-xs font-medium">
                  No plots match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
