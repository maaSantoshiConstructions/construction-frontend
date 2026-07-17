import API from './axios';

export const getMyReferrals = (params) => API.get('/referrals/my-referrals', { params });
export const createReferral = (data) => API.post('/referrals', data);
export default { getMyReferrals, createReferral };
