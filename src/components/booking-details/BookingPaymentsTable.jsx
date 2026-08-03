import { FaDownload, FaTimes } from 'react-icons/fa';
import { TXSTATUS_COLORS } from '../../constants/statusStyles';
import { fmt, fmtDate } from '../../utils/formatters';

export default function BookingPaymentsTable({
  payments = [],
  totalAmount = 0,
  isSuperAdmin,
  handleDownloadReceipt,
  setCancelingPayment,
}) {
  // Compute running balances for payments
  const computeRunningBalances = (pList, total) => {
    if (!pList || !total) return pList || [];
    let cumulative = 0;
    return pList.map((p) => {
      const effective = p.transactionStatus === 'success' && p.isActive !== false ? p.amount : 0;
      cumulative += effective;
      return {
        ...p,
        runningBalance: Math.max(0, total - cumulative),
      };
    });
  };

  const paymentsWithBalance = computeRunningBalances(payments, totalAmount);
  const tableHeaders = [
    'Payment ID', 'Type', 'Amount', 'Mode', 'Reference No',
    'Collected By', 'Date', 'Status', 'Remaining Balance', 'Receipt', 'Actions',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Payment History</h3>
        <span className="text-xs text-slate-400 font-semibold">
          {payments.length} record{payments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {paymentsWithBalance.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No payments recorded yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {tableHeaders.map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paymentsWithBalance.map((p) => {
                const isCancelled = p.transactionStatus === 'cancelled' || p.transactionStatus === 'refunded';
                return (
                  <tr
                    key={p._id}
                    className={`hover:bg-slate-50/50 transition-colors ${isCancelled ? 'opacity-60' : ''}`}
                  >
                    {/* Payment ID */}
                    <td className="px-4 py-3">
                      <span className={`font-mono text-xs font-bold text-slate-700 ${isCancelled ? 'line-through' : ''}`}>
                        {p.paymentId || `#${p._id?.slice(-6)}`}
                      </span>
                    </td>
                    {/* Type */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold capitalize">
                        {p.paymentType?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    {/* Amount */}
                    <td className="px-4 py-3">
                      <span className={`font-bold text-slate-800 ${isCancelled ? 'line-through text-slate-400' : ''}`}>
                        ₹{fmt(p.amount)}
                      </span>
                    </td>
                    {/* Mode */}
                    <td className="px-4 py-3 text-slate-600 capitalize">{p.paymentMethod?.replace(/_/g, ' ')}</td>
                    {/* Reference No */}
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{p.referenceNumber || '—'}</td>
                    {/* Collected By */}
                    <td className="px-4 py-3 text-slate-600">{p.collectedBy?.name || '—'}</td>
                    {/* Date */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{fmtDate(p.paidAt || p.createdAt)}</td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          TXSTATUS_COLORS[p.transactionStatus] || 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {p.transactionStatus}
                      </span>
                    </td>
                    {/* Remaining Balance */}
                    <td className="px-4 py-3">
                      {isCancelled ? (
                        <span className="text-slate-400 text-xs">—</span>
                      ) : (
                        <span className="font-semibold text-orange-600">₹{fmt(p.runningBalance)}</span>
                      )}
                    </td>
                    {/* Receipt */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDownloadReceipt(p._id)}
                        title="Download Receipt"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <FaDownload className="text-xs" />
                      </button>
                    </td>
                    {/* Actions — Cancel / Refund */}
                    <td className="px-4 py-3">
                      {p.transactionStatus === 'success' ? (
                        <button
                          onClick={() => setCancelingPayment(p)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <FaTimes className="text-xs" />
                          {isSuperAdmin ? 'Cancel/Refund' : 'Cancel'}
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
