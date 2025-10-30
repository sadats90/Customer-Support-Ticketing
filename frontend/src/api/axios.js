import axios from 'axios';

// Determine API URL: Use environment variable if set, otherwise detect development vs production
const getApiUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development (when running npm run dev), use localhost
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'http://localhost:8000/api';
  }
  
  // In production, use the production URL
  return 'https://ticket.shahriarsadat.com/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
