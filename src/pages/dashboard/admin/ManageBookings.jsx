import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FaEye, FaBan, FaEdit } from 'react-icons/fa';
import { getBookings, createBooking, updateBooking, cancelBooking } from '../../../api/bookings';
import { getPlots } from '../../../api/plots';
import { getUsers } from '../../../api/users';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

// Import refactored modular subcomponents
import BookingsHeader from '../../../components/manage-bookings/BookingsHeader';
import BookingDetailsModal from '../../../components/manage-bookings/BookingDetailsModal';
import BookingFormModal from '../../../components/manage-bookings/BookingFormModal';

const statusColors = {
  token: 'bg-amber-100 text-amber-700',
  partial: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewBooking, setViewBooking] = useState(null);

  // Form states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [availablePlots, setAvailablePlots] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();

  const fetchBookings = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getBookings({ page: p, limit: 10 });
      setBookings(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cancel failed');
    }
  };

  const openFormModal = async (booking = null) => {
    setEditing(booking);
    setShowFormModal(true);

    // Fetch available plots
    try {
      const { data: res } = await getPlots({ status: 'available', limit: 100 });
      let plotsList = res?.data || [];
      if (booking && booking.plot) {
        if (!plotsList.find(p => p._id === booking.plot._id)) {
          plotsList = [booking.plot, ...plotsList];
        }
      }
      setAvailablePlots(plotsList);
    } catch (err) {
      console.error('Failed to load available plots:', err);
    }

    // Fetch customers
    try {
      const { data: res } = await getUsers({ role: 'customer', limit: 100 });
      let customersList = res?.data || [];
      if (booking && booking.customer) {
        if (!customersList.find(c => c._id === booking.customer._id)) {
          customersList = [booking.customer, ...customersList];
        }
      }
      setCustomers(customersList);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }

    // Fetch sales executives (all staff/users)
    try {
      const { data: res } = await getUsers({ limit: 100 });
      const staff = (res?.data || []).filter(u => ['super_admin', 'company_admin', 'sales_executive'].includes(u.role));
      setSalesExecutives(staff);
    } catch (err) {
      console.error('Failed to load sales executives:', err);
    }
  };

  // Reset form defaults when modal toggles
  useEffect(() => {
    if (showFormModal) {
      if (editing) {
        reset({
          customer: editing.customer?._id || '',
          plot: editing.plot?._id || '',
          paymentPlan: editing.paymentPlan || 'full_payment',
          totalAmount: editing.totalAmount || '',
          tokenAmount: editing.tokenAmount || '',
          status: editing.status || 'token',
          remarks: editing.remarks || '',
          salesExecutive: editing.salesExecutive?._id || '',
        });
      } else {
        reset({
          customer: '',
          plot: '',
          paymentPlan: 'full_payment',
          totalAmount: '',
          tokenAmount: '',
          status: 'token',
          remarks: '',
          salesExecutive: '',
        });
      }
    }
  }, [showFormModal, editing]);

  // Autofill totalAmount when selecting a plot (only when creating new booking)
  const selectedPlotId = watch('plot');
  useEffect(() => {
    if (selectedPlotId && !editing) {
      const plot = availablePlots.find(p => p._id === selectedPlotId);
      if (plot && plot.price) {
        setValue('totalAmount', plot.price);
      }
    }
  }, [selectedPlotId, availablePlots, editing]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        tokenAmount: formData.tokenAmount ? Number(formData.tokenAmount) : 0,
      };

      if (editing) {
        await updateBooking(editing._id, payload);
        toast.success('Booking updated successfully');
      } else {
        await createBooking(payload);
        toast.success('Booking created successfully');
      }
      setShowFormModal(false);
      fetchBookings();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'bookingId', label: 'Booking ID', render: r => <span className="font-medium text-orange-655 font-mono">#{r.bookingId || r._id?.slice(-6)}</span> },
    { key: 'customer', label: 'Customer', render: r => r.customer?.name || '-' },
    { key: 'plot', label: 'Plot #', render: r => r.plot?.plotNumber ? `#${r.plot.plotNumber}` : '-' },
    { key: 'project', label: 'Project', render: r => r.project?.name || r.plot?.project?.name || '-' },
    { key: 'amount', label: 'Amount', render: r => `₹${(r.totalAmount || r.amount || 0).toLocaleString('en-IN')}` },
    { key: 'status', label: 'Status', render: r => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span> },
    { key: 'date', label: 'Date', render: r => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-' },
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-2">
        <button onClick={() => setViewBooking(r)} className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors" title="View Details"><FaEye /></button>
        <button onClick={() => openFormModal(r)} className="p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors" title="Edit Booking"><FaEdit /></button>
        {r.status !== 'cancelled' && r.status !== 'completed' && (
          <button onClick={() => handleCancel(r._id)} className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-655 rounded-lg transition-colors" title="Cancel Booking"><FaBan /></button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <BookingsHeader openFormModal={openFormModal} />

      {error ? <ErrorMessage message={error} onRetry={() => fetchBookings()} /> : (
        <>
          <DataTable columns={columns} data={bookings} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* View Booking Modal */}
      <BookingDetailsModal viewBooking={viewBooking} setViewBooking={setViewBooking} />

      {/* Add / Edit Booking Form Modal */}
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
      />
    </div>
  );
}
