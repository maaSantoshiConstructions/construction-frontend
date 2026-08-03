import { PAYMENT_STATUS_COLORS } from '../../../constants/statusStyles';

export default function BookingPaymentSummary({ editing }) {
  if (!editing) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
        Payment Summary (System Calculated)
      </p>
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
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                PAYMENT_STATUS_COLORS[editing.paymentStatus] || 'bg-slate-100 text-slate-600'
              }`}
            >
              {editing.paymentStatus?.replace(/_/g, ' ') || '—'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
