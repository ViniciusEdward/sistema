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

    // Sequencial para respeitar bancos MySQL com limite baixo de conexões.
    const data = await prisma.cliente.findMany({
      where,
      orderBy: { nome: 'asc' },
      skip: (filters.page - 1) * filters.perPage,
      take: filters.perPage,
    });

    const total = await prisma.cliente.count({ where });

    return { data, total };
  },

  findById(id: number) {
    return prisma.cliente.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            mensalidades: true,
            pagamentos: true,
          },
        },
      },
    });
  },

  create(data: Prisma.ClienteCreateInput) {
    return prisma.cliente.create({ data });
  },

  update(id: number, data: Prisma.ClienteUpdateInput) {
    return prisma.cliente.update({ where: { id }, data });
  },

  async removeWithDependencies(id: number) {
    return prisma.$transaction(async (tx) => {
      const mensalidades = await tx.mensalidade.findMany({
        where: { clienteId: id },
        select: { id: true },
      });

      const mensalidadeIds = mensalidades.map((mensalidade) => mensalidade.id);

      if (mensalidadeIds.length > 0) {
        await tx.caixaTransacao.deleteMany({
          where: { mensalidadeId: { in: mensalidadeIds } },
        });

        await tx.pagamento.deleteMany({
          where: { mensalidadeId: { in: mensalidadeIds } },
        });

        await tx.mensalidade.deleteMany({
          where: { id: { in: mensalidadeIds } },
        });
      }

      // Garante remoção de pagamentos órfãos por cliente, caso existam por inconsistência antiga.
      await tx.pagamento.deleteMany({ where: { clienteId: id } });

      return tx.cliente.delete({ where: { id } });
    });
  },
};
