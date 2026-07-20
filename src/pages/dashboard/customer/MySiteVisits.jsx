import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaMapPin, FaUser } from 'react-icons/fa';
import { getMyVisits } from '../../../api/siteVisits';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';

const visitStatusColors = {
  pending: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-700',
  rescheduled: 'bg-blue-100 text-blue-700',
};

export default function MySiteVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVisits = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getMyVisits();
      setVisits(res?.data || res || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load site visits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchVisits} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Site Visits</h1>
          <p className="text-slate-500 text-sm">History and status of your scheduled property visits</p>
        </div>
        <Link
          to="/book-visit"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          📍 Schedule Visit
        </Link>
      </div>

      {visits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FaMapPin className="text-slate-300 text-4xl mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No site visits scheduled yet</p>
          <p className="text-slate-400 text-sm mt-1 mb-6">Schedule a free site visit to see your dream plots in person</p>
          <Link
            to="/book-visit"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Schedule a Visit Now
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {visits.map((v, i) => (
            <motion.div
              key={v._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-800 font-poppins">
                      {v.project?.name || 'Jai Santoshi Maa Site Visit'}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${v.visitType === 'vr' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {v.visitType === 'vr' ? 'VR Visit' : 'Physical Visit'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${visitStatusColors[v.status] || 'bg-slate-100 text-slate-600'}`}>
                      {v.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-slate-400" />
                      <span>
                        {v.preferredDate ? new Date(v.preferredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-slate-400" />
                      <span>{v.preferredTime || 'Scheduled Slot'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-slate-400" />
                      <span>
                        {v.visitType === 'vr' ? 'Virtual Reality Tour (Online)' : `Pickup: ${v.pickupLocation || 'Directly at site'}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 flex-shrink-0">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <FaUser className="text-slate-400 text-sm" />
                    <div>
                      <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Assigned Executive</p>
                      <p className="text-slate-700 text-sm font-semibold">
                        {v.salesExecutive?.name || 'Assigning soon...'}
                      </p>
                    </div>
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
