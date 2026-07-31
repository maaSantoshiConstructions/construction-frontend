import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { updatePaymentPlan } from '../../api/bookings';

const PLAN_LABELS = {
  full_payment: 'Full Payment',
  installment: 'Installment Plan',
  loan: 'Bank Loan',
};

export default function ChangePaymentPlanDialog({ bookingId, currentPlan, onClose, onSuccess }) {
  const [plan, setPlan] = useState(currentPlan || 'full_payment');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (plan === currentPlan) {
      toast('No changes made — same plan selected.');
      onClose();
      return;
    }
    setLoading(true);
    try {
      await updatePaymentPlan(bookingId, { paymentPlan: plan });
      toast.success(`Payment plan updated to "${PLAN_LABELS[plan]}"`);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update payment plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <FaShieldAlt />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Change Payment Plan</h2>
                <p className="text-xs text-slate-400">Super Admin override</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
              ⚠ Changing the payment plan may affect installment expectations and financial reporting. This action is logged with your credentials.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                New Payment Plan
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
              >
                <option value="full_payment">Full Payment</option>
                <option value="installment">Installment Plan</option>
                <option value="loan">Bank Loan</option>
              </select>
            </div>

            <div className="text-sm text-slate-500">
              Current: <span className="font-semibold text-slate-700">{PLAN_LABELS[currentPlan] || currentPlan}</span>
              {plan !== currentPlan && (
                <span>
                  {' '} → <span className="font-semibold text-amber-700">{PLAN_LABELS[plan]}</span>
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white text-slate-600 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              Confirm Change
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
