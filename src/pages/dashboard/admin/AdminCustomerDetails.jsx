import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import { getCustomer } from '../../../api/customers';
import { downloadReceipt } from '../../../api/payments';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { fmt, fmtDate } from '../../../utils/formatters';

import CustomerHeader from '../../../components/customer-details/CustomerHeader';
import CustomerFinancialStats from '../../../components/customer-details/CustomerFinancialStats';
import PurchasedPropertiesTable from '../../../components/customer-details/PurchasedPropertiesTable';
import CustomerPaymentsAndTimeline from '../../../components/customer-details/CustomerPaymentsAndTimeline';
import CustomerSiteVisits from '../../../components/customer-details/CustomerSiteVisits';
import CustomerProfileTabs from '../../../components/customer-details/CustomerProfileTabs';

export default function AdminCustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchCustomerData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getCustomer(id);
      setData(res?.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load customer profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const handleDownloadReceipt = async (paymentId, paymentIdStr) => {
    try {
      const res = await downloadReceipt(paymentId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentIdStr || paymentId.slice(-6)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Receipt downloaded');
    } catch {
      toast.error('Failed to download receipt');
    }
  };

  if (loading) return <Loader />;
  if (error || !data || !data.customer) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/admin/customers')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Customers
        </button>
        <ErrorMessage message={error || 'Customer profile not found'} onRetry={fetchCustomerData} />
      </div>
    );
  }

  const customerObj = data.customer;
  const userObj = customerObj.user || {};
  const bookings = data.bookings || [];
  const payments = data.payments || [];
  const siteVisits = data.siteVisits || [];
  const financials = data.financials || {};

  const custName = userObj.name || customerObj.name || 'Customer Profile';
  const custEmail = userObj.email || '—';
  const custPhone = userObj.phone || '—';
  const custCode = `CUST-${customerObj._id.slice(-6).toUpperCase()}`;

  // Single Source of Truth Financials
  const totalPropertiesCount = financials.totalProperties ?? bookings.length;
  const activeBookingsCount = financials.activeBookingsCount ?? bookings.filter((b) => (b.bookingStatus || b.status) === 'active').length;
  const completedBookingsCount = financials.completedBookingsCount ?? bookings.filter((b) => (b.bookingStatus || b.status) === 'completed').length;
  const cancelledBookingsCount = financials.cancelledBookingsCount ?? bookings.filter((b) => (b.bookingStatus || b.status) === 'cancelled').length;

  const totalBookingValue = financials.totalBookingValue ?? bookings.reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);
  const totalPaid = financials.totalPaid ?? bookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const totalOutstanding = financials.totalOutstanding ?? bookings.reduce((sum, b) => sum + (b.remainingAmount || 0), 0);
  const totalRefunded = financials.totalRefunded ?? 0;

  // Assigned Executive
  const salesExec = customerObj.booking?.salesExecutive?.name || bookings[0]?.salesExecutive?.name || '—';

  // Chronological Activity Timeline
  const timelineEvents = [
    {
      title: 'Customer Registered',
      desc: `${custName} registered account in system`,
      date: fmtDate(userObj.createdAt || customerObj.createdAt),
      icon: FaUser,
      color: 'bg-indigo-500',
      timestamp: new Date(userObj.createdAt || customerObj.createdAt).getTime(),
    },
    ...siteVisits.map((sv) => ({
      title: 'Site Visit Recorded',
      desc: `Visited ${sv.project?.name || 'Project'} ${sv.plot?.plotNumber ? `(Plot #${sv.plot.plotNumber})` : ''}`,
      date: fmtDate(sv.visitDate || sv.date || sv.createdAt),
      icon: FaCalendarAlt,
      color: 'bg-sky-500',
      timestamp: new Date(sv.visitDate || sv.date || sv.createdAt).getTime(),
    })),
    ...bookings.map((b) => ({
      title: `Booking Created (${b.bookingStatus || 'Active'})`,
      desc: `Plot #${b.plot?.plotNumber || ''} booked in ${b.project?.name || 'Project'}`,
      date: fmtDate(b.bookingDate || b.createdAt),
      icon: FaBuilding,
      color: 'bg-amber-500',
      timestamp: new Date(b.bookingDate || b.createdAt).getTime(),
    })),
    ...payments.map((p) => ({
      title: p.transactionStatus === 'refunded' ? 'Refund Processed' : `Payment Recorded (${p.paymentType?.replace(/_/g, ' ')})`,
      desc: `₹${fmt(p.amount)} via ${p.paymentMethod?.replace(/_/g, ' ')} (${p.transactionStatus})`,
      date: fmtDate(p.paidAt || p.createdAt),
      icon: FaCheckCircle,
      color: p.transactionStatus === 'refunded' ? 'bg-violet-500' : p.transactionStatus === 'cancelled' ? 'bg-slate-400' : 'bg-emerald-500',
      timestamp: new Date(p.paidAt || p.createdAt).getTime(),
    })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-6">
      <CustomerHeader
        custName={custName}
        custCode={custCode}
        custEmail={custEmail}
        custPhone={custPhone}
        createdAt={userObj.createdAt || customerObj.createdAt}
        salesExec={salesExec}
        navigate={navigate}
      />

      <CustomerFinancialStats
        totalPropertiesCount={totalPropertiesCount}
        activeBookingsCount={activeBookingsCount}
        completedBookingsCount={completedBookingsCount}
        cancelledBookingsCount={cancelledBookingsCount}
        totalBookingValue={totalBookingValue}
        totalPaid={totalPaid}
        totalOutstanding={totalOutstanding}
        totalRefunded={totalRefunded}
      />

      <PurchasedPropertiesTable
        bookings={bookings}
        custName={custName}
        navigate={navigate}
      />

      <CustomerPaymentsAndTimeline
        payments={payments}
        timelineEvents={timelineEvents}
        handleDownloadReceipt={handleDownloadReceipt}
        navigate={navigate}
      />

      <CustomerSiteVisits siteVisits={siteVisits} />

      <CustomerProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        custName={custName}
      />
    </div>
  );
}
