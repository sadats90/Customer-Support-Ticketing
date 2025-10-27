import api from './axios';

export const ticketsAPI = {
  getAll: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },
  
  getOne: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/tickets', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
};

export const commentsAPI = {
  create: async (data) => {
    const response = await api.post('/comments', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};
