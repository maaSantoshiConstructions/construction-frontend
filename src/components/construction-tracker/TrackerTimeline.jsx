import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuHardHat, LuHouse, LuCheck, LuBuilding,
  LuCalendar, LuChevronUp, LuChevronDown
} from 'react-icons/lu';

export default function TrackerTimeline({
  filteredUpdates,
  groupedByProject,
  stages,
  stageMap,
  expandedUpdate,
  setExpandedUpdate,
}) {
  if (filteredUpdates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 sm:p-20 text-center shadow-xs">
        <LuHardHat className="text-5xl text-slate-300 mx-auto mb-4" />
        <p className="text-base font-semibold text-slate-600 mb-1">No construction updates found</p>
        <p className="text-xs text-slate-400">Check back later for progress reports.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {groupedByProject.map(([projectName, projectUpdates]) => {
        const sortedUpdates = [...projectUpdates].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const latestProgress = sortedUpdates[0]?.progressPercent || 0;
        const stageOrder = {};
        stages.forEach((s, i) => { stageOrder[s.key] = i; });
        const stageGroups = {};
        sortedUpdates.forEach((u) => {
          const sk = u.stage || 'planning';
          if (!stageGroups[sk]) stageGroups[sk] = [];
          stageGroups[sk].push(u);
        });
        const sortedStages = Object.keys(stageGroups).sort((a, b) => (stageOrder[a] || 0) - (stageOrder[b] || 0));

        return (
          <div key={projectName} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">

            {/* Project Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LuHouse className="text-lg text-indigo-300 shrink-0" />
                <span className="font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-white">{projectName}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-300 hidden sm:inline">{sortedUpdates.length} updates</span>
                <div className="px-3 py-1 rounded-lg bg-white/15 font-bold text-xs sm:text-sm text-white">
                  {latestProgress}%
                </div>
              </div>
            </div>

            {/* Stage Pipeline */}
            <div className="px-4 sm:px-7 py-4 border-b border-slate-100 flex gap-1 overflow-x-auto">
              {stages.map((s, i) => {
                const hasUpdate = stageGroups[s.key]?.length > 0;
                return (
                  <div key={s.key} className="flex items-center gap-1 flex-1 min-w-[80px]">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] shrink-0 font-bold ${
                        hasUpdate ? '' : 'bg-slate-200 text-slate-600'
                      }`}
                      style={hasUpdate ? { backgroundColor: s.color } : undefined}
                    >
                      {hasUpdate ? <LuCheck size={12} /> : i + 1}
                    </div>
                    {i < stages.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 min-w-[20px] ${hasUpdate ? '' : 'bg-slate-200'}`}
                        style={hasUpdate ? { backgroundColor: s.color } : undefined}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Updates Timeline */}
            <div className="p-5 sm:p-7">
              {sortedStages.map((stageKey) => {
                const stageInfo = stageMap[stageKey] || stages[0];
                const stageUpdates = stageGroups[stageKey];
                return (
                  <div key={stageKey} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0"
                        style={{ backgroundColor: `${stageInfo.color}18`, color: stageInfo.color }}
                      >
                        {stageInfo.icon}
                      </div>
                      <div>
                        <span className="font-['Poppins',sans-serif] text-sm font-bold text-slate-900">{stageInfo.label}</span>
                        <span className="text-xs text-slate-400 ml-2">{stageUpdates.length} update{stageUpdates.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div
                      className="ml-4 pl-5 border-l-2"
                      style={{ borderColor: `${stageInfo.color}30` }}
                    >
                      {stageUpdates.map((update, ui) => {
                        const isExpanded = expandedUpdate === update._id;
                        return (
                          <motion.div
                            key={update._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: ui * 0.04 }}
                            className={ui < stageUpdates.length - 1 ? 'mb-3' : 'mb-0'}
                          >
                            {/* Timeline dot */}
                            <div className="flex gap-3 items-start">
                              <div
                                className="w-3 h-3 rounded-full border-2 border-white shrink-0 mt-3.5"
                                style={{
                                  backgroundColor: stageInfo.color,
                                  boxShadow: `0 0 0 2px ${stageInfo.color}30`,
                                }}
                              />
                              <div
                                className={`flex-1 p-3.5 sm:p-4 rounded-xl bg-slate-50/80 border cursor-pointer transition-all hover:bg-slate-50 ${
                                  isExpanded ? 'border-indigo-300 shadow-xs' : 'border-slate-200'
                                }`}
                                onClick={() => setExpandedUpdate(isExpanded ? null : update._id)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs sm:text-sm font-bold text-slate-900">{update.title}</span>
                                      {update.progressPercent > 0 && (
                                        <span
                                          className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                                          style={{
                                            backgroundColor: `${stageInfo.color}15`,
                                            color: stageInfo.color,
                                          }}
                                        >
                                          {update.progressPercent}%
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3.5 mt-1 flex-wrap">
                                      {update.plot?.plotNumber && (
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                          <LuBuilding size={12} className="text-slate-400" /> Plot {update.plot.plotNumber}
                                        </span>
                                      )}
                                      <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <LuCalendar size={12} />
                                        {new Date(update.createdAt || update.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </span>
                                      {update.engineerReport && (
                                        <span className="text-xs text-indigo-600 font-semibold">Has Report</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-slate-400 text-xs p-1 shrink-0">
                                    {isExpanded ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="border-t border-slate-200 mt-3 pt-3">
                                        {update.description && (
                                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">{update.description}</p>
                                        )}

                                        {update.engineerReport && (
                                          <div className="p-3 sm:p-3.5 bg-blue-50/70 rounded-xl border border-blue-200">
                                            <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1">Engineer Report</div>
                                            <p className="text-xs sm:text-sm text-blue-950 leading-relaxed m-0">{update.engineerReport}</p>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
