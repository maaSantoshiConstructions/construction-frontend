import API from './axios';
export const getDocuments = (params) => API.get('/documents', { params });
export const getDocument = (id) => API.get(`/documents/${id}`);
export const uploadDocument = (formData) => API.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const verifyDocument = (id) => API.patch(`/documents/${id}/verify`);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);
export const getMyDocuments = () => API.get('/documents/my-documents');
