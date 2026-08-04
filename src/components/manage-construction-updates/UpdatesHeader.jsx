import React from 'react';

export default function UpdatesHeader({ openCreate }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
          Construction Updates
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Track and publish construction progress for all projects
        </p>
      </div>
      <button
        onClick={openCreate}
        className="cta-btn text-xs font-bold px-5 py-2.5 rounded-xl border-0 cursor-pointer shadow-md transition-all shrink-0"
      >
        + Add Update
      </button>
    </div>
  );
}
