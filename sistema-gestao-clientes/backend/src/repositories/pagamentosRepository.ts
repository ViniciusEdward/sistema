import { prisma } from '../prisma/client';

export const pagamentosRepository = {
  async list(page = 1, perPage = 20) {
    // Sequencial para respeitar bancos MySQL com limite baixo de conexões.
    const data = await prisma.pagamento.findMany({
      include: {
        cliente: true,
        mensalidade: true,
      },
      orderBy: { pagoEm: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const total = await prisma.pagamento.count();

    return { data, total };
  },
};
