import React from 'react';

export default function ChatHeader() {
  return (
    <div className="py-14 px-4 text-center relative overflow-hidden bg-[radial-gradient(ellipse_at_30%_20%,rgba(91,79,224,0.35),transparent_55%),linear-gradient(120deg,#0f172a_0%,#0f766e_55%,#0d5f59_100%)]">
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-teal-400/10 pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-white/10 text-teal-200 mb-3 border border-white/10">
          AI SALES REPRESENTATIVE
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 font-sans">
          AI Assistant
        </h1>
        <p className="text-teal-100 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Instant guidance on premium Odisha residential projects, BHK configurations, nearest property matches &amp; location details.
        </p>
      </div>
    </div>
  );
}
