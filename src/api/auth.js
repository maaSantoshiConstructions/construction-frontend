import API from './axios';

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const verifyEmail = (token) => API.get(`/auth/verify-email/${token}`);
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.put(`/auth/reset-password/${token}`, { password });
export const refreshToken = (token) => API.post('/auth/refresh-token', { refreshToken: token });
export const logoutUser = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const updatePassword = (data) => API.put('/auth/update-password', data);
export const updateProfile = (data) => API.put('/auth/update-profile', data);
