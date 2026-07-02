import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaCalendarCheck, FaHandHoldingUsd, FaBell, FaHardHat, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { getCustomerDashboard } from '../../../api/dashboard';
import { useAuth } from '../../../context/AuthContext';
import StatsCard from '../../../components/common/StatsCard';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getCustomerDashboard();
      setData(res?.data || res);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="w-11 h-11 bg-slate-200 rounded-xl mb-3 animate-pulse" />
              <div className="h-7 w-24 bg-slate-200 rounded animate-pulse mb-1" />
              <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        <div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;

  const stats = data?.stats || {};
  const updates = data?.recentUpdates || [];
  const notifications = data?.recentNotifications || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name || 'Customer'}!</h1>
        <p className="text-slate-500 text-sm mt-1">Here&apos;s an overview of your account</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard title="My Properties" value={stats.myProperties || stats.totalBookings || 0} icon={FaBuilding} color="blue" />
        <StatsCard title="Upcoming Payments" value={'₹' + ((stats.upcomingPayments || 0).toLocaleString())} icon={FaCalendarCheck} color="yellow" />
        <StatsCard title="Referral Earnings" value={'₹' + ((stats.referralEarnings || 0).toLocaleString())} icon={FaHandHoldingUsd} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaHardHat className="text-amber-500" /> Recent Construction Updates
          </h2>
          {updates.length > 0 ? (
            <div className="space-y-2">
              {updates.slice(0, 4).map((u, i) => (
                <motion.div
                  key={u._id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FaHardHat className="text-blue-600 text-xs" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{u.title || 'Update'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{u.plot?.plotNumber || u.project?.name} &middot; {new Date(u.createdAt || u.date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-400">
              No construction updates yet
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FaBell className="text-blue-500" /> Recent Notifications
          </h2>
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.slice(0, 4).map((n, i) => (
                <motion.div
                  key={n._id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.read ? 'bg-slate-100' : 'bg-blue-100'}`}>
                    <FaBell className={`text-xs ${n.read ? 'text-slate-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-800">{n.message || n.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-400">
              No notifications yet
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/customer/bookings" className="bg-white rounded-2xl border border-slate-200 p-4 text-center hover:shadow-sm transition-shadow">
            <FaBuilding className="text-blue-600 text-xl mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">View Properties</span>
          </Link>
          <Link to="/customer/payments" className="bg-white rounded-2xl border border-slate-200 p-4 text-center hover:shadow-sm transition-shadow">
            <FaCalendarCheck className="text-green-600 text-xl mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">Make Payment</span>
          </Link>
          <Link to="/customer/construction-updates" className="bg-white rounded-2xl border border-slate-200 p-4 text-center hover:shadow-sm transition-shadow">
            <FaHardHat className="text-amber-600 text-xl mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">Track Construction</span>
          </Link>
          <a href="/book-visit" className="bg-white rounded-2xl border border-slate-200 p-4 text-center hover:shadow-sm transition-shadow">
            <FaMapMarkerAlt className="text-purple-600 text-xl mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">Book a Visit</span>
          </a>
        </div>
      </div>
    </div>
  );
}
