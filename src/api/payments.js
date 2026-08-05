import API from './axios';

export const getPayments = (params) => API.get('/payments', { params });
export const getPayment = (id) => API.get(`/payments/${id}`);
export const getBookingPayments = (bookingId) => API.get(`/payments/booking/${bookingId}`);
export const getMyPayments = () => API.get('/payments/my-payments');
export const getPaymentStats = () => API.get('/payments/stats');

// Create payment
export const createPayment = (data) => API.post('/payments', data);

// Receipt / invoice download
export const downloadReceipt = (id) =>
  API.get(`/payments/${id}/receipt`, { responseType: 'blob' });
export const downloadInvoice = (id) =>
  API.get(`/payments/${id}/invoice`, { responseType: 'blob' });

// Payment lifecycle — no permanent deletion
export const cancelPayment = (id, data) => API.patch(`/payments/${id}/cancel`, data);
export const refundPayment = (id, data) => API.patch(`/payments/${id}/refund`, data);
