export default function BookingFormFooter({ isEdit, submitting, onClose }) {
  return (
    <div className="flex justify-end items-center gap-3 px-8 py-6 bg-slate-50 border-t border-slate-200 shrink-0">
      <button
        type="button"
        onClick={onClose}
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
  );
}
