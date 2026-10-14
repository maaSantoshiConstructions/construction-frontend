import React from 'react';
import { LuHardHat } from 'react-icons/lu';

export default function TrackerHeader({
  selectedProject,
  setSelectedProject,
  projects,
  setSearchParams,
}) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <LuHardHat className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-extrabold text-slate-900 m-0">
                Construction Tracker
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Real-time progress across all projects
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="text-xs font-semibold text-slate-500">Filter:</label>
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                if (e.target.value) setSearchParams({ project: e.target.value });
                else setSearchParams({});
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white cursor-pointer outline-none focus:border-green-600 min-w-[180px] shadow-xs"
            >
              <option value="">All Projects</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
