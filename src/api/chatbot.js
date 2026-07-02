import API from './axios';
export const sendChatMessage = (data) => API.post('/chatbot', data);
export const getConversation = (sessionId) => API.get(`/chatbot/conversation/${sessionId}`);
