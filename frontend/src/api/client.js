import axios from 'axios';

const API_BASE = "https://agrichain-sjcf.onrender.com/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrichain_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('agrichain_token');
      localStorage.removeItem('agrichain_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
