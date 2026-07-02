import API from './axios';
export const getBookings = (params) => API.get('/bookings', { params });
export const getBooking = (id) => API.get(`/bookings/${id}`);
export const createBooking = (data) => API.post('/bookings', data);
export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
export const getMyBookings = () => API.get('/bookings/my-bookings');
export const getBookingStats = () => API.get('/bookings/stats');
