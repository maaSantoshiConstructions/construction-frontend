import React from 'react';
import { LuBuilding, LuCalendar } from 'react-icons/lu';

function SummaryItem({ label, value, colorClass }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-lg font-extrabold font-['Poppins',sans-serif] ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}

export default function ProjectSummaryBar({
  currentProject,
  projectStats,
  isMobile,
  formatCurrency,
}) {
  if (!currentProject) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-4">
      <div className="flex items-center gap-3 mb-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-sm shrink-0">
          <LuBuilding />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate font-['Poppins',sans-serif]">
            {currentProject.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
            <span>
              {currentProject.location?.city}
              {currentProject.location?.state ? `, ${currentProject.location.state}` : ''}
            </span>
            {currentProject.status && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px] capitalize border border-emerald-100">
                {currentProject.status}
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <SummaryItem label="Total" value={projectStats?.total || 0} colorClass="text-slate-900" />
        <SummaryItem label="Available" value={projectStats?.available || 0} colorClass="text-emerald-700" />
        <SummaryItem label="Reserved" value={projectStats?.reserved || 0} colorClass="text-amber-700" />
        <SummaryItem label="Sold" value={projectStats?.sold || 0} colorClass="text-rose-700" />
        {!isMobile && (
          <SummaryItem
            label="Price/Sqft"
            value={currentProject.pricePerSqft ? formatCurrency(currentProject.pricePerSqft) : 'N/A'}
            colorClass="text-indigo-600"
          />
        )}
        {currentProject.possessionDate && !isMobile && (
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Possession
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1">
              <LuCalendar className="text-xs text-slate-400" />
              {new Date(currentProject.possessionDate).toLocaleDateString('en-IN', {
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
