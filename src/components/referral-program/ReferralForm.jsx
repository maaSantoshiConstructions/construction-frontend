import React from 'react';
import { LuSend } from 'react-icons/lu';

export default function ReferralForm({
  user,
  friendName = '',
  setFriendName,
  friendPhone = '',
  setFriendPhone,
  friendEmail = '',
  setFriendEmail,
  notes = '',
  setNotes,
  submitting = false,
  onSubmit,
}) {
  return (
    <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
          <LuSend size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Refer a Friend Directly</h3>
          <p className="text-xs text-slate-500">Welcome, {user?.name}! Submit your friend's info below.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Friend's Name *</label>
            <input
              type="text"
              required
              placeholder="Friend's full name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Friend's Phone *</label>
            <input
              type="tel"
              required
              placeholder="Friend's mobile number"
              value={friendPhone}
              onChange={(e) => setFriendPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Friend's Email (Optional)</label>
          <input
            type="email"
            placeholder="Friend's email address"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Preferred Location</label>
          <textarea
            rows={2}
            placeholder="e.g. Interested in Bhubaneswar residential plot, budget 25 Lakhs"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-[#0d1f0d] hover:bg-[#1a3a1a] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? 'Submitting Referral...' : 'Submit Referral Lead →'}
        </button>
      </form>
    </div>
  );
}
