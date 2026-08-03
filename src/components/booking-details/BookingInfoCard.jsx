import { FaFileInvoice } from 'react-icons/fa';
import { PLAN_LABELS } from '../../constants/statusStyles';
import { fmt, fmtDate } from '../../utils/formatters';

export default function BookingInfoCard({ booking }) {
  if (!booking) return null;

  const fields = [
    ['Booking Date', fmtDate(booking.bookingDate)],
    ['Payment Plan', PLAN_LABELS[booking.paymentPlan] || booking.paymentPlan],
    ['Token Amount', `₹${fmt(booking.tokenAmount)}`],
    ['Sales Executive', booking.salesExecutive?.name || '—'],
    ['Remarks', booking.remarks || '—'],
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
          <FaFileInvoice />
        </div>
        <h3 className="font-bold text-slate-800 text-sm">Booking Details</h3>
      </div>
      <div className="space-y-3 text-sm">
        {fields.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <span className="text-slate-500 shrink-0">{label}</span>
            <span className="text-slate-800 font-medium text-right break-words max-w-[60%]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
