import API from './axios';
export const getSiteVisits = (params) => API.get('/site-visits', { params });
export const getSiteVisit = (id) => API.get(`/site-visits/${id}`);
export const createSiteVisit = (data) => API.post('/site-visits', data);
export const updateSiteVisit = (id, data) => API.put(`/site-visits/${id}`, data);
export const confirmVisit = (id) => API.patch(`/site-visits/${id}/confirm`);
export const completeVisit = (id) => API.patch(`/site-visits/${id}/complete`);
export const getMyVisits = () => API.get('/site-visits/my-visits');
export const getVisitStats = () => API.get('/site-visits/stats');
