import React from 'react';
import { FaArrowRight, FaPlus } from 'react-icons/fa';

export default function ComparisonFeedback({ selectedCount = 0 }) {
  if (selectedCount >= 2) return null;

  if (selectedCount === 1) {
    return (
      <div className="text-center py-16 px-8 bg-white rounded-2xl border border-slate-200 shadow-md">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <FaArrowRight className="text-lg animate-pulse" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1.5 font-poppins">Select Another Property</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Add at least one more plot or villa above to view comparison specifications.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-20 px-8 bg-white rounded-2xl border border-slate-200 shadow-md">
      <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
        <FaPlus className="text-xl" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1.5 font-poppins">
        No Properties Selected
      </h3>
      <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
        Add up to 4 plots or villas from the listing above to run a side-by-side spec comparison.
      </p>
    </div>
  );
}
