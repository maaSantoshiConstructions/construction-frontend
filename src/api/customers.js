import API from './axios';

export const getCustomers = (params) => API.get('/customers', { params });
export const getCustomer = (id) => API.get(`/customers/${id}`);
export const getCustomerPurchases = (id) => API.get(`/customers/${id}/purchases`);
