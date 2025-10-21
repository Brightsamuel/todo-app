// API client with Axios (now used in hook)
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor (future auth)
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const taskAPI = {
  getAll: () => apiClient.get('/tasks'),
  create: (task) => apiClient.post('/tasks', task),
  update: (id, updates) => apiClient.put(`/tasks/${id}`, updates),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
  reorder: (order) => apiClient.put('/tasks/reorder', { order })
};

export default apiClient;