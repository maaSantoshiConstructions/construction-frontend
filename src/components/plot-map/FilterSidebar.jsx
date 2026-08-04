import React from 'react';
import { LuX, LuSearch, LuMapPin, LuCompass } from 'react-icons/lu';

const statusConfig = {
  available: {
    dotBg: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    activeBtn: 'border-emerald-500 bg-emerald-50/70 text-emerald-800',
    cardActive: 'border-emerald-500 bg-emerald-50/40 shadow-xs',
    label: 'Available',
  },
  reserved: {
    dotBg: 'bg-amber-500',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    activeBtn: 'border-amber-500 bg-amber-50/70 text-amber-800',
    cardActive: 'border-amber-500 bg-amber-50/40 shadow-xs',
    label: 'Reserved',
  },
  sold: {
    dotBg: 'bg-rose-500',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    activeBtn: 'border-rose-500 bg-rose-50/70 text-rose-800',
    cardActive: 'border-rose-500 bg-rose-50/40 shadow-xs',
    label: 'Sold',
  },
  blocked: {
    dotBg: 'bg-slate-400',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    activeBtn: 'border-slate-400 bg-slate-100/70 text-slate-800',
    cardActive: 'border-slate-400 bg-slate-100/40 shadow-xs',
    label: 'Blocked',
  },
};

const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');
const formatSize = (val) => (val || 0).toLocaleString('en-IN');

export default function FilterSidebar({
  isMobile,
  showFilters,
  setShowFilters,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  plots,
  filteredPlots,
  selectedPlot,
  setSelectedPlot,
  getProjectName,
}) {
  const uniqueProjectNames = React.useMemo(() => {
    return [...new Set(plots.map((p) => getProjectName(p)))];
  }, [plots, getProjectName]);

  const selectStyle =
    'w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-colors';

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-300 flex flex-col ${
        isMobile
          ? `fixed top-0 left-0 z-[200] h-screen ${
              showFilters ? 'w-full min-w-full' : 'w-0 min-w-0 pointer-events-none hidden'
            }`
          : 'sticky top-6 z-10 w-[340px] min-w-[340px] h-[calc(100vh-140px)]'
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
        <h3 className="text-base font-bold text-slate-900 font-['Poppins',sans-serif]">
          Filters & Plots
        </h3>
        {isMobile && (
          <button
            type="button"
            onClick={() => setShowFilters(false)}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center border-0 cursor-pointer transition-colors"
            aria-label="Close Filter Sidebar"
          >
            <LuX className="text-sm" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">
        {/* Search */}
        <div className="relative">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
          <input
            type="text"
            placeholder="Search plot number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 focus:bg-white transition-all"
          />
        </div>

        {/* Filters Card */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Project
            </label>
            <select
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
              className={selectStyle}
            >
              <option value="">All Projects</option>
              {uniqueProjectNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Facing
              </label>
              <select
                value={filters.facing}
                onChange={(e) => setFilters({ ...filters, facing: e.target.value })}
                className={selectStyle}
              >
                <option value="">All</option>
                {[
                  'North',
                  'South',
                  'East',
                  'West',
                  'North-East',
                  'North-West',
                  'South-East',
                  'South-West',
                ].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Size
              </label>
              <select
                value={filters.sizeRange}
                onChange={(e) => setFilters({ ...filters, sizeRange: e.target.value })}
                className={selectStyle}
              >
                <option value="">Any</option>
                <option value="0-1000">Up to 1,000 sqft</option>
                <option value="1000-1500">1,000 - 1,500</option>
                <option value="1500-2000">1,500 - 2,000</option>
                <option value="2000-99999">2,000+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Status
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(statusConfig).map(([key, cfg]) => {
                const sel = filters.status === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilters({ ...filters, status: sel ? '' : key })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 outline-none ${
                      sel
                        ? cfg.activeBtn
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotBg}`} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setFilters({ project: '', facing: '', status: '', sizeRange: '' });
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-transparent border-0 cursor-pointer text-left p-0 transition-colors mt-1"
          >
            Clear all filters
          </button>
        </div>

        {/* Directory List */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-900">Plot Directory</span>
            <span className="text-[11px] font-semibold text-slate-400">
              {filteredPlots.length} plots
            </span>
          </div>

          {filteredPlots.map((plot) => {
            const sel = selectedPlot?._id === plot._id;
            const cfg = statusConfig[plot.status] || statusConfig.available;
            return (
              <div
                key={plot._id}
                onClick={() => setSelectedPlot(plot)}
                className={`p-3 rounded-xl border-1.5 cursor-pointer transition-all ${
                  sel ? cfg.cardActive : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-2xs'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">
                    Plot {plot.plotNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cfg.badgeClass}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <span className="text-xs text-slate-500 font-medium">
                    {getProjectName(plot)}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {formatSize(plot.size)} sqft
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-2">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <LuCompass className="text-xs text-slate-400" />
                    {plot.facing}
                  </span>
                  <span className="text-xs font-extrabold text-amber-600">
                    {formatCurrency(plot.price)}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredPlots.length === 0 && (
            <div className="text-center py-8 px-3 text-slate-400 text-xs">
              <LuMapPin className="text-3xl mb-2 text-slate-300 mx-auto block" />
              No plots match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
