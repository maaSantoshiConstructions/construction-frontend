import { FaBuilding, FaCheckCircle, FaRupeeSign, FaExclamationCircle } from 'react-icons/fa';
import { fmt } from '../../utils/formatters';

export default function BookingsStatCards({ stats }) {
  const totalBookings = stats?.totalBookings || 0;
  const totalCollected = stats?.totalCollected || 0;
  const totalOutstanding = stats?.totalOutstanding || 0;
  const activeCount = stats?.byBookingStatus?.find((s) => s.bookingStatus === 'active')?.count || 0;

  const summaryCards = [
    { icon: <FaBuilding />, label: 'Total Bookings', value: totalBookings, color: 'indigo' },
    { icon: <FaCheckCircle />, label: 'Active', value: activeCount, color: 'sky' },
    { icon: <FaRupeeSign />, label: 'Revenue Collected', value: `₹${fmt(totalCollected)}`, color: 'emerald' },
    { icon: <FaExclamationCircle />, label: 'Outstanding', value: `₹${fmt(totalOutstanding)}`, color: 'orange' },
  ];

  const colorMap = {
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-200' },
    sky: { bg: 'bg-sky-50', icon: 'bg-sky-100 text-sky-600', border: 'border-sky-200' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {summaryCards.map((card) => {
        const c = colorMap[card.color];
        return (
          <div key={card.label} className={`${c.bg} border ${c.border} rounded-2xl p-3 sm:p-4 flex items-start gap-3 min-w-0`}>
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${c.icon} shrink-0 text-sm`}>
              {card.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide leading-tight">
                {card.label}
              </p>
              <p className="text-sm sm:text-lg font-bold text-slate-800 break-words leading-snug mt-0.5">
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
