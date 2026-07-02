import API from './axios';
export const getAdminDashboard = () => API.get('/dashboard/admin');
export const getSalesDashboard = () => API.get('/dashboard/sales');
export const getCustomerDashboard = () => API.get('/dashboard/customer');
export const getPartnerDashboard = () => API.get('/dashboard/partner');
