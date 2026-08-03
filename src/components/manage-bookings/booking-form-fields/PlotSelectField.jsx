export default function PlotSelectField({ isEdit, editing, register, availablePlots = [], errors = {} }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        Plot <span className="text-red-500">*</span>
      </label>
      {isEdit ? (
        <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium">
          Plot #{editing?.plot?.plotNumber} — {editing?.project?.name || 'No Project'}
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
  );
}
