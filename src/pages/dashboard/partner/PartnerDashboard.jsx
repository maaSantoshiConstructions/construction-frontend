import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaRupeeSign, FaClock, FaUserFriends, FaUserPlus, FaCopy, FaCheck } from 'react-icons/fa';
import { getPartnerDashboard } from '../../../api/dashboard';
import { useAuth } from '../../../context/AuthContext';
import StatsCard from '../../../components/common/StatsCard';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

const referralStatusColors = {
  new: 'bg-orange-100 text-orange-700', contacted: 'bg-amber-100 text-amber-700',
  interested: 'bg-amber-100 text-amber-700', converted: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getPartnerDashboard();
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
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;

  const stats = data?.stats || {};
  const recentReferrals = data?.recentReferrals || [];
  const referralLink = `https://maasantoshiconstructions.com/ref/${user?.partnerCode || user?._id?.slice(-6)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const referralColumns = [
    { key: 'name', label: 'Name', render: r => r.name || r.referredPerson?.name || '-' },
    { key: 'phone', label: 'Phone', render: r => r.phone || r.referredPerson?.phone || '-' },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${referralStatusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
    { key: 'commission', label: 'Commission', render: r => '₹' + (r.commissionAmount?.toLocaleString() || '0') },
    { key: 'date', label: 'Date', render: r => new Date(r.createdAt || r.date).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name || 'Partner'}</h1>
        <p className="text-slate-500 text-sm mt-1">Channel partner dashboard</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Commission" value={'₹' + (stats.totalCommission?.toLocaleString() || '0')} icon={FaRupeeSign} color="green" />
        <StatsCard title="Pending Commission" value={'₹' + (stats.pendingCommission?.toLocaleString() || '0')} icon={FaClock} color="yellow" />
        <StatsCard title="Total Referrals" value={stats.totalReferrals || 0} icon={FaUserFriends} color="blue" />
        <StatsCard title="Leads Generated" value={stats.leadsGenerated || 0} icon={FaUserPlus} color="purple" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Your Referral Link</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {copied ? <FaCheck /> : <FaCopy />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">Recent Referrals</h2>
          <span className="text-xs text-slate-400">{recentReferrals.length} referrals</span>
        </div>
        {recentReferrals.length > 0 ? (
          <DataTable columns={referralColumns} data={recentReferrals.slice(0, 5)} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-400">
            No referrals yet. Share your link to get started!
          </div>
        )}
      </div>
    </div>
  );
}
