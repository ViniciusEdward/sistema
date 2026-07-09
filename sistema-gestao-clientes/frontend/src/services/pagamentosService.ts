import { api } from './api';
import { ApiListResponse, Pagamento } from '../types';

export const pagamentosService = {
  async list(params?: { page?: number; perPage?: number }) {
    const { data } = await api.get<ApiListResponse<Pagamento>>('/pagamentos', { params });
    return data;
  },
};
