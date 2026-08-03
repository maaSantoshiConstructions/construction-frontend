import { FaArrowLeft, FaEdit, FaPlus } from 'react-icons/fa';
import { BOOKING_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '../../constants/statusStyles';
import { fmtDate } from '../../utils/formatters';

export default function BookingDetailsHeader({
  booking,
  navigate,
  openEditModal,
  onAddPayment,
}) {
  if (!booking) return null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/bookings')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-800"
        >
          <FaArrowLeft />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">
              Booking <span className="font-mono text-amber-700">#{booking.bookingId}</span>
            </h1>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                BOOKING_STATUS_COLORS[booking.bookingStatus] || 'bg-slate-100 text-slate-600'
              }`}
            >
              {booking.bookingStatus}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                PAYMENT_STATUS_COLORS[booking.paymentStatus] || 'bg-slate-100 text-slate-600'
              }`}
            >
              {booking.paymentStatus?.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Created {fmtDate(booking.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={openEditModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
        >
          <FaEdit className="text-xs" /> Edit
        </button>
        {booking.bookingStatus !== 'cancelled' && (
          <button
            onClick={onAddPayment}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5 transition-all"
          >
            <FaPlus className="text-xs" /> Add Payment
          </button>
        )}
      </div>
    </div>
  );
}
