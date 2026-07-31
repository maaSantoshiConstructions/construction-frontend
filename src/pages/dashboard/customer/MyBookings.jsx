import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaEye, FaBuilding, FaMapMarkerAlt, FaRulerCombined, FaTag,
} from 'react-icons/fa';
import { getMyBookings } from '../../../api/bookings';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { getAssetUrl } from '../../../config';

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

const PAYMENT_STATUS_LABELS = {
  token_paid:     'Token Paid',
  partially_paid: 'Partially Paid',
  fully_paid:     'Fully Paid',
  refunded:       'Refunded',
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

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getMyBookings();
      setBookings(res?.data || res || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBookings} />;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Overview of your booked properties and financial status</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <FaBuilding className="text-slate-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No Bookings Found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
            You haven't booked any plots yet. Explore our projects to book your dream property.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((b, i) => {
            const totalAmt = b.totalAmount || b.amount || 0;
            const paidAmt = b.paidAmount || 0;
            const remAmt = b.remainingAmount ?? Math.max(0, totalAmt - paidAmt);
            const progressPercent = totalAmt > 0 ? Math.min(100, Math.round((paidAmt / totalAmt) * 100)) : 0;
            const ratePerSqYd = b.plot?.ratePerSqYd || b.ratePerSqYd;

            return (
              <motion.div
                key={b._id || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">

                  {/* Left: Plot Thumbnail */}
                  <div className="lg:w-56 h-48 lg:h-auto bg-slate-100 relative shrink-0 overflow-hidden">
                    {b.plot?.images?.[0] ? (
                      <img
                        src={getAssetUrl(b.plot.images[0])}
                        alt={`Plot #${b.plot?.plotNumber}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 p-4 text-center">
                        <FaBuilding className="text-4xl mb-2 text-slate-300" />
                        <span className="text-xs font-semibold text-slate-400">
                          Plot #{b.plot?.plotNumber || b.plotNumber}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                      #{b.bookingId || b._id?.slice(-6)}
                    </div>
                  </div>

                  {/* Right: Detailed Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-5">

                    {/* Top Row: Title & Badges */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {b.project?.name || b.projectName || 'Project Property'} &nbsp;·&nbsp;
                          <span className="text-amber-700">Plot #{b.plot?.plotNumber || b.plotNumber || '—'}</span>
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <FaMapMarkerAlt className="text-amber-500 shrink-0" />
                          {getLocationString(b.project?.location || b.location)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Booking Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${BOOKING_STATUS_COLORS[b.bookingStatus || b.status] || 'bg-slate-100 text-slate-600'}`}>
                          {b.bookingStatus || b.status || 'Active'}
                        </span>
                        {/* Payment Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${PAYMENT_STATUS_COLORS[b.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
                          {PAYMENT_STATUS_LABELS[b.paymentStatus] || b.paymentStatus?.replace(/_/g, ' ') || 'Token Paid'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Financial Summary & Metadata */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">

                      {/* Total Amount */}
                      <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Total Amount</span>
                        <p className="text-base font-bold text-slate-800">₹{fmt(totalAmt)}</p>
                      </div>

                      {/* Paid Amount */}
                      <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Paid Amount</span>
                        <p className="text-base font-bold text-emerald-600">₹{fmt(paidAmt)}</p>
                      </div>

                      {/* Remaining Amount */}
                      <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Remaining</span>
                        <p className="text-base font-bold text-orange-600">₹{fmt(remAmt)}</p>
                      </div>

                      {/* Booking Date */}
                      <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Booking Date</span>
                        <p className="text-sm font-semibold text-slate-700">{fmtDate(b.bookingDate || b.createdAt)}</p>
                      </div>

                    </div>

                    {/* Plot Details: Size & Rate (only show rate if > 0) */}
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                      {b.plot?.size && (
                        <div className="flex items-center gap-1.5">
                          <FaRulerCombined className="text-slate-400" />
                          <span>Plot Size: <strong className="text-slate-700">{b.plot.size} sq.yd</strong></span>
                        </div>
                      )}
                      {ratePerSqYd && Number(ratePerSqYd) > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <FaTag className="text-slate-400" />
                          <span>Rate: <strong className="text-slate-700">₹{fmt(Number(ratePerSqYd))} / sq.yd</strong></span>
                        </div>
                      ) : null}
                    </div>

                    {/* Payment Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                        <span className="text-slate-500">Payment Progress</span>
                        <span className="text-slate-700 font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-700"
                          style={{
                            width: `${progressPercent}%`,
                            backgroundColor:
                              progressPercent >= 100 ? '#10b981' :
                              progressPercent >= 50  ? '#22c55e' :
                              progressPercent >= 25  ? '#f97316' : '#ef4444',
                          }}
                        />
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-1.5 text-right">
                        <span className="text-emerald-700 font-bold">₹{fmt(paidAmt)}</span> of <span className="text-slate-800 font-bold">₹{fmt(totalAmt)}</span> Paid
                      </p>
                    </div>

                    {/* Action Button: View Details -> Navigates to /customer/bookings/:id */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => navigate(`/customer/bookings/${b._id}`)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20 hover:-translate-y-0.5"
                      >
                        <FaEye /> View Details
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
