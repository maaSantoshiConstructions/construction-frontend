import React from 'react';

export default function TrackerStats({
  projectStats,
  currentProjectObj,
  stages,
}) {
  if (!projectStats) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 mb-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 m-0 font-['Poppins',sans-serif]">
            {currentProjectObj?.name || 'Overall Progress'}
          </h3>
          {currentProjectObj?.location?.city && (
            <p className="text-xs text-slate-500 mt-0.5">
              {currentProjectObj.location.city}, {currentProjectObj.location.state}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-['Poppins',sans-serif]">
            {projectStats.avgProgress}%
          </div>
          <div className="text-[11px] text-slate-400 font-semibold">
            {projectStats.total} Updates
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${projectStats.avgProgress}%` }}
        />
      </div>

      {/* Stage Indicators */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {stages.map((s) => {
          const count = projectStats.stageCounts[s.key] || 0;
          const active = count > 0;
          return (
            <div
              key={s.key}
              className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                active ? '' : 'bg-slate-50 border-slate-200'
              }`}
              style={
                active
                  ? {
                      backgroundColor: `${s.color}12`,
                      borderColor: `${s.color}35`,
                    }
                  : undefined
              }
            >
              <div
                className="text-base mb-1 flex justify-center"
                style={{ color: active ? s.color : '#94a3b8' }}
              >
                {s.icon}
              </div>
              <div
                className="text-[10.5px] font-bold uppercase tracking-wider"
                style={{ color: active ? s.color : '#94a3b8' }}
              >
                {s.label}
              </div>
              <div
                className={`text-xs sm:text-sm font-extrabold mt-0.5 ${
                  active ? 'text-slate-900' : 'text-slate-300'
                }`}
              >
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
