import API from './axios';
export const getPartners = (params) => API.get('/channel-partners', { params });
export const verifyPartner = (id) => API.patch(`/channel-partners/${id}/verify`);
