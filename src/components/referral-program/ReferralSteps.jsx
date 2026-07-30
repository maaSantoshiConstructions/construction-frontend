import React from 'react';
import { LuShare2, LuBuilding2, LuHandCoins } from 'react-icons/lu';

export default function ReferralSteps() {
  return (
    <div className="mb-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-slate-900">How The Referral Program Works</h2>
        <p className="text-sm text-slate-500 mt-2">Earn rewards in 3 simple, transparent steps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4">
            1
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <LuShare2 size={18} className="text-indigo-600" /> Share &amp; Invite
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Log in to get your custom referral link or submit your friend's details directly using your referral dashboard.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 font-bold text-xl mb-4 flex items-center justify-center">
            2
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <LuBuilding2 size={18} className="text-amber-600" /> Site Visit &amp; Booking
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our sales team guides your friend with live plot maps, virtual tours, and site visits to pick their plot.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xl mb-4 flex items-center justify-center">
            3
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <LuHandCoins size={18} className="text-emerald-600" /> Earn Cash Payout
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Once their plot booking agreement is confirmed, your 1% cash reward is transferred directly to your bank account.
          </p>
        </div>
      </div>
    </div>
  );
}
