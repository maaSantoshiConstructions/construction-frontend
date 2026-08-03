import { FaArrowLeft } from 'react-icons/fa';
import { fmtDate } from '../../utils/formatters';

export default function CustomerHeader({
  custName,
  custCode,
  custEmail,
  custPhone,
  createdAt,
  salesExec,
  navigate,
}) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </span>
          <span>&gt;</span>
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/admin/customers')}>
            Customers
          </span>
          <span>&gt;</span>
          <span className="text-amber-700">Customer Details</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
          <button
            onClick={() => navigate('/admin/customers')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            <FaArrowLeft /> Back to Customers
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/bookings')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              View Bookings
            </button>
            <button
              onClick={() => navigate('/admin/payments')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              View Payments
            </button>
          </div>
        </div>
      </div>

      {/* Customer Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            {custName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-slate-800">{custName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {custCode}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-4 flex-wrap">
              <span>✉ {custEmail}</span>
              <span>📞 {custPhone}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 border border-slate-100 rounded-xl p-4 w-full md:w-auto">
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Registration Date</span>
            <span className="font-bold text-slate-800">{fmtDate(createdAt)}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Assigned Executive</span>
            <span className="font-bold text-slate-800">{salesExec}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
