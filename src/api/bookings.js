import API from './axios';

export const getBookings = (params) => API.get('/bookings', { params });
export const getBooking = (id) => API.get(`/bookings/${id}`);
export const getBookingDetails = (id) => API.get(`/bookings/${id}/details`);
export const getBookingPaymentSummary = (id) => API.get(`/bookings/${id}/payment-summary`);
export const createBooking = (data) => {
  const isFormData = data instanceof FormData;
  return API.post('/bookings', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
};
export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
export const getMyBookings = () => API.get('/bookings/my-bookings');
export const getBookingStats = () => API.get('/bookings/stats');

// Super Admin only
export const updatePaymentPlan = (id, data) => API.patch(`/bookings/${id}/payment-plan`, data);
