import API from './axios';
export const getUpdates = (params) => API.get('/construction-updates', { params });
export const getUpdate = (id) => API.get(`/construction-updates/${id}`);
export const createUpdate = (data) => API.post('/construction-updates', data);
export const updateUpdate = (id, data) => API.put(`/construction-updates/${id}`, data);
export const deleteUpdate = (id) => API.delete(`/construction-updates/${id}`);
export const getProjectUpdates = (projectId) => API.get(`/construction-updates/project/${projectId}`);
export const getMyPlotUpdates = () => API.get('/construction-updates/my-plot');
