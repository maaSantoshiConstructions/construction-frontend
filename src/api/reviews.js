import API from './axios';
export const getReviews = (params) => API.get('/reviews', { params });
export const getReview = (id) => API.get(`/reviews/${id}`);
export const createReview = (data) => API.post('/reviews', data);
export const approveReview = (id) => API.patch(`/reviews/${id}/approve`);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);
export const getProjectReviews = (projectId) => API.get(`/reviews/project/${projectId}`);
