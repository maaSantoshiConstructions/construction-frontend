import { FaFilter } from 'react-icons/fa';

export default function BookingsFilterBar({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  setPage,
}) {
  const handleClear = () => {
    setFilters({ bookingStatus: '', paymentStatus: '', search: '' });
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
            showFilters
              ? 'bg-amber-50 border-amber-300 text-amber-700'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <FaFilter className="text-xs" /> Filters
        </button>

        {showFilters && (filters.bookingStatus || filters.paymentStatus) && (
          <button
            onClick={handleClear}
            className="px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <select
            value={filters.bookingStatus}
            onChange={(e) => {
              setFilters((f) => ({ ...f, bookingStatus: e.target.value }));
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filters.paymentStatus}
            onChange={(e) => {
              setFilters((f) => ({ ...f, paymentStatus: e.target.value }));
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="">All Payment Status</option>
            <option value="token_paid">Token Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="fully_paid">Fully Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      )}
    </div>
  );
}
