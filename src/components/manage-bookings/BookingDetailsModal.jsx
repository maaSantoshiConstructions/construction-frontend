import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const statusColors = {
  token: 'bg-amber-100 text-amber-700',
  partial: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BookingDetailsModal({ viewBooking, setViewBooking }) {
  if (!viewBooking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Booking Details</h2>
          <button onClick={() => setViewBooking(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700">
            <FaTimes />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Booking ID:</span>
              <p className="font-semibold text-slate-800">#{viewBooking.bookingId || viewBooking._id?.slice(-6)}</p>
            </div>
            <div>
              <span className="text-slate-500">Status:</span>
              <p className="mt-0.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[viewBooking.status] || ''}`}>
                  {viewBooking.status}
                </span>
              </p>
            </div>
            <div>
              <span className="text-slate-500">Customer:</span>
              <p className="font-medium text-slate-800">{viewBooking.customer?.name || '-'}</p>
            </div>
            <div>
              <span className="text-slate-500">Email:</span>
              <p className="text-slate-700">{viewBooking.customer?.email || '-'}</p>
            </div>
            <div>
              <span className="text-slate-500">Phone:</span>
              <p className="text-slate-700">{viewBooking.customer?.phone || '-'}</p>
            </div>
            <div>
              <span className="text-slate-500">Plot #:</span>
              <p className="font-semibold text-slate-900">{viewBooking.plot?.plotNumber ? `#${viewBooking.plot.plotNumber}` : '-'}</p>
            </div>
            <div>
              <span className="text-slate-500">Project:</span>
              <p className="text-slate-700">{viewBooking.project?.name || viewBooking.plot?.project?.name || '-'}</p>
            </div>
            <div>
              <span className="text-slate-500">Total Amount:</span>
              <p className="font-bold text-indigo-700">₹{(viewBooking.totalAmount || viewBooking.amount || 0).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-slate-500">Token Amount:</span>
              <p className="font-semibold text-slate-800">₹{(viewBooking.tokenAmount || 0).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-slate-500">Payment Plan:</span>
              <p className="capitalize text-slate-700">{viewBooking.paymentPlan?.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <span className="text-slate-500">Date:</span>
              <p className="text-slate-700">{viewBooking.createdAt ? new Date(viewBooking.createdAt).toLocaleDateString() : '-'}</p>
            </div>
            {viewBooking.salesExecutive && (
              <div>
                <span className="text-slate-500">Sales Executive:</span>
                <p className="text-slate-700">{viewBooking.salesExecutive.name}</p>
              </div>
            )}
          </div>

          {viewBooking.remarks && (
            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-500 text-sm">Remarks:</span>
              <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{viewBooking.remarks}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
