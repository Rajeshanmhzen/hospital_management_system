import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1`;

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
