import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAdminDashboard } from '../../../api/dashboard';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ErrorMessage from '../../../components/common/ErrorMessage';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const statCards = [
  { key: 'totalProjects',      label: 'Projects',        ic: '🏗', color: '#3a2fb8' },
  { key: 'totalPlots',         label: 'Total Plots',     ic: '▤',  color: '#5b4fe0' },
  { key: 'availablePlots',     label: 'Available',       ic: '✅', color: '#2f9e5c' },
  { key: 'soldPlots',          label: 'Sold',            ic: '🔴', color: '#c0392b' },
  { key: 'reservedPlots',      label: 'Reserved',        ic: '🔒', color: '#d99f36' },
  { key: 'revenue',            label: 'Revenue',         ic: '₹',  color: '#2f9e5c', money: true },
  { key: 'totalLeads',         label: 'Leads',           ic: '📈', color: '#7a3fd6' },
  { key: 'siteVisitsThisMonth',label: 'Site Visits',     ic: '📍', color: '#3a2fb8' },
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true); setError(null);
    try {
      const { data: res } = await getAdminDashboard();
      setData(res?.data || res);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ height: '28px', width: '200px', background: '#e6e6f0', borderRadius: '6px', marginBottom: '8px' }} className="pulse-skeleton" />
        <div style={{ height: '16px', width: '280px', background: '#f0f0f6', borderRadius: '6px' }} className="pulse-skeleton" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e6e6f0', padding: '20px' }}>
            <div style={{ width: '40px', height: '40px', background: '#f0f0f6', borderRadius: '10px', marginBottom: '12px' }} className="pulse-skeleton" />
            <div style={{ height: '24px', width: '70px', background: '#e6e6f0', borderRadius: '4px', marginBottom: '6px' }} className="pulse-skeleton" />
            <div style={{ height: '14px', width: '90px', background: '#f0f0f6', borderRadius: '4px' }} className="pulse-skeleton" />
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}.pulse-skeleton{animation:pulse 1.5s ease-in-out infinite}`}</style>
    </div>
  );

  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;

  const stats = data || {};
  const monthlySales = data?.monthlySales || [];
  const recentLeads = data?.recentLeads || [];
  const recentBookings = data?.recentBookings || [];

  const chartData = {
    labels: monthlySales.map(s => s.month),
    datasets: [{
      label: 'Revenue (₹)',
      data: monthlySales.map(s => s.amount),
      backgroundColor: 'rgba(58,47,184,.7)',
      borderColor: '#3a2fb8',
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { callback: v => '₹' + (v / 1000).toFixed(0) + 'k' } } },
  };

  const leadStatusColor = { new: '#3a2fb8', contacted: '#d99f36', interested: '#5b4fe0', booking_done: '#2f9e5c', lost: '#c0392b' };
  const bookingStatusColor = { token: '#d99f36', partial: '#5b4fe0', completed: '#2f9e5c', cancelled: '#c0392b' };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '24px', fontWeight: 800, color: '#171a35', marginBottom: '4px' }}>Admin Dashboard</h1>
        <p style={{ color: '#6b6f8a', fontSize: '14px' }}>Overview of your real estate business</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
        {statCards.map(({ key, label, ic, color, money }) => (
          <div key={key} style={{
            background: '#fff', borderRadius: '14px',
            border: '1px solid #e6e6f0', padding: '20px',
            boxShadow: '0 2px 10px rgba(20,20,60,.05)',
            transition: '.2s',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>
              {ic}
            </div>
            <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: '22px', fontWeight: 800, color: color, lineHeight: 1 }}>
              {money ? '₹' + ((stats[key] || 0) / 100000).toFixed(1) + 'L' : (stats[key] || 0)}
            </div>
            <div style={{ fontSize: '12px', color: '#6b6f8a', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Bar chart */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e6e6f0', padding: '22px', boxShadow: '0 2px 10px rgba(20,20,60,.05)' }}>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '16px', fontWeight: 700, color: '#171a35', marginBottom: '18px' }}>Monthly Revenue</h2>
          <div style={{ height: '240px' }}>
            {monthlySales.length > 0
              ? <Bar data={chartData} options={chartOptions} />
              : <p style={{ color: '#9ea1c4', fontSize: '14px', paddingTop: '80px', textAlign: 'center' }}>No sales data yet</p>
            }
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e6e6f0', padding: '22px', boxShadow: '0 2px 10px rgba(20,20,60,.05)' }}>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '16px', fontWeight: 700, color: '#171a35', marginBottom: '16px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: '+ Add New Project',          path: '/admin/projects',             color: '#3a2fb8' },
              { label: '+ Add Construction Update',  path: '/admin/construction-updates', color: '#5b4fe0' },
              { label: '+ Add Plot',                 path: '/admin/plots',                color: '#2f9e5c' },
              { label: '+ Record Payment',           path: '/admin/payments',             color: '#d99f36' },
              { label: '→ View All Leads',           path: '/admin/leads',                color: '#7a3fd6' },
            ].map(a => (
              <Link key={a.path} to={a.path}
                style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${a.color}30`, background: a.color + '08', color: a.color, fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: '.15s' }}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads + Bookings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Leads */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e6e6f0', padding: '22px', boxShadow: '0 2px 10px rgba(20,20,60,.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '16px', fontWeight: 700, color: '#171a35' }}>Recent Leads</h2>
            <Link to="/admin/leads" style={{ fontSize: '12px', color: '#3a2fb8', fontWeight: 600 }}>View all →</Link>
          </div>
          {recentLeads.length === 0
            ? <p style={{ color: '#9ea1c4', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No leads yet</p>
            : recentLeads.slice(0, 5).map((lead, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid #f0f0f6' : 'none' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#171a35' }}>{lead.name || lead.customer?.name || '-'}</div>
                  <div style={{ fontSize: '11.5px', color: '#6b6f8a' }}>{lead.phone || lead.customer?.phone || '-'}</div>
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: (leadStatusColor[lead.status] || '#3a2fb8') + '18', color: leadStatusColor[lead.status] || '#3a2fb8' }}>
                  {lead.status || '-'}
                </span>
              </div>
            ))
          }
        </div>

        {/* Recent Bookings */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e6e6f0', padding: '22px', boxShadow: '0 2px 10px rgba(20,20,60,.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '16px', fontWeight: 700, color: '#171a35' }}>Recent Bookings</h2>
            <Link to="/admin/bookings" style={{ fontSize: '12px', color: '#3a2fb8', fontWeight: 600 }}>View all →</Link>
          </div>
          {recentBookings.length === 0
            ? <p style={{ color: '#9ea1c4', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No bookings yet</p>
            : recentBookings.slice(0, 5).map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid #f0f0f6' : 'none' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#171a35' }}>#{b.bookingId || b._id?.slice(-6)}</div>
                  <div style={{ fontSize: '11.5px', color: '#6b6f8a' }}>{b.customer?.name || '-'} · ₹{b.amount?.toLocaleString() || '0'}</div>
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: (bookingStatusColor[b.status] || '#3a2fb8') + '18', color: bookingStatusColor[b.status] || '#3a2fb8' }}>
                  {b.status || '-'}
                </span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
