import { api } from './api';
import { ApiDataResponse, ApiListResponse, Cliente, ClienteStatus } from '../types';

export type ClienteInput = {
  nome: string;
  telefone?: string;
  diaPagamento: number;
  valor: number;
  status: ClienteStatus;
  observacoes?: string;
};

export const clientesService = {
  async list(params?: { search?: string; status?: ClienteStatus | ''; page?: number; perPage?: number }) {
    const { data } = await api.get<ApiListResponse<Cliente>>('/clientes', { params });
    return data;
  },

  async create(input: ClienteInput) {
    const { data } = await api.post<ApiDataResponse<Cliente>>('/clientes', input);
    return data.data;
  },

  async update(id: number, input: Partial<ClienteInput>) {
    const { data } = await api.put<ApiDataResponse<Cliente>>(`/clientes/${id}`, input);
    return data.data;
  },

  async remove(id: number) {
    await api.delete(`/clientes/${id}`);
  },
};
