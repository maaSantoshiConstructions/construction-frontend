import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

import { BOOKING_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '../../constants/statusStyles';

export default function BookingDetailsModal({ viewBooking, setViewBooking }) {
  const navigate = useNavigate();
  if (!viewBooking) return null;

  const progressPercent = viewBooking.totalAmount > 0
    ? Math.min(100, Math.round(((viewBooking.paidAmount || 0) / viewBooking.totalAmount) * 100))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Booking Preview</h2>
            <p className="text-xs text-slate-400 font-mono">#{viewBooking.bookingId || viewBooking._id?.slice(-6)}</p>
          </div>
          <button
            onClick={() => setViewBooking(null)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Quick summary */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Customer</span>
              <p className="font-semibold text-slate-800">{viewBooking.customer?.name || '—'}</p>
            </div>
            <div>
              <span className="text-slate-500">Plot #</span>
              <p className="font-semibold text-slate-800">{viewBooking.plot?.plotNumber ? `#${viewBooking.plot.plotNumber}` : '—'}</p>
            </div>
            <div>
              <span className="text-slate-500">Total Amount</span>
              <p className="font-bold text-green-700">₹{(viewBooking.totalAmount || 0).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-slate-500">Paid Amount</span>
              <p className="font-bold text-emerald-700">₹{(viewBooking.paidAmount || 0).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-slate-500">Booking Status</span>
              <p><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BOOKING_STATUS_COLORS[viewBooking.bookingStatus] || 'bg-slate-100 text-slate-600'}`}>{viewBooking.bookingStatus || '—'}</span></p>
            </div>
            <div>
              <span className="text-slate-500">Payment Status</span>
              <p><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[viewBooking.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>{viewBooking.paymentStatus?.replace(/_/g, ' ') || '—'}</span></p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Payment Progress</span>
              <span className="font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: progressPercent >= 75 ? '#10b981' : progressPercent >= 25 ? '#f97316' : '#ef4444',
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer — navigate to full page */}
        <div className="px-5 pb-5">
          <button
            onClick={() => {
              setViewBooking(null);
              navigate(`/admin/bookings/${viewBooking._id}`);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5 transition-all"
          >
            <FaExternalLinkAlt className="text-xs" />
            View Full Details
          </button>
        </div>
      </motion.div>
    </div>
  );
}
