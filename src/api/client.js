import axios from 'axios';

// *** THE CRITICAL FIX IS HERE ***
// All API requests will now be correctly prefixed with /api,
// which allows the Nginx proxy to forward them to the backend.
const api = axios.create({
    baseURL: '/api', // Use the /api prefix for all requests
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

