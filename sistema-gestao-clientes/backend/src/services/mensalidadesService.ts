import { CaixaOrigem, CaixaTipo, FormaPagamento, MensalidadeStatus, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import { clientesRepository } from '../repositories/clientesRepository';
import { mensalidadesRepository, MensalidadeListFilters } from '../repositories/mensalidadesRepository';
import { ApiError } from '../utils/ApiError';
import { toDateOnly } from '../utils/format';

function parseDateOnly(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export const mensalidadesService = {
  async list(filters: MensalidadeListFilters) {
    const result = await mensalidadesRepository.list(filters);
    return {
      ...result,
      page: filters.page,
      perPage: filters.perPage,
    };
  },

  async getById(id: number) {
    const mensalidade = await mensalidadesRepository.findById(id);
    if (!mensalidade) throw new ApiError(404, 'Mensalidade não encontrada.');
    return mensalidade;
  },

  async create(input: {
    clienteId: number;
    competencia: string;
    vencimento: string;
    valor: number;
    status: MensalidadeStatus;
    observacoes?: string | null;
  }) {
    const cliente = await clientesRepository.findById(input.clienteId);
    if (!cliente) throw new ApiError(404, 'Cliente não encontrado.');

    return mensalidadesRepository.create({
      cliente: { connect: { id: input.clienteId } },
      competencia: parseDateOnly(input.competencia),
      vencimento: parseDateOnly(input.vencimento),
      valor: new Prisma.Decimal(input.valor),
      status: input.status,
      observacoes: input.observacoes || null,
    });
  },

  async update(id: number, input: Partial<{
    competencia: string;
    vencimento: string;
    valor: number;
    status: 'PENDENTE' | 'ATRASADO' | 'CANCELADO';
    observacoes: string | null;
  }>) {
    const mensalidade = await this.getById(id);
    if (mensalidade.status === 'PAGO') {
      throw new ApiError(409, 'Mensalidade paga não pode ser editada.');
    }

    return mensalidadesRepository.update(id, {
      ...(input.competencia !== undefined ? { competencia: parseDateOnly(input.competencia) } : {}),
      ...(input.vencimento !== undefined ? { vencimento: parseDateOnly(input.vencimento) } : {}),
      ...(input.valor !== undefined ? { valor: new Prisma.Decimal(input.valor) } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.observacoes !== undefined ? { observacoes: input.observacoes || null } : {}),
    });
  },

  async remove(id: number) {
    const mensalidade = await this.getById(id);
    if (mensalidade.status === 'PAGO') {
      throw new ApiError(409, 'Não é permitido excluir uma mensalidade já paga.');
    }
    await mensalidadesRepository.remove(id);
    return { deleted: true };
  },

  async pagar(id: number, input: { formaPagamento: FormaPagamento; pagoEm?: string; observacao?: string | null }) {
    const mensalidade = await prisma.mensalidade.findUnique({
      where: { id },
      include: { cliente: true, pagamento: true },
    });

    if (!mensalidade) throw new ApiError(404, 'Mensalidade não encontrada.');
    if (mensalidade.pagamento || mensalidade.status === 'PAGO') {
      throw new ApiError(409, 'Mensalidade já está marcada como paga.');
    }

    const pagoEm = input.pagoEm ? new Date(input.pagoEm) : new Date();

    return prisma.$transaction(async (tx) => {
      const mensalidadeAtualizada = await tx.mensalidade.update({
        where: { id },
        data: {
          status: 'PAGO',
          pagoEm,
          formaPagamento: input.formaPagamento,
        },
        include: { cliente: true },
      });

      const pagamento = await tx.pagamento.create({
        data: {
          mensalidadeId: mensalidade.id,
          clienteId: mensalidade.clienteId,
          valor: mensalidade.valor,
          pagoEm,
          formaPagamento: input.formaPagamento,
          observacao: input.observacao || null,
        },
      });

      const descricao = `Mensalidade ${mensalidade.cliente.nome} - ${toDateOnly(mensalidade.competencia)}`;

      const caixaTransacao = await tx.caixaTransacao.create({
        data: {
          tipo: CaixaTipo.ENTRADA,
          origem: CaixaOrigem.MENSALIDADE,
          descricao,
          valor: mensalidade.valor,
          dataTransacao: new Date(`${toDateOnly(pagoEm)}T00:00:00.000Z`),
          mensalidadeId: mensalidade.id,
        },
      });

      return { mensalidade: mensalidadeAtualizada, pagamento, caixaTransacao };
    });
  },
};
