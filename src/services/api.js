import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL;
const baseURL = rawBase
  ? (rawBase.endsWith('/api') ? rawBase : `${rawBase.replace(/\/+$/, '')}/api`)
  : '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rts_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rts_token');
      localStorage.removeItem('rts_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
