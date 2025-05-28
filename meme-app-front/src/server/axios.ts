import axios from 'axios';
import Cookies from 'universal-cookie';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const cookies = new Cookies();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
