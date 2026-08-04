import React from 'react';
import { LuHouse, LuMilestone, LuCompass, LuRuler, LuMapPin, LuTrees } from 'react-icons/lu';

const statusConfig = {
  available: {
    dotBg: 'bg-emerald-500',
    activeBg: 'bg-emerald-50/80',
    activeBorder: 'border-emerald-500 shadow-md shadow-emerald-500/10',
    defaultBorder: 'border-emerald-200',
    activeText: 'text-emerald-700',
  },
  reserved: {
    dotBg: 'bg-amber-500',
    activeBg: 'bg-amber-50/80',
    activeBorder: 'border-amber-500 shadow-md shadow-amber-500/10',
    defaultBorder: 'border-amber-200',
    activeText: 'text-amber-700',
  },
  sold: {
    dotBg: 'bg-rose-500',
    activeBg: 'bg-rose-50/80',
    activeBorder: 'border-rose-500 shadow-md shadow-rose-500/10',
    defaultBorder: 'border-rose-200',
    activeText: 'text-rose-700',
  },
  blocked: {
    dotBg: 'bg-slate-400',
    activeBg: 'bg-slate-100/80',
    activeBorder: 'border-slate-400 shadow-md shadow-slate-400/10',
    defaultBorder: 'border-slate-200',
    activeText: 'text-slate-700',
  },
};

const projectColors = [
  { border: 'border-indigo-200', bg: 'bg-indigo-50/30', headerBg: 'bg-indigo-700' },
  { border: 'border-emerald-200', bg: 'bg-emerald-50/30', headerBg: 'bg-emerald-700' },
  { border: 'border-amber-200', bg: 'bg-amber-50/30', headerBg: 'bg-amber-700' },
  { border: 'border-pink-200', bg: 'bg-pink-50/30', headerBg: 'bg-pink-700' },
  { border: 'border-sky-200', bg: 'bg-sky-50/30', headerBg: 'bg-sky-700' },
];

const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');
const formatSize = (val) => (val || 0).toLocaleString('en-IN');

export default function LayoutView({
  isMobile,
  filteredPlots,
  groupedByProject,
  selectedPlot,
  setSelectedPlot,
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto ${
        isMobile ? 'p-2 sm:p-3' : 'p-6'
      }`}
    >
      {filteredPlots.length === 0 ? (
        <div className="text-center py-16 px-4 text-slate-400">
          <LuMapPin className="text-4xl mb-3 text-slate-300 mx-auto block" />
          <p className="text-sm font-bold text-slate-700">No plots to display</p>
          <p className="text-xs text-slate-400 mt-1">Adjust your filters or search query.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 sm:gap-8">
          {groupedByProject.map(([projectName, projectPlots], pi) => {
            const colorSet = projectColors[pi % projectColors.length];
            const cols = isMobile ? 2 : 5;
            const rows = Math.ceil(projectPlots.length / cols);
            return (
              <div
                key={projectName}
                className={`border-2 rounded-2xl overflow-hidden ${colorSet.border} ${colorSet.bg}`}
              >
                {/* Project Layout Header */}
                <div
                  className={`${colorSet.headerBg} text-white px-3.5 sm:px-5 py-3 flex flex-wrap justify-between items-center gap-2`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <LuHouse className="text-base shrink-0 opacity-90" />
                    <span className="text-xs sm:text-sm font-bold font-['Poppins',sans-serif] truncate">
                      {projectName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] sm:text-xs font-semibold bg-white/15 px-2.5 py-0.5 sm:py-1 rounded-lg">
                      {projectPlots.length} Plots
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold bg-white/15 px-2.5 py-0.5 sm:py-1 rounded-lg">
                      {rows} Rows
                    </span>
                  </div>
                </div>

                {/* Main Access Road */}
                <div className="bg-slate-200 px-3.5 sm:px-5 py-1.5 flex items-center gap-2">
                  <LuMilestone className="text-slate-600 text-xs shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Main Access Road — 30 ft
                  </span>
                </div>

                {/* Grid Rows */}
                <div className="p-3 sm:p-5">
                  {Array.from({ length: rows }, (_, rowIdx) => {
                    const rowPlots = projectPlots.slice(rowIdx * cols, (rowIdx + 1) * cols);
                    return (
                      <div key={rowIdx}>
                        {rowIdx > 0 && (
                          <div className="flex items-center gap-2 my-2 py-0.5">
                            <div className="flex-1 border-t border-dashed border-slate-300" />
                            <LuMilestone className="text-slate-400 text-[10px] shrink-0" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              Internal Road — 20 ft
                            </span>
                            <div className="flex-1 border-t border-dashed border-slate-300" />
                          </div>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                          {rowPlots.map((plot) => {
                            const st = statusConfig[plot.status] || statusConfig.available;
                            const sel = selectedPlot?._id === plot._id;
                            return (
                              <div
                                key={plot._id}
                                onClick={() => setSelectedPlot(plot)}
                                className={`border-2 rounded-xl p-2.5 sm:p-3 text-center cursor-pointer transition-all ${
                                  sel
                                    ? `${st.activeBorder} ${st.activeBg}`
                                    : `${st.defaultBorder} bg-white hover:-translate-y-0.5 hover:shadow-md`
                                }`}
                              >
                                {/* Top Badge & Status Indicator */}
                                <div className="flex items-center justify-between mb-1 gap-1 min-h-[16px]">
                                  {plot.corner ? (
                                    <span className="text-[8px] sm:text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200 uppercase tracking-tight">
                                      CORNER
                                    </span>
                                  ) : (
                                    <span />
                                  )}
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${st.dotBg}`} />
                                </div>

                                <div
                                  className={`text-sm sm:text-base font-extrabold font-['Poppins',sans-serif] leading-tight truncate ${
                                    sel ? st.activeText : 'text-slate-900'
                                  }`}
                                >
                                  {plot.plotNumber}
                                </div>

                                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                  {formatSize(plot.size)} sqft
                                </div>

                                <div className="flex items-center justify-center gap-1 mt-0.5 text-[10px] text-slate-400 truncate">
                                  <LuCompass className="text-[10px] shrink-0" />
                                  <span>{plot.facing}</span>
                                </div>

                                <div className="text-xs sm:text-sm font-extrabold text-amber-600 mt-1 truncate">
                                  {formatCurrency(plot.price)}
                                </div>

                                {plot.roadWidth && (
                                  <div className="text-[9px] text-slate-400 mt-0.5 flex items-center justify-center gap-0.5 truncate">
                                    <LuRuler className="text-[9px] shrink-0" />
                                    <span>{plot.roadWidth} ft road</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Central Park Legend */}
                <div className="mx-3 sm:mx-5 mb-3 sm:mb-4 p-2 sm:p-2.5 bg-emerald-50 border-1.5 border-dashed border-emerald-300 rounded-xl flex items-center justify-center gap-2">
                  <LuTrees className="text-emerald-600 text-sm sm:text-base shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-emerald-800">
                    Central Park & Green Area
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
