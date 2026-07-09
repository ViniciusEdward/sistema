import { Prisma } from '@prisma/client';
import { clientesRepository, ClienteListFilters } from '../repositories/clientesRepository';
import { ApiError } from '../utils/ApiError';

export const clientesService = {
  async list(filters: ClienteListFilters) {
    const result = await clientesRepository.list(filters);
    return {
      ...result,
      page: filters.page,
      perPage: filters.perPage,
    };
  },

  async getById(id: number) {
    const cliente = await clientesRepository.findById(id);
    if (!cliente) throw new ApiError(404, 'Cliente não encontrado.');
    return cliente;
  },

  create(input: {
    nome: string;
    telefone?: string | null;
    diaPagamento: number;
    valor: number;
    status: 'ATIVO' | 'INATIVO' | 'INADIMPLENTE';
    observacoes?: string | null;
  }) {
    return clientesRepository.create({
      nome: input.nome,
      telefone: input.telefone || null,
      diaPagamento: input.diaPagamento,
      valor: new Prisma.Decimal(input.valor),
      status: input.status,
      observacoes: input.observacoes || null,
    });
  },

  async update(id: number, input: Partial<{
    nome: string;
    telefone: string | null;
    diaPagamento: number;
    valor: number;
    status: 'ATIVO' | 'INATIVO' | 'INADIMPLENTE';
    observacoes: string | null;
  }>) {
    await this.getById(id);
    return clientesRepository.update(id, {
      ...(input.nome !== undefined ? { nome: input.nome } : {}),
      ...(input.telefone !== undefined ? { telefone: input.telefone || null } : {}),
      ...(input.diaPagamento !== undefined ? { diaPagamento: input.diaPagamento } : {}),
      ...(input.valor !== undefined ? { valor: new Prisma.Decimal(input.valor) } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.observacoes !== undefined ? { observacoes: input.observacoes || null } : {}),
    });
  },

  async remove(id: number) {
    await this.getById(id);
    await clientesRepository.removeWithDependencies(id);
    return { deleted: true };
  },
};
