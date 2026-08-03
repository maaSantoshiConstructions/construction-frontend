export default function BookingAmountsFields({ register, errors = {}, totalAmountNum = 0 }) {
  return (
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
  );
}
