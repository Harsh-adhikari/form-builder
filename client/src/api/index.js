import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Forms
export const getForms    = ()          => API.get('/forms');
export const getForm     = (id)        => API.get(`/forms/${id}`);
export const createForm  = (data)      => API.post('/forms', data);
export const updateForm  = (id, data)  => API.put(`/forms/${id}`, data);
export const deleteForm  = (id)        => API.delete(`/forms/${id}`);

// Responses
export const submitResponse      = (data) => API.post('/responses', data);
export const getFormResponses    = (formId) => API.get(`/responses/${formId}`);
