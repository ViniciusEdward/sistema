import { ClienteStatus, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';

export type ClienteListFilters = {
  search?: string;
  status?: ClienteStatus;
  page: number;
  perPage: number;
};

function whereFromFilters(filters: ClienteListFilters): Prisma.ClienteWhereInput {
  return {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.search
      ? {
          OR: [
            { nome: { contains: filters.search } },
            { telefone: { contains: filters.search } },
          ],
        }
      : {}),
  };
}

export const clientesRepository = {
  async list(filters: ClienteListFilters) {
    const where = whereFromFilters(filters);
    const [data, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip: (filters.page - 1) * filters.perPage,
        take: filters.perPage,
      }),
      prisma.cliente.count({ where }),
    ]);

    return { data, total };
  },

  findById(id: number) {
    return prisma.cliente.findUnique({ where: { id } });
  },

  create(data: Prisma.ClienteCreateInput) {
    return prisma.cliente.create({ data });
  },

  update(id: number, data: Prisma.ClienteUpdateInput) {
    return prisma.cliente.update({ where: { id }, data });
  },

  remove(id: number) {
    return prisma.cliente.delete({ where: { id } });
  },
};
