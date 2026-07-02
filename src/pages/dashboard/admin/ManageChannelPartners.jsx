import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaCheckCircle } from 'react-icons/fa';
import { getPartners, verifyPartner } from '../../../api/channelPartners';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

export default function ManageChannelPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPartners = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getPartners({ page: p, limit: 10 });
      setPartners(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartners(); }, [page]);

  const handleVerify = async (id) => {
    try {
      await verifyPartner(id);
      toast.success('Partner verified');
      fetchPartners();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Verification failed');
    }
  };

  const columns = [
    { key: 'name', label: 'Partner Name', render: r => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'company', label: 'Company', render: r => r.company || '-' },
    { key: 'commissionRate', label: 'Commission Rate', render: r => r.commissionRate ? `${r.commissionRate}%` : '-' },
    { key: 'earnings', label: 'Earnings', render: r => `₹${(r.totalEarnings || r.earnings || 0).toLocaleString()}` },
    { key: 'verified', label: 'Verified', render: r => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {r.verified ? 'Verified' : 'Pending'}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: r => (
      !r.verified ? (
        <button onClick={() => handleVerify(r._id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><FaCheckCircle /></button>
      ) : null
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Channel Partners</h1>
        <p className="text-slate-500 text-sm">Manage and verify channel partners</p>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchPartners()} /> : (
        <>
          <DataTable columns={columns} data={partners} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
