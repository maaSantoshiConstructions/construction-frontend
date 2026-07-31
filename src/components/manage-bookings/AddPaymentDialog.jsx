import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperclip } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createPayment } from '../../api/payments';
import { getUsers } from '../../api/users';

export default function AddPaymentDialog({ booking, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const fileRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      paymentType: 'installment',
      paymentMethod: 'cash',
      paymentDate: new Date().toISOString().split('T')[0],
    },
  });

  if (!booking) return null;

  const remainingAmount = booking.remainingAmount ?? (booking.totalAmount - booking.paidAmount);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('booking', booking._id);
      formData.append('amount', data.amount);
      formData.append('paymentType', data.paymentType);
      formData.append('paymentMethod', data.paymentMethod);
      if (data.referenceNumber) formData.append('referenceNumber', data.referenceNumber);
      if (data.remarks) formData.append('remarks', data.remarks);
      if (data.paymentDate) formData.append('paymentDate', data.paymentDate);
      if (receiptFile) formData.append('receipt', receiptFile);

      await createPayment(formData);
      toast.success('Payment recorded successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[92vh] overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add Payment</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  Booking <span className="font-mono font-semibold text-amber-600">#{booking.bookingId}</span>
                  &nbsp;·&nbsp;Outstanding: <span className="font-semibold text-orange-600">₹{remainingAmount?.toLocaleString('en-IN')}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="e.g. 500000"
                  {...register('amount', {
                    required: 'Amount is required',
                    min: { value: 1, message: 'Amount must be positive' },
                  })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1.5">{errors.amount.message}</p>}
              </div>

              {/* Payment Type + Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Payment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('paymentType', { required: true })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
                  >
                    <option value="token">Token</option>
                    <option value="installment">Installment</option>
                    <option value="final_payment">Final Payment</option>
                    <option value="loan_disbursement">Loan Disbursement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('paymentMethod', { required: true })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
                  >
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="online">Online Transfer</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
              </div>

              {/* Reference + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reference No</label>
                  <input
                    type="text"
                    placeholder="UTR / Cheque No."
                    {...register('referenceNumber')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('paymentDate', { required: 'Date is required' })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                  {errors.paymentDate && <p className="text-red-500 text-xs mt-1.5">{errors.paymentDate.message}</p>}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes about this payment..."
                  {...register('remarks')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                />
              </div>

              {/* Receipt Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Upload Receipt
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all"
                >
                  <FaPaperclip className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-500 truncate">
                    {receiptFile ? receiptFile.name : 'Click to attach receipt (PDF / Image)'}
                  </span>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                />
                {receiptFile && (
                  <p className="text-xs text-emerald-600 mt-1.5 font-medium">
                    ✓ {receiptFile.name} ({(receiptFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-3 px-7 py-5 bg-slate-50 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white text-slate-600 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                Record Payment
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
