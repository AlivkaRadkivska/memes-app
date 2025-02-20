import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
});
