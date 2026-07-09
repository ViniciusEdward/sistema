import { api } from './api';
import { ApiDataResponse, Usuario } from '../types';
import { clearAccessToken, setAccessToken } from './tokenStorage';

type LoginResponse = {
  usuario: Usuario;
  token: string;
};

export const authService = {
  async login(email: string, senha: string) {
    const { data } = await api.post<ApiDataResponse<LoginResponse>>('/auth/login', { email, senha });
    setAccessToken(data.data.token);
    return data.data.usuario;
  },

  async me() {
    const { data } = await api.get<ApiDataResponse<Usuario>>('/auth/me');
    return data.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAccessToken();
    }
  },
};
