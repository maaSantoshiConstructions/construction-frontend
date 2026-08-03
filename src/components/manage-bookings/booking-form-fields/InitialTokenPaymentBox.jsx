import { FaMoneyBillWave, FaPaperclip } from 'react-icons/fa';

export default function InitialTokenPaymentBox({
  tokenAmountNum,
  register,
  errors = {},
  paymentMethodVal,
  todayStr,
  fileRef,
  receiptFile,
  setReceiptFile,
  isTokenPaymentVisible,
}) {
  return (
    <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
            <FaMoneyBillWave />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Initial Token Payment</h3>
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
  );
}
