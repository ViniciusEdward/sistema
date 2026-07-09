import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { clearAccessToken, getAccessToken } from './tokenStorage';

const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
let isHandlingUnauthorized = false;

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 20000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Erro ao se comunicar com o servidor.';

    if (status === 401) {
      const isAuthCheck = error.config?.url?.includes('/auth/me');

      if (!isAuthCheck && !isHandlingUnauthorized) {
        isHandlingUnauthorized = true;
        clearAccessToken();
        window.dispatchEvent(new Event('sgc:unauthorized'));
        toast.error('Sessão expirada. Faça login novamente.');
        window.setTimeout(() => {
          isHandlingUnauthorized = false;
        }, 1000);
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);
