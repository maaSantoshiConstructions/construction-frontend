import API from './axios';
export const getLeads = (params) => API.get('/leads', { params });
export const getLead = (id) => API.get(`/leads/${id}`);
export const createLead = (data) => API.post('/leads', data);
export const updateLead = (id, data) => API.put(`/leads/${id}`, data);
export const assignLead = (id, userId) => API.patch(`/leads/${id}/assign`, { userId });
export const getMyLeads = () => API.get('/leads/my-leads');
export const getLeadStats = () => API.get('/leads/stats');
export const addNote = (id, note) => API.post(`/leads/${id}/notes`, { note });
export const deleteLead = (id) => API.delete(`/leads/${id}`);
export const sendLeadEmail = (id, data) => {
  if (data instanceof FormData) {
    return API.post(`/leads/${id}/send-email`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return API.post(`/leads/${id}/send-email`, data);
};

