import React from 'react';

export default function ChatWindowHeader() {
  return (
    <div className="px-5 py-4 border-b border-[#e2e8f0] bg-white flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-xl shadow-sm">
        🏠
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800 leading-snug">AI Assistant</h3>
        <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Online • Premium Odisha Projects
        </div>
      </div>
    </div>
  );
}
