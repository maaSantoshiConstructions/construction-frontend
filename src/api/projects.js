import API from './axios';
export const getProjects = (params) => API.get('/projects', { params });
export const getProject = (slug) => API.get(`/projects/${slug}`);
export const createProject = (data) => API.post('/projects', data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const getProjectStats = (id) => API.get(`/projects/${id}/stats`);
export const uploadProjectImages = (id, formData) => API.put(`/projects/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
