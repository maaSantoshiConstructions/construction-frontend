import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../../../api/dashboard';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ErrorMessage from '../../../components/common/ErrorMessage';
import {
  LuBuilding2,
  LuMap,
  LuCircleCheck,
  LuCircleX,
  LuLock,
  LuIndianRupee,
  LuTrendingUp,
  LuMapPin,
} from 'react-icons/lu';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const statCards = [
  { key: 'totalProjects', label: 'Projects', ic: LuBuilding2, iconBg: 'bg-green-50 text-green-800', textClass: 'text-green-800' },
  { key: 'totalPlots', label: 'Total Plots', ic: LuMap, iconBg: 'bg-purple-50 text-purple-700', textClass: 'text-purple-700' },
  { key: 'availablePlots', label: 'Available', ic: LuCircleCheck, iconBg: 'bg-emerald-50 text-emerald-700', textClass: 'text-emerald-700' },
  { key: 'soldPlots', label: 'Sold', ic: LuCircleX, iconBg: 'bg-rose-50 text-rose-700', textClass: 'text-rose-700' },
  { key: 'reservedPlots', label: 'Reserved', ic: LuLock, iconBg: 'bg-amber-50 text-amber-700', textClass: 'text-amber-700' },
  { key: 'revenue', label: 'Revenue', ic: LuIndianRupee, iconBg: 'bg-emerald-50 text-emerald-700', textClass: 'text-emerald-700', money: true },
  { key: 'totalLeads', label: 'Leads', ic: LuTrendingUp, iconBg: 'bg-green-50 text-green-800', textClass: 'text-green-800' },
  { key: 'siteVisitsThisMonth', label: 'Site Visits', ic: LuMapPin, iconBg: 'bg-sky-50 text-sky-700', textClass: 'text-sky-700' },
];

const leadStatusStyle = {
  new: 'bg-green-50 text-green-800 border-green-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  interested: 'bg-purple-50 text-purple-700 border-purple-200',
  booking_done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  lost: 'bg-rose-50 text-rose-700 border-rose-200',
};

const bookingStatusStyle = {
  token: 'bg-amber-50 text-amber-700 border-amber-200',
  partial: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

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

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-48 bg-slate-200 rounded-md mb-2 animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="w-10 h-10 bg-slate-100 rounded-xl mb-3 animate-pulse" />
              <div className="h-6 w-16 bg-slate-200 rounded mb-1.5 animate-pulse" />
              <div className="h-3.5 w-20 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );

  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;

  const stats = data || {};
  const monthlySales = data?.monthlySales || [];
  const recentLeads = data?.recentLeads || [];
  const recentBookings = data?.recentBookings || [];

  const chartData = {
    labels: monthlySales.map((s) => s.month),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: monthlySales.map((s) => s.amount),
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderColor: '#4f46e5',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => '₹' + (v / 1000).toFixed(0) + 'k' },
      },
    },
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1 className="font-['Poppins',sans-serif] text-2xl sm:text-2xl font-extrabold text-slate-900 mb-1">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">Overview of your real estate business</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ key, label, ic: IconComponent, iconBg, textClass, money }) => (
          <div
            key={key}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${iconBg}`}
            >
              {IconComponent && <IconComponent />}
            </div>
            <div
              className={`font-['Poppins',sans-serif] text-xl sm:text-2xl font-extrabold leading-none ${textClass}`}
            >
              {money ? '₹' + ((stats[key] || 0) / 100000).toFixed(1) + 'L' : stats[key] || 0}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <h2 className="font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-slate-900 mb-4">
            Monthly Revenue
          </h2>
          <div className="h-60">
            {monthlySales.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p className="text-slate-400 text-xs sm:text-sm pt-20 text-center">
                No sales data yet
              </p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <h2 className="font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-slate-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-2.5">
            {[
              { label: '+ Add New Project', path: '/admin/projects' },
              { label: '+ Add Construction Update', path: '/admin/construction-updates' },
              { label: '+ Add Plot', path: '/admin/plots' },
              { label: '+ Record Payment', path: '/admin/payments' },
              { label: '→ View All Leads', path: '/admin/leads' },
            ].map((a) => (
              <Link
                key={a.path}
                to={a.path}
                className="flex items-center px-4 py-3 rounded-xl border border-green-100 bg-green-50/50 hover:bg-green-50 text-green-800 text-xs font-bold no-underline transition-colors"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-slate-900">
              Recent Leads
            </h2>
            <Link
              to="/admin/leads"
              className="text-xs font-bold text-green-700 hover:text-green-800 no-underline transition-colors"
            >
              View all →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-slate-400 text-xs text-center py-6">No leads yet</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeads.slice(0, 5).map((lead, i) => {
                const badgeStyle =
                  leadStatusStyle[lead.status] || 'bg-green-50 text-green-800 border-green-200';
                return (
                  <div key={i} className="flex justify-between items-center py-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {lead.name || lead.customer?.name || '-'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {lead.phone || lead.customer?.phone || '-'}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md border capitalize ${badgeStyle}`}
                    >
                      {lead.status?.replace(/_/g, ' ') || '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-slate-900">
              Recent Bookings
            </h2>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-green-700 hover:text-green-800 no-underline transition-colors"
            >
              View all →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-slate-400 text-xs text-center py-6">No bookings yet</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentBookings.slice(0, 5).map((b, i) => {
                const badgeStyle =
                  bookingStatusStyle[b.status] || 'bg-green-50 text-green-800 border-green-200';
                return (
                  <div key={i} className="flex justify-between items-center py-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        #{b.bookingId || b._id?.slice(-6)}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {b.customer?.name || b.name || '-'} · ₹
                        {(b.totalAmount || b.amount || b.paidAmount || 0).toLocaleString()}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md border capitalize ${badgeStyle}`}
                    >
                      {b.status || '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
