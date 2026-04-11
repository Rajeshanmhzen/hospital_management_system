import axios from 'axios';

const getApiUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
    }
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.hostname}:8080/api/v1`;
    }
    return 'http://localhost:8080/api/v1';
};

const API_URL = getApiUrl();

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);
