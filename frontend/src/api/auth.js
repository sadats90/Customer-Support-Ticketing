import api from './axios';

export const authAPI = {
  register: async (data) => {
    const response = await api.post('/register', data);
    return response.data;
  },
  login: async (data) => {
    const response = await api.post('/login', data);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
}; 