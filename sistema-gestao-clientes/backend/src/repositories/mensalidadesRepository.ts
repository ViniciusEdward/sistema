import { MensalidadeStatus, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';

export type MensalidadeListFilters = {
  search?: string;
  status?: MensalidadeStatus;
  clienteId?: number;
  inicio?: Date;
  fim?: Date;
  page: number;
  perPage: number;
};

function whereFromFilters(filters: MensalidadeListFilters): Prisma.MensalidadeWhereInput {
  return {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.clienteId ? { clienteId: filters.clienteId } : {}),
    ...(filters.inicio || filters.fim
      ? {
          vencimento: {
            ...(filters.inicio ? { gte: filters.inicio } : {}),
            ...(filters.fim ? { lte: filters.fim } : {}),
          },
        }
      : {}),
    ...(filters.search
      ? {
          cliente: {
            nome: { contains: filters.search },
          },
        }
      : {}),
  };
}

export const mensalidadesRepository = {
  async list(filters: MensalidadeListFilters) {
    const where = whereFromFilters(filters);
    const [data, total] = await Promise.all([
      prisma.mensalidade.findMany({
        where,
        include: { cliente: true, pagamento: true },
        orderBy: [{ vencimento: 'asc' }, { id: 'desc' }],
        skip: (filters.page - 1) * filters.perPage,
        take: filters.perPage,
      }),
      prisma.mensalidade.count({ where }),
    ]);

    return { data, total };
  },

  findById(id: number) {
    return prisma.mensalidade.findUnique({
      where: { id },
      include: { cliente: true, pagamento: true },
    });
  },

  create(data: Prisma.MensalidadeCreateInput) {
    return prisma.mensalidade.create({ data, include: { cliente: true } });
  },

  update(id: number, data: Prisma.MensalidadeUpdateInput) {
    return prisma.mensalidade.update({ where: { id }, data, include: { cliente: true, pagamento: true } });
  },

  remove(id: number) {
    return prisma.mensalidade.delete({ where: { id } });
  },
};
