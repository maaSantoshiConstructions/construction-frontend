import React from 'react';

export default function ProjectsHeader({ openCreate }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
          Manage Projects
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Create and manage real estate projects
        </p>
      </div>
      <button
        onClick={openCreate}
        className="cta-btn text-xs font-bold px-5 py-2.5 rounded-xl border-0 cursor-pointer shadow-md transition-all shrink-0"
      >
        + Add Project
      </button>
    </div>
  );
}
