import API from './axios';
export const getPayments = (params) => API.get('/payments', { params });
export const getPayment = (id) => API.get(`/payments/${id}`);
export const createPayment = (data) => API.post('/payments', data);
export const getBookingPayments = (bookingId) => API.get(`/payments/booking/${bookingId}`);
export const getMyPayments = () => API.get('/payments/my-payments');
export const downloadInvoice = (id) => API.get(`/payments/${id}/invoice`, { responseType: 'blob' });
export const getPaymentStats = () => API.get('/payments/stats');
