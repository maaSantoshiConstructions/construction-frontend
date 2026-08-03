import { fmt } from '../../utils/formatters';

export default function CustomerFinancialStats({
  totalPropertiesCount,
  activeBookingsCount,
  completedBookingsCount,
  cancelledBookingsCount,
  totalBookingValue,
  totalPaid,
  totalOutstanding,
  totalRefunded,
}) {
  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Properties</span>
          <p className="text-2xl font-extrabold text-slate-800">{totalPropertiesCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">Active Bookings</span>
          <p className="text-2xl font-extrabold text-sky-600">{activeBookingsCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Completed Bookings</span>
          <p className="text-2xl font-extrabold text-emerald-600">{completedBookingsCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider block mb-1">Cancelled Bookings</span>
          <p className="text-2xl font-extrabold text-red-500">{cancelledBookingsCount}</p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Booking Value</span>
          <p className="text-xl font-bold text-slate-800">₹{fmt(totalBookingValue)}</p>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Total Paid</span>
          <p className="text-xl font-extrabold text-emerald-600">₹{fmt(totalPaid)}</p>
        </div>

        <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-orange-800 uppercase tracking-wider block mb-1">Outstanding Amount</span>
          <p className="text-xl font-extrabold text-orange-600">₹{fmt(totalOutstanding)}</p>
        </div>

        <div className="bg-violet-50/70 border border-violet-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-violet-800 uppercase tracking-wider block mb-1">Total Refunded</span>
          <p className="text-xl font-bold text-violet-700">₹{fmt(totalRefunded)}</p>
        </div>
      </div>
    </div>
  );
}
