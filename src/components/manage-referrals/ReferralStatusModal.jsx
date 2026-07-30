import React from 'react';
import { motion } from 'framer-motion';
import { LuX } from 'react-icons/lu';

export default function ReferralStatusModal({
  show = false,
  onClose,
  selectedLead,
  newStatus = '',
  setNewStatus,
  commissionAmount = '',
  setCommissionAmount,
  onSave,
}) {
  if (!show || !selectedLead) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Update Referral Status &amp; Payout</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <LuX />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Referral Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="site_visit_done">Site Visit Done</option>
              <option value="negotiation">Negotiation</option>
              <option value="booking_done">Booking Done (Eligible for Reward)</option>
              <option value="commission_paid">Commission Paid (Disbursed)</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Commission Payout Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 25000"
              value={commissionAmount}
              onChange={(e) => setCommissionAmount(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
