import axios from 'axios';

// The baseURL is set to '/', which is the root of the server.
// The Vite proxy will correctly intercept calls starting with '/api'.
const api = axios.create({
    baseURL: '/api', 
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to include the auth token
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

