import { api } from './api';
import { ApiDataResponse, Usuario } from '../types';

export const authService = {
  async login(email: string, senha: string) {
    const { data } = await api.post<ApiDataResponse<Usuario>>('/auth/login', { email, senha });
    return data.data;
  },

  async me() {
    const { data } = await api.get<ApiDataResponse<Usuario>>('/auth/me');
    return data.data;
  },

  async logout() {
    await api.post('/auth/logout');
  },
};
