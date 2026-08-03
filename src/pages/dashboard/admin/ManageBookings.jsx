import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FaEye, FaBan, FaEdit } from 'react-icons/fa';
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
import BookingsHeader from '../../../components/manage-bookings/BookingsHeader';
import BookingsStatCards from '../../../components/manage-bookings/BookingsStatCards';
import BookingsFilterBar from '../../../components/manage-bookings/BookingsFilterBar';

import { BOOKING_STATUS_COLORS, PAYMENT_STATUS_COLORS, PLAN_LABELS } from '../../../constants/statusStyles';
import { fmt, fmtDate } from '../../../utils/formatters';

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

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();

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

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [fetchBookings, fetchStats]);

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
        customer: '',
        plot: '',
        paymentPlan: 'full_payment',
        totalAmount: '',
        tokenAmount: '',
        bookingStatus: 'active',
        salesExecutive: '',
        remarks: '',
        paymentMethod: 'cash',
        referenceNumber: '',
        paymentDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [showFormModal, editing, reset]);

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
  }, [selectedPlotId, availablePlots, editing, setValue]);

  const onSubmit = async (formData) => {
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
        const payload = {
          ...formData,
          totalAmount: Number(formData.totalAmount),
          tokenAmount: tokenAmt,
          paymentMethod: formData.paymentMethod || 'cash',
          referenceNumber: formData.paymentMethod === 'cash' ? undefined : formData.referenceNumber,
          paymentDate: formData.paymentDate || new Date().toISOString().split('T')[0],
        };
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

  const columns = [
    {
      key: 'bookingId',
      label: 'Booking ID',
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
    { key: 'plot', label: 'Plot #', render: (r) => (r.plot?.plotNumber ? `#${r.plot.plotNumber}` : '—') },
    {
      key: 'paymentPlan',
      label: 'Plan',
      render: (r) => <span className="text-xs font-semibold text-slate-600">{PLAN_LABELS[r.paymentPlan] || r.paymentPlan}</span>,
    },
    { key: 'totalAmount', label: 'Total', render: (r) => <span className="font-semibold text-slate-800">₹{fmt(r.totalAmount)}</span> },
    { key: 'paidAmount', label: 'Paid', render: (r) => <span className="font-semibold text-emerald-700">₹{fmt(r.paidAmount)}</span> },
    { key: 'remainingAmount', label: 'Remaining', render: (r) => <span className="font-semibold text-orange-600">₹{fmt(r.remainingAmount)}</span> },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[r.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
          {r.paymentStatus?.replace(/_/g, ' ') || '—'}
        </span>
      ),
    },
    {
      key: 'bookingStatus',
      label: 'Status',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BOOKING_STATUS_COLORS[r.bookingStatus] || 'bg-slate-100 text-slate-600'}`}>
          {r.bookingStatus || '—'}
        </span>
      ),
    },
    {
      key: 'lastPaymentDate',
      label: 'Last Payment',
      render: (r) => <span className="text-slate-500 text-xs">{fmtDate(r.lastPaymentDate)}</span>,
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (r) => (
        <div className="w-24">
          <PaymentProgressBar paidAmount={r.paidAmount || 0} totalAmount={r.totalAmount || 0} />
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
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
      <BookingsHeader openFormModal={openFormModal} />

      <BookingsStatCards stats={stats} />

      <BookingsFilterBar
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setPage={setPage}
      />

      {error ? (
        <ErrorMessage message={error} onRetry={() => fetchBookings()} />
      ) : (
        <>
          <DataTable columns={columns} data={bookings} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <BookingDetailsModal viewBooking={viewBooking} setViewBooking={setViewBooking} />

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
        onPaymentPlanChanged={() => {
          fetchBookings();
          setShowFormModal(false);
        }}
      />
    </div>
  );
}
