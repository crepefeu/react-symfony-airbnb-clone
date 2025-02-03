import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Add request interceptor to handle authentication
instance.interceptors.request.use((config) => {
    // You can add auth token here if needed
    return config;
});

// Add response interceptor to handle errors globally
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;
