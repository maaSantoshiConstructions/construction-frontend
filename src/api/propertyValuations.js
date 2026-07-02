import API from './axios';
export const createValuation = (data) => API.post('/property-valuations', data);
