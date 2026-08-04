import React from 'react';
import { LuPlus } from 'react-icons/lu';

export default function PlotsHeader({ openCreate }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
          Manage Plots
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Real-time plot inventory, pricing, and specs
        </p>
      </div>
      <button
        onClick={openCreate}
        className="cta-btn flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl border-0 cursor-pointer shadow-md hover:-translate-y-0.5 transition-all shrink-0"
      >
        <LuPlus className="text-sm" /> Add Plot
      </button>
    </div>
  );
}
