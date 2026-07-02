import API from './axios';
export const getPlots = (params) => API.get('/plots', { params });
export const getPlot = (id) => API.get(`/plots/${id}`);
export const createPlot = (data) => API.post('/plots', data);
export const updatePlot = (id, data) => API.put(`/plots/${id}`, data);
export const deletePlot = (id) => API.delete(`/plots/${id}`);
export const getAvailablePlots = (params) => API.get('/plots/available', { params });
export const updatePlotStatus = (id, status) => API.patch(`/plots/${id}/status`, { status });
export const getPlotMapData = (params) => API.get('/plots/map', { params });
