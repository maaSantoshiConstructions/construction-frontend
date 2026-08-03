import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ChangePaymentPlanDialog from './ChangePaymentPlanDialog';

import BookingFormHeader from './booking-form-fields/BookingFormHeader';
import CustomerSelectField from './booking-form-fields/CustomerSelectField';
import PlotSelectField from './booking-form-fields/PlotSelectField';
import BookingAmountsFields from './booking-form-fields/BookingAmountsFields';
import PaymentPlanField from './booking-form-fields/PaymentPlanField';
import InitialTokenPaymentBox from './booking-form-fields/InitialTokenPaymentBox';
import BookingPaymentSummary from './booking-form-fields/BookingPaymentSummary';
import BookingFormFooter from './booking-form-fields/BookingFormFooter';

export default function BookingFormModal({
  showFormModal,
  setShowFormModal,
  editing,
  submitting,
  onSubmit,
  availablePlots = [],
  customers = [],
  salesExecutives = [],
  register,
  handleSubmitForm,
  errors = {},
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
            <BookingFormHeader isEdit={isEdit} onClose={() => setShowFormModal(false)} />

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-7 py-7 flex flex-col gap-6">
              <CustomerSelectField
                isEdit={isEdit}
                editing={editing}
                register={register}
                customers={customers}
                errors={errors}
              />

              <PlotSelectField
                isEdit={isEdit}
                editing={editing}
                register={register}
                availablePlots={availablePlots}
                errors={errors}
              />

              {!isEdit && (
                <BookingAmountsFields
                  register={register}
                  errors={errors}
                  totalAmountNum={totalAmountNum}
                />
              )}

              <PaymentPlanField
                isEdit={isEdit}
                editing={editing}
                isSuperAdmin={isSuperAdmin}
                register={register}
                onOpenPlanDialog={() => setShowPlanDialog(true)}
              />

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

              {/* Initial Token Payment Box */}
              {!isEdit && isTokenPaymentVisible && (
                <InitialTokenPaymentBox
                  tokenAmountNum={tokenAmountNum}
                  register={register}
                  errors={errors}
                  paymentMethodVal={paymentMethodVal}
                  todayStr={todayStr}
                  fileRef={fileRef}
                  receiptFile={receiptFile}
                  setReceiptFile={setReceiptFile}
                  isTokenPaymentVisible={isTokenPaymentVisible}
                />
              )}

              <BookingPaymentSummary editing={editing} />
            </div>

            <BookingFormFooter
              isEdit={isEdit}
              submitting={submitting}
              onClose={() => setShowFormModal(false)}
            />
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
