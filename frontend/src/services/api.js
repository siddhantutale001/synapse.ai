import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer dev_mock_token'
  }
});

export function setupApiAuth(getToken) {
  api.interceptors.request.use(async (config) => {
    try {
      if (typeof getToken === 'function') {
        const token = await getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Failed to attach Clerk JWT token:', err.message);
    }
    return config;
  });
}

export default api;
