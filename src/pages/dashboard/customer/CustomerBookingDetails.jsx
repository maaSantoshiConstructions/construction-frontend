import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft, FaHistory, FaMapMarkerAlt, FaFileInvoice, FaBuilding,
  FaCheckCircle, FaRulerCombined, FaCalendarAlt, FaCalendarCheck, FaFolder, FaHardHat,
} from 'react-icons/fa';
import { getBookingDetails } from '../../../api/bookings';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';

const BOOKING_STATUS_COLORS = {
  active:    'bg-sky-100 text-sky-700 border border-sky-200',
  completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

const PAYMENT_STATUS_COLORS = {
  token_paid:     'bg-amber-100 text-amber-700 border border-amber-200',
  partially_paid: 'bg-orange-100 text-orange-700 border border-orange-200',
  fully_paid:     'bg-emerald-100 text-emerald-700 border border-emerald-200',
  refunded:       'bg-violet-100 text-violet-700 border border-violet-200',
};

const PLAN_LABELS = {
  full_payment: 'Full Payment',
  installment:  'Installment Plan',
  loan:         'Bank Loan',
};

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-IN') : '—');
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

const getLocationString = (loc) => {
  if (!loc) return '—';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') {
    const parts = [loc.address, loc.city, loc.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '—';
  }
  return '—';
};

export default function CustomerBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  if (loading) return <Loader />;
  if (error || !details) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/customer/bookings')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to My Bookings
        </button>
        <ErrorMessage message={error || 'Booking details not found'} onRetry={fetchDetails} />
      </div>
    );
  }

  const { booking, paymentSummary, payments } = details;
  const successfulPayments = (payments || []).filter((p) => p.transactionStatus === 'success');
  const totalAmt = paymentSummary?.totalAmount || booking.totalAmount || 0;
  const paidAmt = paymentSummary?.paidAmount || booking.paidAmount || 0;
  const remAmt = paymentSummary?.remainingAmount ?? Math.max(0, totalAmt - paidAmt);
  const progressPercent = paymentSummary?.progressPercent || (totalAmt > 0 ? Math.min(100, Math.round((paidAmt / totalAmt) * 100)) : 0);

  // Read-only Timeline Milestones
  const timelineMilestones = [
    {
      title: 'Booking Created',
      desc: `Plot #${booking.plot?.plotNumber} booked on ${fmtDate(booking.bookingDate || booking.createdAt)}`,
      completed: true,
      date: fmtDate(booking.bookingDate || booking.createdAt),
    },
    {
      title: 'Token Payment',
      desc: booking.tokenAmount > 0 ? `Token amount of ₹${fmt(booking.tokenAmount)} received` : 'Token payment pending',
      completed: (booking.paidAmount || 0) > 0,
      date: booking.tokenAmount > 0 ? fmtDate(booking.createdAt) : null,
    },
    {
      title: 'Installments & Payments',
      desc: `${successfulPayments.length} payment(s) recorded (${progressPercent}% completed)`,
      completed: progressPercent > 0,
      date: paymentSummary.lastPaymentDate ? fmtDate(paymentSummary.lastPaymentDate) : null,
    },
    {
      title: 'Completion & Possession',
      desc: booking.bookingStatus === 'completed' ? 'Booking completed & handed over' : 'Pending final payment & paperwork',
      completed: booking.bookingStatus === 'completed',
      date: booking.bookingStatus === 'completed' ? 'Completed' : null,
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="p-2.5 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition-colors shadow-xs"
          >
            <FaArrowLeft />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-800">
                Booking <span className="font-mono text-amber-700">#{booking.bookingId || booking._id?.slice(-6)}</span>
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${BOOKING_STATUS_COLORS[booking.bookingStatus] || 'bg-slate-100 text-slate-600'}`}>
                {booking.bookingStatus || 'Active'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${PAYMENT_STATUS_COLORS[booking.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
                {booking.paymentStatus?.replace(/_/g, ' ') || 'Token Paid'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Booked on {fmtDate(booking.bookingDate || booking.createdAt)}</p>
          </div>
        </div>

        {/* SECTION 4: Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customer/payments')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5 transition-all"
          >
            <FaHistory /> View Payment History
          </button>
        </div>
      </div>

      {/* SECTION 3: Financial Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {/* Total Amount */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Amount</span>
          <p className="text-xl font-bold text-slate-800">₹{fmt(totalAmt)}</p>
          <span className="text-xs text-slate-400 mt-1 block font-medium">Agreed Property Value</span>
        </div>

        {/* Paid Amount (Highlighted Success) */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Paid Amount</span>
          <p className="text-xl font-extrabold text-emerald-600">₹{fmt(paidAmt)}</p>
          <span className="text-xs text-emerald-700 mt-1 block font-medium">Total Received</span>
        </div>

        {/* Remaining Amount (Highlighted Warning) */}
        <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-orange-800 uppercase tracking-wider block mb-1">Remaining</span>
          <p className="text-xl font-extrabold text-orange-600">₹{fmt(remAmt)}</p>
          <span className="text-xs text-orange-700 mt-1 block font-medium">Outstanding Balance</span>
        </div>

        {/* Successful Payments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Last Payment</span>
          <p className="text-base font-bold text-slate-800">{fmtDate(paymentSummary.lastPaymentDate)}</p>
          <span className="text-xs text-slate-500 mt-1 block font-medium">{successfulPayments.length} Successful Payment(s)</span>
        </div>

      </div>

      {/* Progress Bar Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center text-xs font-semibold mb-2">
          <span className="text-slate-600 font-bold uppercase tracking-wider">Payment Progress</span>
          <span className="text-amber-700 font-bold text-sm">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{
              width: `${progressPercent}%`,
              backgroundColor:
                progressPercent >= 100 ? '#10b981' :
                progressPercent >= 50  ? '#22c55e' :
                progressPercent >= 25  ? '#f97316' : '#ef4444',
            }}
          />
        </div>
        <p className="text-xs font-medium text-slate-500 mt-2 text-right">
          <span className="text-emerald-700 font-bold">₹{fmt(paidAmt)}</span> of <span className="text-slate-800 font-bold">₹{fmt(totalAmt)}</span> Paid
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* SECTION 1: Booking Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <FaFileInvoice />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Booking Information</h3>
          </div>

          <div className="space-y-3 text-sm">
            {[
              ['Booking ID', `#${booking.bookingId || booking._id?.slice(-6)}`],
              ['Booking Date', fmtDate(booking.bookingDate || booking.createdAt)],
              ['Booking Status', booking.bookingStatus || 'Active'],
              ['Payment Status', booking.paymentStatus?.replace(/_/g, ' ') || 'Token Paid'],
              ['Payment Plan', PLAN_LABELS[booking.paymentPlan] || booking.paymentPlan || '—'],
              ['Token Amount', `₹${fmt(booking.tokenAmount)}`],
              ['Sales Executive', booking.salesExecutive?.name || '—'],
              ['Remarks', booking.remarks || '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 py-1 border-b border-slate-50 last:border-0">
                <span className="text-slate-500 shrink-0">{label}</span>
                <span className="text-slate-800 font-semibold text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Property Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <FaBuilding />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Property Information</h3>
          </div>

          <div className="space-y-3 text-sm">
            {[
              ['Project Name', booking.project?.name || '—'],
              ['Plot Number', booking.plot?.plotNumber ? `Plot #${booking.plot.plotNumber}` : '—'],
              ['Plot Size', booking.plot?.size ? `${booking.plot.size} sq.yd` : '—'],
              ['Facing', booking.plot?.facing || '—'],
              ['Road Width', booking.plot?.roadWidth ? `${booking.plot.roadWidth} ft` : '—'],
              ['Location', getLocationString(booking.project?.location)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 py-1 border-b border-slate-50 last:border-0">
                <span className="text-slate-500 shrink-0">{label}</span>
                <span className="text-slate-800 font-semibold text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 5: Read-Only Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">
          Booking Timeline & Milestones
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative pt-2">
          {timelineMilestones.map((m, idx) => (
            <div key={m.title} className="flex flex-col space-y-2 relative">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${m.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {m.completed ? <FaCheckCircle /> : idx + 1}
                </div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{m.title}</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-9">{m.desc}</p>
              {m.date && <span className="text-xs text-amber-700 font-semibold pl-9">{m.date}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: Future Ready Modular Tabs Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
          <h3 className="font-bold text-slate-800 text-base">Additional Documents & Updates</h3>
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'agreement', label: 'Agreement' },
              { id: 'documents', label: 'Documents' },
              { id: 'construction', label: 'Construction Updates' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === t.id
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="text-xs text-slate-500 leading-relaxed">
            All primary details and payment records for this booking are displayed above. Use the tabs to preview upcoming module sections.
          </div>
        )}

        {activeTab === 'agreement' && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <FaFileInvoice className="text-3xl text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Agreement Module Coming Soon</h4>
            <p className="text-xs text-slate-400">Signed plot booking agreements and legal contracts will appear here once uploaded.</p>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <FaFolder className="text-3xl text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Document Repository Coming Soon</h4>
            <p className="text-xs text-slate-400">Plot layout approvals, possession certificates, and NOCs will be stored here.</p>
          </div>
        )}

        {activeTab === 'construction' && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <FaHardHat className="text-3xl text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Construction Updates</h4>
            <p className="text-xs text-slate-400">Layout road development, electricity, and water line progress updates for this project.</p>
          </div>
        )}
      </div>

    </div>
  );
}
