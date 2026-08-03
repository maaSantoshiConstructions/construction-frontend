import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { getBookingDetails, updateBooking } from '../../../api/bookings';
import { downloadReceipt } from '../../../api/payments';
import { getUsers } from '../../../api/users';
import { useAuth } from '../../../context/AuthContext';

import PaymentSummaryCards from '../../../components/manage-bookings/PaymentSummaryCards';
import AddPaymentDialog from '../../../components/manage-bookings/AddPaymentDialog';
import BookingFormModal from '../../../components/manage-bookings/BookingFormModal';
import CancelPaymentDialog from '../../../components/manage-bookings/CancelPaymentDialog';

import BookingDetailsHeader from '../../../components/booking-details/BookingDetailsHeader';
import BookingInfoCard from '../../../components/booking-details/BookingInfoCard';
import CustomerInfoCard from '../../../components/booking-details/CustomerInfoCard';
import PlotInfoCard from '../../../components/booking-details/PlotInfoCard';
import BookingPaymentsTable from '../../../components/booking-details/BookingPaymentsTable';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showEditBooking, setShowEditBooking] = useState(false);
  const [cancelingPayment, setCancelingPayment] = useState(null);
  const [availablePlots, setAvailablePlots] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getBookingDetails(id);
      setDetails(res?.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const openEditModal = async () => {
    try {
      const { data: res } = await getUsers({ limit: 100 });
      const staff = (res?.data || []).filter((u) =>
        ['super_admin', 'company_admin', 'sales_executive'].includes(u.role)
      );
      setSalesExecutives(staff);
      if (details?.booking) {
        setAvailablePlots(details.booking.plot ? [details.booking.plot] : []);
      }
    } catch {}
    if (details?.booking) {
      reset({
        customer: details.booking.customer?._id || '',
        plot: details.booking.plot?._id || '',
        paymentPlan: details.booking.paymentPlan || 'full_payment',
        totalAmount: details.booking.totalAmount || '',
        tokenAmount: details.booking.tokenAmount || '',
        bookingStatus: details.booking.bookingStatus || 'active',
        salesExecutive: details.booking.salesExecutive?._id || '',
        remarks: details.booking.remarks || '',
      });
    }
    setShowEditBooking(true);
  };

  const onEditSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await updateBooking(id, formData);
      toast.success('Booking updated');
      setShowEditBooking(false);
      fetchDetails();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReceipt = async (paymentId) => {
    try {
      const res = await downloadReceipt(paymentId);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download receipt');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-red-500 font-semibold">{error || 'Booking not found'}</p>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-all"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  const { booking, paymentSummary, payments } = details;
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header Actions */}
      <BookingDetailsHeader
        booking={booking}
        navigate={navigate}
        openEditModal={openEditModal}
        onAddPayment={() => setShowAddPayment(true)}
      />

      {/* Payment Summary Cards */}
      <PaymentSummaryCards
        totalAmount={paymentSummary.totalAmount}
        paidAmount={paymentSummary.paidAmount}
        remainingAmount={paymentSummary.remainingAmount}
        progressPercent={paymentSummary.progressPercent}
        lastPaymentDate={paymentSummary.lastPaymentDate}
        paymentStatus={paymentSummary.paymentStatus}
      />

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <BookingInfoCard booking={booking} />
        <CustomerInfoCard customer={booking.customer} />
        <PlotInfoCard project={booking.project} plot={booking.plot} />
      </div>

      {/* Payment History Table */}
      <BookingPaymentsTable
        payments={payments}
        totalAmount={booking.totalAmount}
        isSuperAdmin={isSuperAdmin}
        handleDownloadReceipt={handleDownloadReceipt}
        setCancelingPayment={setCancelingPayment}
      />

      {/* Dialogs & Modals */}
      {showAddPayment && (
        <AddPaymentDialog
          booking={booking}
          onClose={() => setShowAddPayment(false)}
          onSuccess={() => {
            setShowAddPayment(false);
            fetchDetails();
          }}
        />
      )}

      {showEditBooking && (
        <BookingFormModal
          showFormModal={showEditBooking}
          setShowFormModal={setShowEditBooking}
          editing={booking}
          submitting={submitting}
          onSubmit={onEditSubmit}
          availablePlots={availablePlots}
          customers={[]}
          salesExecutives={salesExecutives}
          register={register}
          handleSubmitForm={handleSubmit}
          errors={errors}
          userRole={user?.role}
          onPaymentPlanChanged={fetchDetails}
        />
      )}

      {cancelingPayment && (
        <CancelPaymentDialog
          payment={cancelingPayment}
          userRole={user?.role}
          onClose={() => setCancelingPayment(null)}
          onSuccess={() => {
            setCancelingPayment(null);
            fetchDetails();
          }}
        />
      )}
    </div>
  );
}
