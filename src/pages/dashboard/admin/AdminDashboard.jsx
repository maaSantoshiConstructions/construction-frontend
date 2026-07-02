import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaProjectDiagram, FaThLarge, FaCheckCircle, FaTimesCircle, FaBookmark,
  FaRupeeSign, FaUserPlus, FaCalendarCheck
} from 'react-icons/fa';
import { getAdminDashboard } from '../../../api/dashboard';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import StatsCard from '../../../components/common/StatsCard';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getAdminDashboard();
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
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="w-11 h-11 bg-slate-200 rounded-xl mb-3 animate-pulse" />
              <div className="h-7 w-24 bg-slate-200 rounded animate-pulse mb-1" />
              <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;

  const stats = data?.stats || {};
  const monthlySales = data?.monthlySales || [];
  const recentLeads = data?.recentLeads || [];
  const recentBookings = data?.recentBookings || [];

  const chartData = {
    labels: monthlySales.map(s => s.month),
    datasets: [{
      label: 'Sales (₹)',
      data: monthlySales.map(s => s.amount),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: '#3b82f6',
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { callback: v => '₹' + (v / 1000).toFixed(0) + 'k' } },
    },
  };

  const leadColumns = [
    { key: 'name', label: 'Name', render: r => r.name || r.customer?.name || '-' },
    { key: 'phone', label: 'Phone', render: r => r.phone || r.customer?.phone || '-' },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span> },
  ];

  const bookingColumns = [
    { key: 'id', label: 'Booking ID', render: r => '#' + (r.bookingId || r._id?.slice(-6) || '') },
    { key: 'customer', label: 'Customer', render: r => r.customer?.name || '-' },
    { key: 'amount', label: 'Amount', render: r => '₹' + (r.amount?.toLocaleString() || '0') },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bookingStatusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span> },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your real estate business</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Projects" value={stats.totalProjects || 0} icon={FaProjectDiagram} color="blue" />
        <StatsCard title="Total Plots" value={stats.totalPlots || 0} icon={FaThLarge} color="indigo" />
        <StatsCard title="Available" value={stats.availablePlots || 0} icon={FaCheckCircle} color="green" />
        <StatsCard title="Sold" value={stats.soldPlots || 0} icon={FaTimesCircle} color="red" />
        <StatsCard title="Reserved" value={stats.reservedPlots || 0} icon={FaBookmark} color="yellow" />
        <StatsCard title="Revenue" value={'₹' + (stats.revenue?.toLocaleString() || '0')} icon={FaRupeeSign} color="green" />
        <StatsCard title="Leads" value={stats.totalLeads || 0} icon={FaUserPlus} color="purple" />
        <StatsCard title="Site Visits" value={stats.siteVisitsThisMonth || 0} icon={FaCalendarCheck} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Monthly Sales</h2>
          <div className="h-64">
            {monthlySales.length > 0 ? <Bar data={chartData} options={chartOptions} /> : <p className="text-slate-400 text-sm">No sales data available</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Recent Leads</h2>
            <DataTable columns={leadColumns} data={recentLeads.slice(0, 5)} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Recent Bookings</h2>
            <DataTable columns={bookingColumns} data={recentBookings.slice(0, 5)} />
          </div>
        </div>
      </div>
    </div>
  );
}

const statusColors = {
  new: 'bg-blue-100 text-blue-700', contacted: 'bg-purple-100 text-purple-700',
  interested: 'bg-amber-100 text-amber-700', site_visit_done: 'bg-indigo-100 text-indigo-700',
  negotiation: 'bg-orange-100 text-orange-700', booking_done: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700'
};

const bookingStatusColors = {
  token: 'bg-purple-100 text-purple-700', partial: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700'
};
