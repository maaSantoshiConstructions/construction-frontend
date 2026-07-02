import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaMapMarkerAlt, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import { getSalesDashboard } from '../../../api/dashboard';
import { useAuth } from '../../../context/AuthContext';
import StatsCard from '../../../components/common/StatsCard';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

const statusColors = {
  new: 'bg-orange-100 text-orange-700', contacted: 'bg-amber-100 text-amber-700',
  interested: 'bg-amber-100 text-amber-700', site_visit_done: 'bg-amber-100 text-amber-700',
  negotiation: 'bg-orange-100 text-orange-700', booking_done: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

const scoreColors = {
  Hot: 'bg-red-100 text-red-700', Warm: 'bg-amber-100 text-amber-700', Cold: 'bg-orange-100 text-orange-700',
};

export default function SalesDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getSalesDashboard();
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="w-11 h-11 bg-slate-200 rounded-xl mb-3 animate-pulse" />
              <div className="h-7 w-24 bg-slate-200 rounded animate-pulse mb-1" />
              <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;

  const stats = data?.stats || {};
  const upcomingVisits = data?.upcomingVisits || [];
  const recentLeads = data?.recentLeads || [];

  const visitColumns = [
    { key: 'customer', label: 'Customer', render: r => r.customer?.name || r.name || '-' },
    { key: 'plot', label: 'Plot', render: r => r.plot?.plotNumber || r.plotNumber || '-' },
    { key: 'date', label: 'Date', render: r => new Date(r.date || r.scheduledDate).toLocaleDateString() },
    { key: 'time', label: 'Time', render: r => r.time || r.slot || '-' },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
  ];

  const leadColumns = [
    { key: 'name', label: 'Name', render: r => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'phone', label: 'Phone', render: r => r.phone || '-' },
    { key: 'project', label: 'Project', render: r => r.project?.name || r.projectName || '-' },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
    { key: 'score', label: 'Score', render: r => r.score ? <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${scoreColors[r.score] || 'bg-slate-100 text-slate-600'}`}>{r.score}</span> : '-' },
    { key: 'followUp', label: 'Follow-up', render: r => r.nextFollowUp ? new Date(r.nextFollowUp).toLocaleDateString() : '-' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name || 'Sales Executive'}</h1>
        <p className="text-slate-500 text-sm mt-1">Here&apos;s your sales overview</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Assigned Leads" value={stats.assignedLeads || 0} icon={FaUsers} color="blue" />
        <StatsCard title="Site Visits This Week" value={stats.siteVisitsThisWeek || 0} icon={FaMapMarkerAlt} color="indigo" />
        <StatsCard title="Upcoming Visits" value={stats.upcomingVisits || 0} icon={FaCalendarCheck} color="purple" />
        <StatsCard title="Conversion Rate" value={(stats.conversionRate || 0) + '%'} icon={FaChartLine} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-800">Upcoming Visits (Next 7 Days)</h2>
            <span className="text-xs text-slate-400">{upcomingVisits.length} visits</span>
          </div>
          {upcomingVisits.length > 0 ? (
            <DataTable columns={visitColumns} data={upcomingVisits.slice(0, 5)} />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-400">
              No upcoming visits scheduled
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-800">Recent Leads</h2>
            <span className="text-xs text-slate-400">{recentLeads.length} leads</span>
          </div>
          {recentLeads.length > 0 ? (
            <DataTable columns={leadColumns} data={recentLeads.slice(0, 5)} />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-400">
              No leads assigned yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
