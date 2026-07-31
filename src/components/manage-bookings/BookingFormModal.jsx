import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaLock, FaPaperclip, FaMoneyBillWave } from 'react-icons/fa';
import ChangePaymentPlanDialog from './ChangePaymentPlanDialog';

const PLAN_LABELS = {
  full_payment: 'Full Payment',
  installment: 'Installment Plan',
  loan: 'Bank Loan',
};

const PAYMENT_STATUS_COLORS = {
  token_paid:     'bg-amber-100 text-amber-700',
  partially_paid: 'bg-orange-100 text-orange-700',
  fully_paid:     'bg-emerald-100 text-emerald-700',
  refunded:       'bg-violet-100 text-violet-700',
};

export default function BookingFormModal({
  showFormModal,
  setShowFormModal,
  editing,
  submitting,
  onSubmit,
  availablePlots,
  customers,
  salesExecutives,
  register,
  handleSubmitForm,
  errors,
  userRole,
  setValue,
  tokenAmountWatched,
  paymentMethodWatched,
  totalAmountWatched,
  onPaymentPlanChanged,
}) {
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const fileRef = useRef(null);

  const isEdit = Boolean(editing);
  const isSuperAdmin = userRole === 'super_admin';
  const todayStr = new Date().toISOString().split('T')[0];

  const tokenAmountNum = Number(tokenAmountWatched || 0);
  const totalAmountNum = Number(totalAmountWatched || 0);
  const paymentMethodVal = paymentMethodWatched || 'cash';

  const isTokenPaymentVisible = !isEdit && tokenAmountNum > 0;

  // Dynamic reset when token amount is zero or cleared
  useEffect(() => {
    if (!isEdit && tokenAmountNum <= 0 && setValue) {
      setValue('paymentMethod', 'cash');
      setValue('referenceNumber', '');
      setValue('paymentDate', todayStr);
      setReceiptFile(null);
    }
  }, [tokenAmountNum, isEdit, setValue, todayStr]);

  // Dynamic reset of reference number when cash is selected
  useEffect(() => {
    if (!isEdit && paymentMethodVal === 'cash' && setValue) {
      setValue('referenceNumber', '');
    }
  }, [paymentMethodVal, isEdit, setValue]);

  if (!showFormModal) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            onSubmit={handleSubmitForm((data) => onSubmit(data, receiptFile))}
            className="flex flex-col max-h-[90vh] overflow-hidden"
          >

            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isEdit ? 'Edit Booking' : 'New Plot Booking'}
                </h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  {isEdit ? 'Update booking details below' : 'Fill in the details to create a booking'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-7 py-7 flex flex-col gap-6">

              {/* Customer */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Customer <span className="text-red-500">*</span>
                </label>
                {isEdit ? (
                  <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium">
                    {editing.customer?.name || '—'} ({editing.customer?.email || '—'})
                  </div>
                ) : (
                  <select
                    {...register('customer', { required: 'Customer is required' })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.email || c.phone || 'No Contact'})
                      </option>
                    ))}
                  </select>
                )}
                {errors.customer && <p className="text-red-500 text-xs mt-1.5">{errors.customer.message}</p>}
              </div>

              {/* Plot — read-only when editing */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Plot <span className="text-red-500">*</span>
                </label>
                {isEdit ? (
                  <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium">
                    Plot #{editing.plot?.plotNumber} — {editing.project?.name || 'No Project'}
                  </div>
                ) : (
                  <select
                    {...register('plot', { required: 'Plot selection is required' })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
                  >
                    <option value="">Select Plot</option>
                    {availablePlots.map((p) => (
                      <option key={p._id} value={p._id}>
                        Plot #{p.plotNumber} — {p.project?.name || 'No Project'} (₹{p.price?.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                )}
                {errors.plot && <p className="text-red-500 text-xs mt-1.5">{errors.plot.message}</p>}
              </div>

              {/* Amounts — only for new booking */}
              {!isEdit && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Total Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1500000"
                      {...register('totalAmount', {
                        required: 'Total amount is required',
                        min: { value: 1, message: 'Must be positive' },
                      })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                    {errors.totalAmount && <p className="text-red-500 text-xs mt-1.5">{errors.totalAmount.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Token Amount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 25000"
                      {...register('tokenAmount', {
                        validate: {
                          maxTotal: (val) => {
                            const tot = totalAmountNum;
                            const tok = Number(val || 0);
                            if (tot > 0 && tok > tot) {
                              return 'Token Amount cannot exceed Total Amount';
                            }
                            return true;
                          },
                        },
                      })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                    {errors.tokenAmount && <p className="text-red-500 text-xs mt-1.5">{errors.tokenAmount.message}</p>}
                  </div>
                </div>
              )}

              {/* Payment Plan */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Payment Plan
                </label>
                {isEdit ? (
                  /* READ-ONLY in edit mode */
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium">
                      <FaLock className="text-slate-400 text-xs" />
                      <span>{PLAN_LABELS[editing.paymentPlan] || editing.paymentPlan || '—'}</span>
                    </div>
                    {isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => setShowPlanDialog(true)}
                        className="px-3 py-3 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors whitespace-nowrap"
                        title="Super Admin override"
                      >
                        Change Plan ↗
                      </button>
                    )}
                  </div>
                ) : (
                  <select
                    {...register('paymentPlan')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
                  >
                    <option value="full_payment">Full Payment</option>
                    <option value="installment">Installment Plan</option>
                    <option value="loan">Bank Loan</option>
                  </select>
                )}
                {isEdit && (
                  <p className="text-xs text-slate-400 mt-1.5">
                    Payment plan cannot be changed after booking is created.{isSuperAdmin ? '' : ' Contact Super Admin for exceptions.'}
                  </p>
                )}
              </div>

              {/* Booking Status — edit mode only */}
              {isEdit && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Booking Status
                  </label>
                  <select
                    {...register('bookingStatus')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              {/* Sales Executive */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Sales Executive
                </label>
                <select
                  {...register('salesExecutive')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
                >
                  <option value="">Select Sales Executive</option>
                  {salesExecutives.map((se) => (
                    <option key={se._id} value={se._id}>
                      {se.name} ({se.role || 'Staff'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="E.g. Price agreed including basic layout development charges..."
                  {...register('remarks')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                />
              </div>

              {/* ─── DYNAMIC SECTION: INITIAL TOKEN PAYMENT (Highlighted Box) ──── */}
              {!isEdit && isTokenPaymentVisible && (
                <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                        <FaMoneyBillWave />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Initial Token Payment
                        </h3>
                        <p className="text-xs text-amber-700">Token Amount: ₹{tokenAmountNum.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-amber-200/80 text-amber-800 rounded-full">
                      Payment Required
                    </span>
                  </div>

                  {/* Payment Amount — Read Only */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Payment Amount (Read Only)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`₹${tokenAmountNum.toLocaleString('en-IN')}`}
                      className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-800 outline-none cursor-not-allowed shadow-xs"
                    />
                  </div>

                  {/* Payment Mode + Reference Number */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Payment Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('paymentMethod', {
                          required: isTokenPaymentVisible ? 'Payment Mode is required' : false,
                        })}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 font-medium outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer shadow-xs"
                      >
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="online">Online</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cheque">Cheque</option>
                      </select>
                      {errors.paymentMethod && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.paymentMethod.message}</p>
                      )}
                    </div>

                    {paymentMethodVal !== 'cash' ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Reference Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. UTR / Cheque No."
                          {...register('referenceNumber', {
                            required:
                              isTokenPaymentVisible && paymentMethodVal !== 'cash'
                                ? 'Reference number is required'
                                : false,
                          })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 font-medium outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all shadow-xs"
                        />
                        {errors.referenceNumber && (
                          <p className="text-red-500 text-xs mt-1.5">{errors.referenceNumber.message}</p>
                        )}
                      </div>
                    ) : (
                      <div className="opacity-50">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Reference Number
                        </label>
                        <input
                          type="text"
                          disabled
                          placeholder="Not required for Cash"
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 font-medium cursor-not-allowed"
                        />
                      </div>
                    )}
                  </div>

                  {/* Payment Date + Upload Receipt */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Payment Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        max={todayStr}
                        {...register('paymentDate', {
                          required: isTokenPaymentVisible ? 'Payment Date is required' : false,
                          max: { value: todayStr, message: 'Future dates are not allowed' },
                        })}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 font-medium outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all shadow-xs"
                      />
                      {errors.paymentDate && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.paymentDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Upload Receipt
                      </label>
                      <div
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-3 bg-white border border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all shadow-xs"
                      >
                        <FaPaperclip className="text-slate-400 shrink-0 text-xs" />
                        <span className="text-xs text-slate-500 truncate">
                          {receiptFile ? receiptFile.name : 'Attach receipt (PDF/Image)'}
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
                        <p className="text-xs text-emerald-600 mt-1 font-medium truncate">
                          ✓ {receiptFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Read-only payment summary when editing */}
              {isEdit && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Payment Summary (System Calculated)</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400 text-xs">Paid</span>
                      <p className="font-bold text-emerald-700">₹{(editing.paidAmount || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs">Remaining</span>
                      <p className="font-bold text-orange-600">₹{(editing.remainingAmount || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs">Payment Status</span>
                      <p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[editing.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
                          {editing.paymentStatus?.replace(/_/g, ' ') || '—'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-3 px-8 py-6 bg-slate-50 border-t border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold border border-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                <span>{isEdit ? 'Save Changes' : 'Create Booking'}</span>
              </button>
            </div>

          </form>
        </motion.div>
      </div>

      {/* Super Admin — Change Payment Plan Dialog */}
      {showPlanDialog && editing && (
        <ChangePaymentPlanDialog
          bookingId={editing._id}
          currentPlan={editing.paymentPlan}
          onClose={() => setShowPlanDialog(false)}
          onSuccess={onPaymentPlanChanged}
        />
      )}
    </>
  );
}
