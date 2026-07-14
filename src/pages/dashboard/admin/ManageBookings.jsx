import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FaEye, FaTimes, FaBan, FaPlus, FaEdit } from 'react-icons/fa';
import { getBookings, createBooking, updateBooking, cancelBooking } from '../../../api/bookings';
import { getPlots } from '../../../api/plots';
import { getUsers } from '../../../api/users';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

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
          <button onClick={() => handleCancel(r._id)} className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-650 rounded-lg transition-colors" title="Cancel Booking"><FaBan /></button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Bookings</h1>
          <p className="text-slate-500 text-sm">View, create, and manage customer plot bookings</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/10 active:scale-[0.98] transition-all"
        >
          <FaPlus />
          Add Booking
        </button>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchBookings()} /> : (
        <>
          <DataTable columns={columns} data={bookings} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* View Booking Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Booking Details</h2>
              <button onClick={() => setViewBooking(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Booking ID:</span><p className="font-semibold text-slate-800">#{viewBooking.bookingId || viewBooking._id?.slice(-6)}</p></div>
                <div><span className="text-slate-500">Status:</span><p className="mt-0.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[viewBooking.status] || ''}`}>{viewBooking.status}</span></p></div>
                <div><span className="text-slate-500">Customer:</span><p className="font-medium text-slate-800">{viewBooking.customer?.name || '-'}</p></div>
                <div><span className="text-slate-500">Email:</span><p className="text-slate-700">{viewBooking.customer?.email || '-'}</p></div>
                <div><span className="text-slate-500">Phone:</span><p className="text-slate-700">{viewBooking.customer?.phone || '-'}</p></div>
                <div><span className="text-slate-500">Plot #:</span><p className="font-semibold text-slate-900">{viewBooking.plot?.plotNumber ? `#${viewBooking.plot.plotNumber}` : '-'}</p></div>
                <div><span className="text-slate-500">Project:</span><p className="text-slate-700">{viewBooking.project?.name || viewBooking.plot?.project?.name || '-'}</p></div>
                <div><span className="text-slate-500">Total Amount:</span><p className="font-bold text-indigo-700">₹{(viewBooking.totalAmount || viewBooking.amount || 0).toLocaleString('en-IN')}</p></div>
                <div><span className="text-slate-500">Token Amount:</span><p className="font-semibold text-slate-800">₹{(viewBooking.tokenAmount || 0).toLocaleString('en-IN')}</p></div>
                <div><span className="text-slate-500">Payment Plan:</span><p className="capitalize text-slate-700">{viewBooking.paymentPlan?.replace(/_/g, ' ')}</p></div>
                <div><span className="text-slate-500">Date:</span><p className="text-slate-700">{viewBooking.createdAt ? new Date(viewBooking.createdAt).toLocaleDateString() : '-'}</p></div>
                {viewBooking.salesExecutive && (
                  <div><span className="text-slate-500">Sales Executive:</span><p className="text-slate-700">{viewBooking.salesExecutive.name}</p></div>
                )}
              </div>

              {viewBooking.remarks && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-slate-500 text-sm">Remarks:</span>
                  <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{viewBooking.remarks}</p>
                </div>
              )}

              {viewBooking.installments?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-755 text-sm mb-2">Installments</h3>
                  <div className="border border-slate-150 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">#</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Amount</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Due Date</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Status</th></tr>
                      </thead>
                      <tbody>
                        {viewBooking.installments.map((inst, i) => (
                          <tr key={i} className="border-t border-slate-100">
                            <td className="px-3 py-2 text-slate-700">{i + 1}</td>
                            <td className="px-3 py-2 font-medium text-slate-800">₹{inst.amount?.toLocaleString('en-IN')}</td>
                            <td className="px-3 py-2 text-slate-700">{inst.dueDate ? new Date(inst.dueDate).toLocaleDateString() : '-'}</td>
                            <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-medium ${inst.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{inst.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add / Edit Booking Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[85vh] overflow-hidden">
              {/* Sticky Header */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 shrink-0">
                <h2 className="text-lg font-bold text-slate-800">{editing ? 'Edit Customer Booking' : 'New Plot Booking'}</h2>
                <button type="button" onClick={() => setShowFormModal(false)} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-700">
                  <FaTimes />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* Customer (Read-only if editing) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Customer *</label>
                  {editing ? (
                    <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium">
                      {editing.customer?.name || '-'} ({editing.customer?.email || '-'})
                    </div>
                  ) : (
                    <select
                      {...register('customer', { required: 'Customer is required' })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium"
                    >
                      <option value="">Select Customer</option>
                      {customers.map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.email || c.phone || 'No Contact'})
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.customer && <p className="text-rose-500 text-xs mt-1">{errors.customer.message}</p>}
                </div>

                {/* Plot selection (Read-only if editing) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Plot *</label>
                  {editing ? (
                    <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium">
                      Plot #{editing.plot?.plotNumber} - {editing.project?.name || 'No Project'}
                    </div>
                  ) : (
                    <select
                      {...register('plot', { required: 'Plot selection is required' })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium"
                    >
                      <option value="">Select Plot</option>
                      {availablePlots.map(p => (
                        <option key={p._id} value={p._id}>
                          Plot #{p.plotNumber} - {p.project?.name || 'No Project'} (₹{p.price?.toLocaleString('en-IN')})
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.plot && <p className="text-rose-500 text-xs mt-1">{errors.plot.message}</p>}
                </div>

                {/* Amounts (side-by-side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Total Amount (₹) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 1500000"
                      {...register('totalAmount', { required: 'Total amount is required', min: { value: 0, message: 'Must be positive' } })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium placeholder:text-slate-400"
                    />
                    {errors.totalAmount && <p className="text-rose-500 text-xs mt-1">{errors.totalAmount.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Token Amount Paid (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 25000"
                      {...register('tokenAmount')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Payment Plan & Status (side-by-side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment Plan</label>
                    <select
                      {...register('paymentPlan')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium"
                    >
                      <option value="full_payment">Full Payment</option>
                      <option value="installment">Installment Plan</option>
                      <option value="loan">Bank Loan Financing</option>
                    </select>
                  </div>
                  
                  {/* Status (only editable if editing) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Booking Status</label>
                    <select
                      {...register('status')}
                      disabled={!editing}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium disabled:opacity-60"
                    >
                      <option value="token">Token Paid</option>
                      <option value="partial">Partial Payments</option>
                      <option value="completed">Completed / Sold</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Sales Executive */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sales Executive</label>
                  <select
                    {...register('salesExecutive')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium"
                  >
                    <option value="">Select Sales Executive</option>
                    {salesExecutives.map(se => (
                      <option key={se._id} value={se._id}>
                        {se.name} ({se.role || 'Staff'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Remarks</label>
                  <textarea
                    rows={2.5}
                    placeholder="E.g. Price agreed including basic layout development charges..."
                    {...register('remarks')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-slate-800 font-medium placeholder:text-slate-400 resize-none"
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex justify-end gap-3 px-6 py-4.5 bg-slate-50 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 rounded-xl transition-all shadow-xs active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {submitting && <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
                  <span>{editing ? 'Save Changes' : 'Create Booking'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
