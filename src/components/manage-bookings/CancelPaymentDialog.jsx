import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { cancelPayment, refundPayment } from '../../api/payments';

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-IN') : '—');

export default function CancelPaymentDialog({ payment, onClose, onSuccess, userRole }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('cancel'); // 'cancel' | 'refund'

  if (!payment) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    setLoading(true);
    try {
      if (action === 'refund') {
        await refundPayment(payment._id, { cancellationReason: reason });
        toast.success('Payment refunded successfully');
      } else {
        await cancelPayment(payment._id, { cancellationReason: reason });
        toast.success('Payment cancelled successfully');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = userRole === 'super_admin';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                <FaExclamationTriangle />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                {isSuperAdmin ? 'Cancel or Refund Payment' : 'Cancel Payment'}
              </h2>
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
            {/* Payment summary */}
            <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500 text-xs">Payment ID</span>
                <p className="font-semibold font-mono text-slate-800">{payment.paymentId || payment._id?.slice(-8)}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Amount</span>
                <p className="font-bold text-slate-800">₹{fmt(payment.amount)}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Type</span>
                <p className="capitalize text-slate-700">{payment.paymentType?.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Date</span>
                <p className="text-slate-700">
                  {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-IN') : '—'}
                </p>
              </div>
            </div>

            {/* Action selector — only super admin sees both options */}
            {isSuperAdmin && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAction('cancel')}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                    action === 'cancel'
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  ⊘ Cancel Payment
                </button>
                <button
                  type="button"
                  onClick={() => setAction('refund')}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                    action === 'refund'
                      ? 'bg-violet-50 border-violet-300 text-violet-700'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  ↩ Process Refund
                </button>
              </div>
            )}

            {/* Warning */}
            <div className={`text-xs p-3 rounded-xl ${action === 'refund' ? 'bg-violet-50 text-violet-700 border border-violet-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {action === 'refund'
                ? '⚠ This will mark the payment as Refunded and reduce the booking\'s paid amount. A refund record will be created.'
                : '⚠ This will cancel the payment and reduce the booking\'s paid amount. The record will remain visible for audit purposes.'}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Enter reason for ${action === 'refund' ? 'refund' : 'cancellation'}...`}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white text-slate-600 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !reason.trim()}
              className={`flex items-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                action === 'refund'
                  ? 'bg-violet-600 hover:bg-violet-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {action === 'refund' ? 'Process Refund' : 'Cancel Payment'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
