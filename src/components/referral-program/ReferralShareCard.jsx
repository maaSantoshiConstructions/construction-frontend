import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LuGift, LuCheck, LuCopy, LuMessageSquare, LuUserCheck } from 'react-icons/lu';

export default function ReferralShareCard({
  user,
  userReferralCode = '',
  referralLink = '',
  submittedFriend = null,
  referralCreated = false,
  copied = false,
  onCopy,
  onWhatsAppShare,
  onResetForm,
}) {
  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="bg-gradient-to-br from-[#0b0f2e] to-[#1c1450] text-white rounded-2xl p-6 shadow-md border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#e8b355]">
            <LuGift size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold">Your Referral Link</h3>
            <p className="text-xs text-slate-300">
              Code: <span className="font-mono text-amber-300">{userReferralCode}</span>
            </p>
          </div>
        </div>

        {submittedFriend && referralCreated ? (
          <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <LuCheck size={14} className="text-emerald-400 shrink-0" /> Lead Created for:{' '}
                <strong>{submittedFriend.name}</strong>
              </span>
              <span className="text-[10px] bg-emerald-800/60 text-emerald-200 px-2 py-0.5 rounded-md font-mono">
                {submittedFriend.phone}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-emerald-800/40 text-[11px] text-slate-300">
              <span>Want to refer another friend?</span>
              <button
                type="button"
                onClick={() => {
                  if (onResetForm) onResetForm();
                  toast.success("Form reset. Enter your next friend's details!");
                }}
                className="text-[#e8b355] font-bold hover:underline cursor-pointer"
              >
                + Refer Another Friend
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 flex items-center gap-2">
            <span className="text-amber-400 font-bold shrink-0">ℹ️</span>
            <span>Fill and submit your friend&apos;s details first to enable referral link copying and WhatsApp sharing.</span>
          </div>
        )}

        <div className="bg-white/10 rounded-xl p-3 mb-4 flex items-center justify-between gap-2 border border-white/10">
          <span className={`text-xs font-mono truncate ${referralCreated ? 'text-amber-200' : 'text-slate-400 select-none'}`}>
            {referralCreated ? referralLink : 'Submit referral to reveal link...'}
          </span>
          <button
            type="button"
            disabled={!referralCreated}
            onClick={() => onCopy(referralLink)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1 ${
              !referralCreated
                ? 'bg-slate-600/50 text-slate-400 opacity-50 cursor-not-allowed'
                : 'bg-[#e8b355] hover:bg-[#d8a345] text-[#0b0f2e] cursor-pointer'
            }`}
          >
            {copied ? <LuCheck size={14} /> : <LuCopy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            disabled={!referralCreated}
            onClick={onWhatsAppShare}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              !referralCreated
                ? 'bg-slate-700/50 text-slate-400 opacity-50 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
            }`}
          >
            <LuMessageSquare size={16} /> Share on WhatsApp
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <LuUserCheck size={16} className="text-indigo-600" /> Track Payouts &amp; Earnings
          </h4>
          <p className="text-xs text-slate-500 mt-1">View real-time referral conversions in your Owner Dashboard.</p>
        </div>
        <Link
          to={user?.role === 'channel_partner' ? '/partner/referrals' : '/customer/referrals'}
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors shrink-0 ml-3"
        >
          My Referrals →
        </Link>
      </div>
    </div>
  );
}
