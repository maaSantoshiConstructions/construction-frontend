import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaDownload } from 'react-icons/fa';
import { getPayments, downloadInvoice } from '../../../api/payments';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

const statusColors = {
  success: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700', refunded: 'bg-amber-100 text-amber-700',
};

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getPayments({ page: p, limit: 10 });
      setPayments(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [page]);

  const handleDownload = async (id) => {
    try {
      const res = await downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded');
    } catch (err) {
      toast.error('Download failed');
    }
  };

  const columns = [
    { key: 'transactionId', label: 'Transaction ID', render: r => <span className="font-mono text-xs">#{r.transactionId || r._id?.slice(-8)}</span> },
    { key: 'customer', label: 'Customer', render: r => r.customer?.name || r.booking?.customer?.name || '-' },
    { key: 'amount', label: 'Amount', render: r => `₹${(r.amount || 0).toLocaleString()}` },
    { key: 'type', label: 'Type', render: r => <span className="capitalize">{r.type || '-'}</span> },
    { key: 'method', label: 'Method', render: r => <span className="capitalize">{r.paymentMethod || r.method || '-'}</span> },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span> },
    { key: 'date', label: 'Date', render: r => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-' },
    { key: 'actions', label: 'Actions', render: r => (
      <button onClick={() => handleDownload(r._id)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg"><FaDownload /></button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Payments</h1>
        <p className="text-slate-500 text-sm">View all payment transactions</p>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchPayments()} /> : (
        <>
          <DataTable columns={columns} data={payments} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
