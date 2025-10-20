// API client prepared for backend integration (Axios-based)
// For now, this is a placeholder; swap localStorage in hook with these calls later
import axios from 'axios'; // Install axios if using backend: npm install axios

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth/tokens (future-proof)
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    // Could show toast notification here
    return Promise.reject(error);
  }
);

export const taskAPI = {
  getAll: () => apiClient.get('/tasks'),
  create: (task) => apiClient.post('/tasks', task),
  update: (id, task) => apiClient.put(`/tasks/${id}`, task),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
  reorder: (order) => apiClient.put('/tasks/reorder', { order }) // For drag-drop
};

export default apiClient;