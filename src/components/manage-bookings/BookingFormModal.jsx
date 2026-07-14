import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

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
}) {
  if (!showFormModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmitForm(onSubmit)} className="flex flex-col max-h-[90vh] overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{editing ? 'Edit Customer Booking' : 'New Plot Booking'}</h2>
              <p className="text-sm text-slate-400 mt-0.5 font-medium">{editing ? 'Update booking details below' : 'Fill in the details to create a booking'}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowFormModal(false)}
              className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700"
            >
              <FaTimes />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-7 py-7 flex flex-col gap-6">

            {/* Customer */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Customer *</label>
              {editing ? (
                <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium">
                  {editing.customer?.name || '-'} ({editing.customer?.email || '-'})
                </div>
              ) : (
                <select
                  {...register('customer', { required: 'Customer is required' })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.email || c.phone || 'No Contact'})
                    </option>
                  ))}
                </select>
              )}
              {errors.customer && <p className="text-rose-500 text-xs mt-1.5">{errors.customer.message}</p>}
            </div>

            {/* Plot */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Plot *</label>
              {editing ? (
                <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium">
                  Plot #{editing.plot?.plotNumber} - {editing.project?.name || 'No Project'}
                </div>
              ) : (
                <select
                  {...register('plot', { required: 'Plot selection is required' })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
                >
                  <option value="">Select Plot</option>
                  {availablePlots.map(p => (
                    <option key={p._id} value={p._id}>
                      Plot #{p.plotNumber} - {p.project?.name || 'No Project'} (₹{p.price?.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              )}
              {errors.plot && <p className="text-rose-500 text-xs mt-1.5">{errors.plot.message}</p>}
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 1500000"
                  {...register('totalAmount', { required: 'Total amount is required', min: { value: 0, message: 'Must be positive' } })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
                />
                {errors.totalAmount && <p className="text-rose-500 text-xs mt-1.5">{errors.totalAmount.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Token Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  {...register('tokenAmount')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Payment Plan & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Plan</label>
                <select
                  {...register('paymentPlan')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
                >
                  <option value="full_payment">Full Payment</option>
                  <option value="installment">Installment Plan</option>
                  <option value="loan">Bank Loan Financing</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Booking Status</label>
                <select
                  {...register('status')}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="token">Token Paid</option>
                  <option value="partial">Partial Payments</option>
                  <option value="completed">Completed / Sold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Sales Executive */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sales Executive</label>
              <select
                {...register('salesExecutive')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
              >
                <option value="">Select Sales Executive</option>
                {salesExecutives.map(se => (
                  <option key={se._id} value={se._id}>
                    {se.name} ({se.role || 'Staff'})
                  </option>
                ))}
              </select>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Remarks</label>
              <textarea
                rows={3}
                placeholder="E.g. Price agreed including basic layout development charges..."
                {...register('remarks')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400 resize-none leading-relaxed"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-3 px-8 py-6 bg-slate-50 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setShowFormModal(false)}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold border border-slate-200 rounded-xl transition-all active:scale-95 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              <span>{editing ? 'Save Changes' : 'Create Booking'}</span>
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
