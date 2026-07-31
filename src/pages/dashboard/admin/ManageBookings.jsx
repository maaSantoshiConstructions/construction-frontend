import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import {
  FaEye, FaBan, FaEdit, FaPlus, FaFilter, FaSearch,
  FaBuilding, FaCheckCircle, FaRupeeSign, FaExclamationCircle,
} from 'react-icons/fa';
import { getBookings, createBooking, updateBooking, cancelBooking, getBookingStats } from '../../../api/bookings';
import { getPlots } from '../../../api/plots';
import { getUsers } from '../../../api/users';
import { useAuth } from '../../../context/AuthContext';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';
import PaymentProgressBar from '../../../components/manage-bookings/PaymentProgressBar';
import BookingDetailsModal from '../../../components/manage-bookings/BookingDetailsModal';
import BookingFormModal from '../../../components/manage-bookings/BookingFormModal';

const BOOKING_STATUS_COLORS = {
  active:    'bg-sky-100 text-sky-700 border border-sky-200',
  completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

const PAYMENT_STATUS_COLORS = {
  token_paid:     'bg-amber-100 text-amber-700 border border-amber-200',
  partially_paid: 'bg-orange-100 text-orange-700 border border-orange-200',
  fully_paid:     'bg-emerald-100 text-emerald-700 border border-emerald-200',
  refunded:       'bg-violet-100 text-violet-700 border border-violet-200',
};

const PLAN_LABELS = {
  full_payment: 'Full Payment',
  installment:  'Installment',
  loan:         'Bank Loan',
};

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-IN') : '—');
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

export default function ManageBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewBooking, setViewBooking] = useState(null);

  // Filters
  const [filters, setFilters] = useState({ bookingStatus: '', paymentStatus: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Form states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [availablePlots, setAvailablePlots] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm();

  const fetchBookings = useCallback(async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: p, limit: 10 };
      if (filters.bookingStatus) params.bookingStatus = filters.bookingStatus;
      if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;

      const { data: res } = await getBookings(params);
      setBookings(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchStats = useCallback(async () => {
    try {
      const { data: res } = await getBookingStats();
      setStats(res?.data);
    } catch {}
  }, []);

  useEffect(() => { fetchBookings(); fetchStats(); }, [page, filters]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? The plot will be released back to Available.')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled — Plot released');
      fetchBookings();
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cancel failed');
    }
  };

  const openFormModal = async (booking = null) => {
    setEditing(booking);
    setShowFormModal(true);

    try {
      const { data: res } = await getPlots({ status: 'available', limit: 100 });
      let list = res?.data || [];
      if (booking?.plot && !list.find((p) => p._id === booking.plot._id)) {
        list = [booking.plot, ...list];
      }
      setAvailablePlots(list);
    } catch {}

    try {
      const { data: res } = await getUsers({ role: 'customer', limit: 100 });
      let list = res?.data || [];
      if (booking?.customer && !list.find((c) => c._id === booking.customer._id)) {
        list = [booking.customer, ...list];
      }
      setCustomers(list);
    } catch {}

    try {
      const { data: res } = await getUsers({ limit: 100 });
      const staff = (res?.data || []).filter((u) =>
        ['super_admin', 'company_admin', 'sales_executive'].includes(u.role)
      );
      setSalesExecutives(staff);
    } catch {}
  };

  useEffect(() => {
    if (!showFormModal) return;
    if (editing) {
      reset({
        customer: editing.customer?._id || '',
        plot: editing.plot?._id || '',
        paymentPlan: editing.paymentPlan || 'full_payment',
        totalAmount: editing.totalAmount || '',
        tokenAmount: editing.tokenAmount || '',
        bookingStatus: editing.bookingStatus || 'active',
        salesExecutive: editing.salesExecutive?._id || '',
        remarks: editing.remarks || '',
      });
    } else {
      reset({
        customer: '', plot: '', paymentPlan: 'full_payment',
        totalAmount: '', tokenAmount: '', bookingStatus: 'active',
        salesExecutive: '', remarks: '',
        paymentMethod: 'cash',
        referenceNumber: '',
        paymentDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [showFormModal, editing]);

  // Watch form fields for reactive UI updates
  const selectedPlotId = watch('plot');
  const tokenAmountWatched = watch('tokenAmount');
  const paymentMethodWatched = watch('paymentMethod');
  const totalAmountWatched = watch('totalAmount');

  useEffect(() => {
    if (selectedPlotId && !editing) {
      const plot = availablePlots.find((p) => p._id === selectedPlotId);
      if (plot?.price) setValue('totalAmount', plot.price);
    }
  }, [selectedPlotId, availablePlots, editing]);

  const onSubmit = async (formData, receiptFile) => {
    setSubmitting(true);
    try {
      if (editing) {
        const payload = {
          ...formData,
          totalAmount: Number(formData.totalAmount),
          tokenAmount: formData.tokenAmount ? Number(formData.tokenAmount) : 0,
        };
        await updateBooking(editing._id, payload);
        toast.success('Booking updated');
      } else {
        const tokenAmt = formData.tokenAmount ? Number(formData.tokenAmount) : 0;
        let payload;
        if (tokenAmt > 0 && receiptFile) {
          payload = new FormData();
          Object.keys(formData).forEach((key) => {
            if (formData[key] !== undefined && formData[key] !== null) {
              if (key === 'referenceNumber' && formData.paymentMethod === 'cash') return;
              payload.append(key, formData[key]);
            }
          });
          payload.append('receipt', receiptFile);
        } else {
          payload = {
            ...formData,
            totalAmount: Number(formData.totalAmount),
            tokenAmount: tokenAmt,
            paymentMethod: formData.paymentMethod || 'cash',
            referenceNumber: formData.paymentMethod === 'cash' ? undefined : formData.referenceNumber,
            paymentDate: formData.paymentDate || new Date().toISOString().split('T')[0],
          };
        }
        await createBooking(payload);
        toast.success('Booking created — Plot reserved');
      }
      setShowFormModal(false);
      fetchBookings();
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Summary stat cards
  const totalBookings = stats?.totalBookings || 0;
  const totalCollected = stats?.totalCollected || 0;
  const totalOutstanding = stats?.totalOutstanding || 0;
  const activeCount = stats?.byBookingStatus?.find((s) => s.bookingStatus === 'active')?.count || 0;

  const summaryCards = [
    { icon: <FaBuilding />, label: 'Total Bookings', value: totalBookings, color: 'indigo' },
    { icon: <FaCheckCircle />, label: 'Active', value: activeCount, color: 'sky' },
    { icon: <FaRupeeSign />, label: 'Revenue Collected', value: `₹${fmt(totalCollected)}`, color: 'emerald' },
    { icon: <FaExclamationCircle />, label: 'Outstanding', value: `₹${fmt(totalOutstanding)}`, color: 'orange' },
  ];

  const colorMap = {
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-200' },
    sky:    { bg: 'bg-sky-50',    icon: 'bg-sky-100 text-sky-600',       border: 'border-sky-200' },
    emerald:{ bg: 'bg-emerald-50',icon: 'bg-emerald-100 text-emerald-600',border: 'border-emerald-200' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
  };

  const columns = [
    {
      key: 'bookingId', label: 'Booking ID',
      render: (r) => (
        <span
          className="font-mono text-sm font-semibold text-amber-700 cursor-pointer hover:underline"
          onClick={() => navigate(`/admin/bookings/${r._id}`)}
        >
          #{r.bookingId || r._id?.slice(-6)}
        </span>
      ),
    },
    { key: 'customer', label: 'Customer', render: (r) => <span className="font-medium text-slate-800">{r.customer?.name || '—'}</span> },
    { key: 'project', label: 'Project', render: (r) => r.project?.name || '—' },
    { key: 'plot', label: 'Plot #', render: (r) => r.plot?.plotNumber ? `#${r.plot.plotNumber}` : '—' },
    {
      key: 'paymentPlan', label: 'Plan',
      render: (r) => <span className="text-xs font-semibold text-slate-600">{PLAN_LABELS[r.paymentPlan] || r.paymentPlan}</span>,
    },
    { key: 'totalAmount', label: 'Total', render: (r) => <span className="font-semibold text-slate-800">₹{fmt(r.totalAmount)}</span> },
    { key: 'paidAmount',  label: 'Paid',  render: (r) => <span className="font-semibold text-emerald-700">₹{fmt(r.paidAmount)}</span> },
    { key: 'remainingAmount', label: 'Remaining', render: (r) => <span className="font-semibold text-orange-600">₹{fmt(r.remainingAmount)}</span> },
    {
      key: 'paymentStatus', label: 'Payment Status',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[r.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
          {r.paymentStatus?.replace(/_/g, ' ') || '—'}
        </span>
      ),
    },
    {
      key: 'bookingStatus', label: 'Status',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BOOKING_STATUS_COLORS[r.bookingStatus] || 'bg-slate-100 text-slate-600'}`}>
          {r.bookingStatus || '—'}
        </span>
      ),
    },
    {
      key: 'lastPaymentDate', label: 'Last Payment',
      render: (r) => <span className="text-slate-500 text-xs">{fmtDate(r.lastPaymentDate)}</span>,
    },
    {
      key: 'progress', label: 'Progress',
      render: (r) => (
        <div className="w-24">
          <PaymentProgressBar paidAmount={r.paidAmount || 0} totalAmount={r.totalAmount || 0} />
        </div>
      ),
    },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/admin/bookings/${r._id}`)}
            className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors"
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            onClick={() => openFormModal(r)}
            className="p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors"
            title="Edit Booking"
          >
            <FaEdit />
          </button>
          {r.bookingStatus !== 'cancelled' && (
            <button
              onClick={() => handleCancel(r._id)}
              className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              title="Cancel Booking"
            >
              <FaBan />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Booking Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage all plot bookings and payment progress</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          <FaPlus />
          New Booking
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const c = colorMap[card.color];
          return (
            <div key={card.label} className={`${c.bg} border ${c.border} rounded-2xl p-4 flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon} shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{card.label}</p>
                <p className="text-lg font-bold text-slate-800">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${showFilters ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
        >
          <FaFilter className="text-xs" /> Filters
        </button>
        {showFilters && (
          <>
            <select
              value={filters.bookingStatus}
              onChange={(e) => { setFilters((f) => ({ ...f, bookingStatus: e.target.value })); setPage(1); }}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.paymentStatus}
              onChange={(e) => { setFilters((f) => ({ ...f, paymentStatus: e.target.value })); setPage(1); }}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="">All Payment Status</option>
              <option value="token_paid">Token Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="fully_paid">Fully Paid</option>
              <option value="refunded">Refunded</option>
            </select>
            {(filters.bookingStatus || filters.paymentStatus) && (
              <button
                onClick={() => { setFilters({ bookingStatus: '', paymentStatus: '', search: '' }); setPage(1); }}
                className="px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
              >
                Clear
              </button>
            )}
          </>
        )}
      </div>

      {/* Table */}
      {error ? (
        <ErrorMessage message={error} onRetry={() => fetchBookings()} />
      ) : (
        <>
          <DataTable columns={columns} data={bookings} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Quick View Modal */}
      <BookingDetailsModal viewBooking={viewBooking} setViewBooking={setViewBooking} />

      {/* Create / Edit Modal */}
      <BookingFormModal
        showFormModal={showFormModal}
        setShowFormModal={setShowFormModal}
        editing={editing}
        submitting={submitting}
        onSubmit={onSubmit}
        availablePlots={availablePlots}
        customers={customers}
        salesExecutives={salesExecutives}
        register={register}
        handleSubmitForm={handleSubmit}
        errors={errors}
        userRole={user?.role}
        setValue={setValue}
        tokenAmountWatched={tokenAmountWatched}
        paymentMethodWatched={paymentMethodWatched}
        totalAmountWatched={totalAmountWatched}
        onPaymentPlanChanged={() => { fetchBookings(); setShowFormModal(false); }}
      />
    </div>
  );
}
