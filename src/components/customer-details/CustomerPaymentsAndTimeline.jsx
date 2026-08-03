import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import DataTable from '../common/DataTable';
import { TXSTATUS_COLORS, TYPE_COLORS } from '../../constants/statusStyles';
import { fmt, fmtDate } from '../../utils/formatters';

export default function CustomerPaymentsAndTimeline({
  payments = [],
  timelineEvents = [],
  handleDownloadReceipt,
  navigate,
}) {
  const paymentColumns = [
    {
      key: 'paymentId',
      label: 'Payment ID',
      render: (r) => <span className="font-mono text-xs font-bold text-amber-700">{r.paymentId || `#${r._id?.slice(-6)}`}</span>,
    },
    {
      key: 'bookingId',
      label: 'Booking ID',
      render: (r) => (
        <span className="font-mono text-xs text-indigo-600 font-semibold">
          {r.booking?.bookingId ? `#${r.booking.bookingId}` : r.booking ? `#${r.booking._id?.slice(-6)}` : '—'}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (r) => <span className="text-xs text-slate-600 font-medium whitespace-nowrap">{fmtDate(r.paidAt || r.createdAt)}</span>,
    },
    {
      key: 'paymentType',
      label: 'Type',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${TYPE_COLORS[r.paymentType] || 'bg-slate-100 text-slate-600'}`}>
          {r.paymentType?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (r) => <span className="font-bold text-slate-800">₹{fmt(r.amount)}</span>,
    },
    {
      key: 'paymentMethod',
      label: 'Mode',
      render: (r) => <span className="capitalize text-xs font-medium text-slate-600">{r.paymentMethod?.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${TXSTATUS_COLORS[r.transactionStatus] || 'bg-slate-100 text-slate-600'}`}>
          {r.transactionStatus}
        </span>
      ),
    },
    {
      key: 'receipt',
      label: 'Receipt',
      render: (r) => (
        <button
          onClick={() => handleDownloadReceipt(r._id, r.paymentId)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Download Receipt"
        >
          <FaDownload className="text-xs" />
        </button>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Payment History (2 Columns) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Payment History</h3>
              <p className="text-xs text-slate-400">Recent transactions for this customer</p>
            </div>
            <button
              onClick={() => navigate('/admin/payments')}
              className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
            >
              View All Payments <FaExternalLinkAlt className="text-3xs" />
            </button>
          </div>

          {payments.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
              No payment transactions recorded for this customer.
            </div>
          ) : (
            <DataTable columns={paymentColumns} data={payments} loading={false} />
          )}
        </div>
      </div>

      {/* Customer Activity Timeline (1 Column) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
          Activity Timeline
        </h3>

        <div className="space-y-4 pt-1">
          {timelineEvents.map((ev, idx) => {
            const Icon = ev.icon;
            return (
              <div key={idx} className="flex items-start gap-3 relative">
                <div className={`w-8 h-8 rounded-xl ${ev.color} text-white flex items-center justify-center text-xs shrink-0 shadow-xs`}>
                  <Icon />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{ev.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{ev.desc}</p>
                  <span className="text-3xs font-semibold text-slate-400 mt-0.5 block">{ev.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
