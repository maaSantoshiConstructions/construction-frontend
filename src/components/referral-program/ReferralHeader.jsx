import React from 'react';
import { LuSparkles } from 'react-icons/lu';

export default function ReferralHeader() {
  return (
    <div className="bg-gradient-to-r from-[#0b0f2e] via-[#161b45] to-[#1c1450] py-14 sm:py-16 text-center relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 pointer-events-none" />
      <div className="wrap max-w-4xl mx-auto px-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-400 text-xs font-bold tracking-wider uppercase">
          <LuSparkles size={14} /> REFER &amp; EARN REWARDS
        </span>
        <h1 className="font-['Poppins',sans-serif] text-2xl sm:text-4xl md:text-5xl font-extrabold text-white my-4 leading-tight sm:leading-snug">
          Turn Your Connections Into <span className="text-amber-400">Real Estate Payouts</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Invite your friends and family to invest in prime land with Maa Santoshi Constructions. Log in to access your referral code and earn cash rewards!
        </p>
      </div>
    </div>
  );
}
