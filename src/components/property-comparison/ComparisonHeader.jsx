import React from 'react';

export default function ComparisonHeader() {
  return (
    <div className="relative overflow-hidden text-center py-16 px-4 bg-gradient-to-br from-[#0d1f0d] via-[#1a3a1a] to-[#162b16]">
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-green-500/10" />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <span className="inline-block bg-white/10 text-[#f0a500] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3.5">
          COMPARE TOOLS
        </span>
        <h1 className="font-poppins text-white text-3xl md:text-4xl font-extrabold mt-2 mb-3">
          Property Comparison
        </h1>
        <p className="text-slate-300 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          Select and compare up to 4 plots side-by-side to make the right choice.
        </p>
      </div>
    </div>
  );
}
