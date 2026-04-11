import axios from 'axios';

const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.hostname}:8080/api/v1`;
    }
    return 'http://localhost:8080/api/v1';
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
});

// Add interceptors for auth if needed later
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;

        if (status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await api.post('/auth/refresh');
                const newAccessToken = refreshResponse?.data?.data?.accessToken;

                if (newAccessToken) {
                    localStorage.setItem('token', newAccessToken);
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return api(originalRequest);
            } catch {
                localStorage.removeItem('token');
            }
        }

        return Promise.reject(error);
    }
);

export default api;
