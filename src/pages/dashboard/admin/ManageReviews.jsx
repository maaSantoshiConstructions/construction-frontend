import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaTrash, FaStar } from 'react-icons/fa';
import { getReviews, approveReview, deleteReview } from '../../../api/reviews';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getReviews({ page: p, limit: 10 });
      setReviews(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [page]);

  const handleApprove = async (id) => {
    try {
      await approveReview(id);
      toast.success('Review approved');
      fetchReviews();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Approve failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <FaStar key={i} className={`text-xs ${i <= rating ? 'text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  );

  const columns = [
    { key: 'customer', label: 'Customer', render: r => r.customer?.name || r.name || '-' },
    { key: 'project', label: 'Project', render: r => r.project?.name || '-' },
    { key: 'rating', label: 'Rating', render: r => <StarRating rating={r.rating || 0} /> },
    { key: 'comment', label: 'Comment', render: r => (
      <div className="max-w-xs truncate" title={r.comment}>{r.comment || '-'}</div>
    )},
    { key: 'date', label: 'Date', render: r => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-' },
    { key: 'approved', label: 'Approved', render: r => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {r.approved ? 'Approved' : 'Pending'}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-2">
        {!r.approved && <button onClick={() => handleApprove(r._id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><FaCheckCircle /></button>}
        <button onClick={() => handleDelete(r._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FaTrash /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Reviews</h1>
        <p className="text-slate-500 text-sm">Approve and manage customer reviews</p>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchReviews()} /> : (
        <>
          <DataTable columns={columns} data={reviews} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
