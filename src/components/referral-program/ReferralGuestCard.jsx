import React from 'react';
import { Link } from 'react-router-dom';
import { LuLock, LuUserCheck, LuUserPlus } from 'react-icons/lu';

export default function ReferralGuestCard() {
  return (
    <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200 text-center max-w-2xl mx-auto mb-12 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6">
        <LuLock size={32} />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
        Login Required to Refer &amp; Earn Rewards
      </h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        To get your custom referral link, submit referrals directly, and track your cash payouts, please log in to your account.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/login?redirect=/referral-program"
          className="cta-btn w-full sm:w-auto px-8 py-3.5 text-slate-950 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md no-underline border-0"
        >
          <LuUserCheck size={18} />
          <span>Log In to Refer →</span>
        </Link>
        <Link
          to="/register?redirect=/referral-program"
        
          className="w-full sm:w-auto px-8 py-3.5 bg-[#0d1f0d] hover:bg-[#1a3a1a] text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 no-underline"
        >
          <LuUserPlus size={18} className="text-white" />
          <span className="text-white">Create Account</span>
        </Link>
      </div>
    </div>
  );
}
