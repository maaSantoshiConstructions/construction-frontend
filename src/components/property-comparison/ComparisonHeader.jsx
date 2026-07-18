import React from 'react';

export default function ComparisonHeader() {
  return (
    <div className="relative overflow-hidden text-center py-16 px-4 bg-gradient-to-br from-slate-900 to-indigo-950">
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10" />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <span className="inline-block bg-white/10 text-[#e8b355] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3.5">
          COMPARE TOOLS
        </span>
        <h1 className="font-poppins text-white text-3xl md:text-4xl font-extrabold mt-2 mb-3">
          Property Comparison
        </h1>
        <p className="text-indigo-200 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          Select and compare up to 4 plots side-by-side to make the right choice.
        </p>
      </div>
    </div>
  );
}
