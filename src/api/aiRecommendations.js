import API from './axios';
export const createRecommendation = (data) => API.post('/ai-recommendations', data);
