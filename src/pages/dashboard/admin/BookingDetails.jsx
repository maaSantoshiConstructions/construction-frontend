import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaArrowLeft, FaPlus, FaEdit, FaDownload, FaTimes, FaCheck,
  FaMapMarkerAlt, FaUser, FaFileInvoice,
} from 'react-icons/fa';
import { getBookingDetails } from '../../../api/bookings';
import { downloadReceipt } from '../../../api/payments';
import { useAuth } from '../../../context/AuthContext';
import PaymentSummaryCards from '../../../components/manage-bookings/PaymentSummaryCards';
import AddPaymentDialog from '../../../components/manage-bookings/AddPaymentDialog';
import BookingFormModal from '../../../components/manage-bookings/BookingFormModal';
import CancelPaymentDialog from '../../../components/manage-bookings/CancelPaymentDialog';
import { getPlots } from '../../../api/plots';
import { getUsers } from '../../../api/users';
import { updateBooking } from '../../../api/bookings';
import { useForm } from 'react-hook-form';

import { BOOKING_STATUS_COLORS, PAYMENT_STATUS_COLORS, TXSTATUS_COLORS, PLAN_LABELS } from '../../../constants/statusStyles';
import { fmt, fmtDate, formatDateTime } from '../../../utils/formatters';
import { downloadBlobFile } from '../../../utils/download';

const fmtDateTime = formatDateTime;

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showEditBooking, setShowEditBooking] = useState(false);
  const [cancelingPayment, setCancelingPayment] = useState(null);
  const [availablePlots, setAvailablePlots] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getBookingDetails(id);
      setDetails(res?.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchDetails(); }, [id]);

  const openEditModal = async () => {
    try {
      const { data: res } = await getUsers({ limit: 100 });
      const staff = (res?.data || []).filter((u) =>
        ['super_admin', 'company_admin', 'sales_executive'].includes(u.role)
      );
      setSalesExecutives(staff);
      if (details?.booking) {
        setAvailablePlots(details.booking.plot ? [details.booking.plot] : []);
      }
    } catch {}
    if (details?.booking) {
      reset({
        customer: details.booking.customer?._id || '',
        plot: details.booking.plot?._id || '',
        paymentPlan: details.booking.paymentPlan || 'full_payment',
        totalAmount: details.booking.totalAmount || '',
        tokenAmount: details.booking.tokenAmount || '',
        bookingStatus: details.booking.bookingStatus || 'active',
        salesExecutive: details.booking.salesExecutive?._id || '',
        remarks: details.booking.remarks || '',
      });
    }
    setShowEditBooking(true);
  };

  const onEditSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await updateBooking(id, formData);
      toast.success('Booking updated');
      setShowEditBooking(false);
      fetchDetails();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReceipt = async (paymentId) => {
    try {
      const res = await downloadReceipt(paymentId);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download receipt');
    }
  };

  // ── Compute running balances for payments ──────────────────────────────────
  const computeRunningBalances = (payments, totalAmount) => {
    if (!payments || !totalAmount) return payments || [];
    let cumulative = 0;
    return payments.map((p) => {
      // Only count successful active payments in the running total
      const effective = p.transactionStatus === 'success' && p.isActive !== false ? p.amount : 0;
      cumulative += effective;
      return {
        ...p,
        runningBalance: Math.max(0, totalAmount - cumulative),
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-red-500 font-semibold">{error || 'Booking not found'}</p>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-all"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  const { booking, paymentSummary, payments } = details;
  const paymentsWithBalance = computeRunningBalances(payments, booking.totalAmount);
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <div className="space-y-6">

      {/* Breadcrumb + Actions */}
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
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BOOKING_STATUS_COLORS[booking.bookingStatus] || 'bg-slate-100 text-slate-600'}`}>
                {booking.bookingStatus}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[booking.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
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
              onClick={() => setShowAddPayment(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5 transition-all"
            >
              <FaPlus className="text-xs" /> Add Payment
            </button>
          )}
        </div>
      </div>

      {/* Payment Summary Cards */}
      <PaymentSummaryCards
        totalAmount={paymentSummary.totalAmount}
        paidAmount={paymentSummary.paidAmount}
        remainingAmount={paymentSummary.remainingAmount}
        progressPercent={paymentSummary.progressPercent}
        lastPaymentDate={paymentSummary.lastPaymentDate}
        paymentStatus={paymentSummary.paymentStatus}
      />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Booking Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <FaFileInvoice />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Booking Details</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              ['Booking Date', fmtDate(booking.bookingDate)],
              ['Payment Plan', PLAN_LABELS[booking.paymentPlan] || booking.paymentPlan],
              ['Token Amount', `₹${fmt(booking.tokenAmount)}`],
              ['Sales Executive', booking.salesExecutive?.name || '—'],
              ['Remarks', booking.remarks || '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3">
                <span className="text-slate-500 shrink-0">{label}</span>
                <span className="text-slate-800 font-medium text-right break-words max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
              <FaUser />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Customer</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              ['Name', booking.customer?.name || '—'],
              ['Email', booking.customer?.email || '—'],
              ['Phone', booking.customer?.phone || '—'],
              ['City', booking.customer?.city || '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3">
                <span className="text-slate-500 shrink-0">{label}</span>
                <span className="text-slate-800 font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plot Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <FaMapMarkerAlt />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Plot Details</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              ['Project', booking.project?.name || '—'],
              ['Plot Number', booking.plot?.plotNumber ? `#${booking.plot.plotNumber}` : '—'],
              ['Size', booking.plot?.size ? `${booking.plot.size} sq.ft` : '—'],
              ['Facing', booking.plot?.facing || '—'],
              ['Road Width', booking.plot?.roadWidth ? `${booking.plot.roadWidth} ft` : '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3">
                <span className="text-slate-500 shrink-0">{label}</span>
                <span className="text-slate-800 font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Payment History</h3>
          <span className="text-xs text-slate-400 font-semibold">{payments.length} record{payments.length !== 1 ? 's' : ''}</span>
        </div>

        {paymentsWithBalance.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">No payments recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Payment ID', 'Type', 'Amount', 'Mode', 'Reference No', 'Collected By', 'Date', 'Status', 'Remaining Balance', 'Receipt', 'Actions']
                    .map((h) => (
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
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TXSTATUS_COLORS[p.transactionStatus] || 'bg-slate-100 text-slate-500'}`}>
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

      {/* Dialogs */}
      {showAddPayment && (
        <AddPaymentDialog
          booking={booking}
          onClose={() => setShowAddPayment(false)}
          onSuccess={() => { setShowAddPayment(false); fetchDetails(); }}
        />
      )}

      {showEditBooking && (
        <BookingFormModal
          showFormModal={showEditBooking}
          setShowFormModal={setShowEditBooking}
          editing={booking}
          submitting={submitting}
          onSubmit={onEditSubmit}
          availablePlots={availablePlots}
          customers={[]}
          salesExecutives={salesExecutives}
          register={register}
          handleSubmitForm={handleSubmit}
          errors={errors}
          userRole={user?.role}
          onPaymentPlanChanged={fetchDetails}
        />
      )}

      {cancelingPayment && (
        <CancelPaymentDialog
          payment={cancelingPayment}
          userRole={user?.role}
          onClose={() => setCancelingPayment(null)}
          onSuccess={() => { setCancelingPayment(null); fetchDetails(); }}
        />
      )}
    </div>
  );
}
