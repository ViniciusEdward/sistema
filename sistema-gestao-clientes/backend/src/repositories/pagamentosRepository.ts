import { prisma } from '../prisma/client';

export const pagamentosRepository = {
  async list(page = 1, perPage = 20) {
    const [data, total] = await Promise.all([
      prisma.pagamento.findMany({
        include: {
          cliente: true,
          mensalidade: true,
        },
        orderBy: { pagoEm: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.pagamento.count(),
    ]);

    return { data, total };
  },
};
