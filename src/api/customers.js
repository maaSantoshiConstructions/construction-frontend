import API from './axios';
export const getCustomers = (params) => API.get('/customers', { params });
