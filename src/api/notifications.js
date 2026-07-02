import API from './axios';
export const getNotifications = (params) => API.get('/notifications', { params });
export const markAsRead = (id) => API.patch(`/notifications/${id}/read`);
export const markAllRead = () => API.patch('/notifications/read-all');
export const getUnreadCount = () => API.get('/notifications/unread-count');
