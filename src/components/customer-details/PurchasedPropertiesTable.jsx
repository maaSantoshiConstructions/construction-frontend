import { FaEye } from 'react-icons/fa';
import DataTable from '../common/DataTable';
import { BOOKING_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '../../constants/statusStyles';
import { fmt, fmtDate } from '../../utils/formatters';

export default function PurchasedPropertiesTable({ bookings = [], custName, navigate }) {
  const propertyColumns = [
    {
      key: 'bookingId',
      label: 'Booking ID',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-amber-700">
          #{r.bookingId || r._id?.slice(-6)}
        </span>
      ),
    },
    {
      key: 'project',
      label: 'Project',
      render: (r) => <span className="font-medium text-slate-800">{r.project?.name || '—'}</span>,
    },
    {
      key: 'plot',
      label: 'Plot Number',
      render: (r) => <span className="font-bold text-slate-800">Plot #{r.plot?.plotNumber || '—'}</span>,
    },
    {
      key: 'bookingStatus',
      label: 'Booking Status',
      render: (r) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
            BOOKING_STATUS_COLORS[r.bookingStatus || r.status] || 'bg-slate-100 text-slate-600'
          }`}
        >
          {r.bookingStatus || r.status || 'Active'}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (r) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            PAYMENT_STATUS_COLORS[r.paymentStatus] || 'bg-slate-100 text-slate-600'
          }`}
        >
          {r.paymentStatus?.replace(/_/g, ' ') || 'Token Paid'}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (r) => <span className="font-semibold text-slate-800">₹{fmt(r.totalAmount || r.amount)}</span>,
    },
    {
      key: 'paidAmount',
      label: 'Paid Amount',
      render: (r) => <span className="font-bold text-emerald-600">₹{fmt(r.paidAmount || 0)}</span>,
    },
    {
      key: 'remainingAmount',
      label: 'Outstanding',
      render: (r) => (
        <span className="font-bold text-orange-600">
          ₹{fmt(r.remainingAmount ?? Math.max(0, (r.totalAmount || 0) - (r.paidAmount || 0)))}
        </span>
      ),
    },
    {
      key: 'bookingDate',
      label: 'Booking Date',
      render: (r) => <span className="text-xs text-slate-500 whitespace-nowrap">{fmtDate(r.bookingDate || r.createdAt)}</span>,
    },
    {
      key: 'actions',
      label: 'View Details',
      render: (r) => (
        <button
          onClick={() => navigate(`/admin/bookings/${r._id}`)}
          className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors"
        >
          <FaEye /> View
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">Purchased Properties</h3>
          <p className="text-xs text-slate-400">All plot bookings owned by {custName}</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
          {bookings.length} Property Record(s)
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
          No properties booked by this customer yet.
        </div>
      ) : (
        <DataTable columns={propertyColumns} data={bookings} loading={false} />
      )}
    </div>
  );
}
