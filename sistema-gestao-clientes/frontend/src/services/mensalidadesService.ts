import { api } from './api';
import { ApiDataResponse, ApiListResponse, FormaPagamento, Mensalidade, MensalidadeStatus } from '../types';

export type MensalidadeInput = {
  clienteId: number;
  competencia: string;
  vencimento: string;
  valor: number;
  status: Exclude<MensalidadeStatus, 'PAGO'>;
  observacoes?: string;
};

export const mensalidadesService = {
  async list(params?: { search?: string; status?: MensalidadeStatus | ''; page?: number; perPage?: number; inicio?: string; fim?: string }) {
    const { data } = await api.get<ApiListResponse<Mensalidade>>('/mensalidades', { params });
    return data;
  },

  async create(input: MensalidadeInput) {
    const { data } = await api.post<ApiDataResponse<Mensalidade>>('/mensalidades', input);
    return data.data;
  },

  async update(id: number, input: Partial<Omit<MensalidadeInput, 'clienteId'>>) {
    const { data } = await api.put<ApiDataResponse<Mensalidade>>(`/mensalidades/${id}`, input);
    return data.data;
  },

  async remove(id: number) {
    await api.delete(`/mensalidades/${id}`);
  },

  async pagar(id: number, input: { formaPagamento: FormaPagamento; pagoEm?: string; observacao?: string }) {
    const { data } = await api.post(`/mensalidades/${id}/pagar`, input);
    return data.data;
  },
};
