import API from './axios';
export const getGalleryItems = (params) => API.get('/gallery', { params });
export const getGalleryItem = (id) => API.get(`/gallery/${id}`);
export const createGalleryItem = (formData) => API.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateGalleryItem = (id, data) => API.put(`/gallery/${id}`, data);
export const deleteGalleryItem = (id) => API.delete(`/gallery/${id}`);
