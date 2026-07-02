import { useState, useEffect } from 'react';
import DataTable from '../../../components/common/DataTable';
import ErrorMessage from '../../../components/common/ErrorMessage';

const commissionStatusColors = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function MyCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { default: referralsApi } = await import('../../../api/channelPartners');
      const { getPartners } = referralsApi;
      const { data: res } = await getPartners({ limit: 100 });
      const items = res?.data?.referrals || res?.referrals || res?.data || [];
      setCommissions(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCommissions(); }, []);

  const columns = [
    { key: 'referralName', label: 'Referral Name', render: r => <span className="font-medium text-slate-800">{r.name || r.referredPerson?.name || '-'}</span> },
    { key: 'property', label: 'Property', render: r => r.property?.name || r.project?.name || r.plot?.plotNumber || '-' },
    { key: 'amount', label: 'Amount', render: r => '₹' + (r.amount?.toLocaleString() || r.commissionAmount?.toLocaleString() || '0') },
    { key: 'commissionPct', label: 'Commission %', render: r => (r.commissionPercent || r.commissionPercentage || 0) + '%' },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${commissionStatusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status?.replace(/_/g, ' ')}</span> },
    { key: 'date', label: 'Date', render: r => new Date(r.createdAt || r.date).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Commissions</h1>
        <p className="text-slate-500 text-sm">Track your commission earnings</p>
      </div>

      {error ? <ErrorMessage message={error} onRetry={fetchCommissions} /> : (
        <DataTable columns={columns} data={commissions} loading={loading} />
      )}
    </div>
  );
}
