import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { prisma } from '../prisma/client';
import { toNumber } from '../utils/format';

export const dashboardService = {
  async get() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Consultas sequenciais para respeitar o limite baixo de conexões do MySQL/Clever Cloud.
    // Evita abrir várias conexões ao mesmo tempo em telas como Dashboard.
    const receitaMesAgg = await prisma.pagamento.aggregate({
      _sum: { valor: true },
      where: { pagoEm: { gte: monthStart, lte: monthEnd } },
    });

    const despesasMesAgg = await prisma.despesa.aggregate({
      _sum: { valor: true },
      where: { data: { gte: monthStart, lte: monthEnd } },
    });

    const clientesAtivos = await prisma.cliente.count({ where: { status: 'ATIVO' } });
    const clientesInadimplentes = await prisma.cliente.count({ where: { status: 'INADIMPLENTE' } });

    const cobrancasHoje = await prisma.mensalidade.count({
      where: {
        status: { in: ['PENDENTE', 'ATRASADO'] },
        vencimento: { gte: today, lt: tomorrow },
      },
    });

    const cobrancasAtrasadas = await prisma.mensalidade.count({
      where: {
        status: { in: ['PENDENTE', 'ATRASADO'] },
        vencimento: { lt: today },
      },
    });

    const ultimosPagamentos = await prisma.pagamento.findMany({
      include: { cliente: true, mensalidade: true },
      orderBy: { pagoEm: 'desc' },
      take: 5,
    });

    const receitaMes = toNumber(receitaMesAgg._sum.valor);
    const despesasMes = toNumber(despesasMesAgg._sum.valor);
    const lucro = receitaMes - despesasMes;

    const meses = Array.from({ length: 6 }, (_, index) => subMonths(now, 5 - index));
    const graficoMensal = [];

    for (const mes of meses) {
      const start = startOfMonth(mes);
      const end = endOfMonth(mes);

      const receita = await prisma.pagamento.aggregate({
        _sum: { valor: true },
        where: { pagoEm: { gte: start, lte: end } },
      });

      const despesas = await prisma.despesa.aggregate({
        _sum: { valor: true },
        where: { data: { gte: start, lte: end } },
      });

      const receitaValor = toNumber(receita._sum.valor);
      const despesasValor = toNumber(despesas._sum.valor);

      graficoMensal.push({
        mes: format(mes, 'MMM'),
        receita: receitaValor,
        despesas: despesasValor,
        lucro: receitaValor - despesasValor,
      });
    }

    return {
      receitaMes,
      lucro,
      clientesAtivos,
      clientesInadimplentes,
      cobrancasHoje,
      cobrancasAtrasadas,
      ultimosPagamentos,
      graficoMensal,
    };
  },
};
