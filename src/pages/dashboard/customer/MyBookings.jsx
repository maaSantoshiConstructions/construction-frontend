import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaRupeeSign, FaFileDownload, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import { getMyBookings } from '../../../api/bookings';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';

const bookingStatusColors = {
  token: 'bg-amber-100 text-amber-700',
  partial: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const paymentStatusColors = {
  pending: 'bg-amber-100 text-amber-700',
  partial: 'bg-orange-100 text-orange-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getMyBookings();
      setBookings(res?.data || res || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBookings} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
        <p className="text-slate-500 text-sm">Properties you have booked</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FaBuilding className="text-slate-300 text-4xl mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No bookings yet</p>
          <p className="text-slate-400 text-sm mt-1">Browse properties and book your dream plot</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b, i) => (
            <motion.div
              key={b._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-40 bg-slate-200 flex items-center justify-center flex-shrink-0">
                  {b.plot?.images?.[0] ? (
                    <img src={b.plot.images[0]} alt={b.plot.plotNumber} className="w-full h-full object-cover" />
                  ) : (
                    <FaBuilding className="text-slate-400 text-3xl" />
                  )}
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {b.project?.name || b.projectName} - Plot {b.plot?.plotNumber || b.plotNumber}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <FaMapMarkerAlt className="text-xs" /> {b.project?.location || b.location || '-'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bookingStatusColors[b.status] || 'bg-slate-100 text-slate-600'}`}>
                      {b.status?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-slate-400 text-xs">Total Amount</p>
                      <p className="font-semibold text-slate-800">₹{(b.totalAmount || b.amount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Paid</p>
                      <p className="font-semibold text-green-600">₹{(b.paidAmount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Payment Status</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[b.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
                        {b.paymentStatus || b.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Plot Size</p>
                      <p className="font-medium text-slate-800">{b.plot?.size || b.plotSize || '-'} sq.yd</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Rate per sq.yd</p>
                      <p className="font-medium text-slate-800">₹{(b.plot?.ratePerSqYd || b.ratePerSqYd || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Booking Date</p>
                      <p className="font-medium text-slate-800">{new Date(b.createdAt || b.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-1">Payment Progress</p>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all"
                        style={{ width: Math.min(100, ((b.paidAmount || 0) / (b.totalAmount || b.amount || 1)) * 100) + '%' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-medium transition-colors">
                      <FaEye /> View Details
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors">
                      <FaRupeeSign /> Make Payment
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-medium transition-colors">
                      <FaFileDownload /> Download Agreement
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
