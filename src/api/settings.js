import API from './axios';
export const getSettings = () => API.get('/settings');
export const updateSetting = (key, value) => API.put('/settings', { key, value });
