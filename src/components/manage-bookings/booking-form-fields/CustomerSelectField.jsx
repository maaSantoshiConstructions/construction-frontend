export default function CustomerSelectField({ isEdit, editing, register, customers = [], errors = {} }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        Customer <span className="text-red-500">*</span>
      </label>
      {isEdit ? (
        <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium">
          {editing?.customer?.name || '—'} ({editing?.customer?.email || '—'})
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
  );
}
