import API from './axios';

export const getReviews = (params) => API.get('/reviews', { params });
export const createReview = (data) => API.post('/reviews', data);
export const voteHelpful = (id) => API.post(`/reviews/${id}/helpful`);
