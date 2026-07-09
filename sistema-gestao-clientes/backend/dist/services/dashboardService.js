"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const date_fns_1 = require("date-fns");
const client_1 = require("../prisma/client");
const format_1 = require("../utils/format");
exports.dashboardService = {
    async get() {
        const now = new Date();
        const monthStart = (0, date_fns_1.startOfMonth)(now);
        const monthEnd = (0, date_fns_1.endOfMonth)(now);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        // Consultas sequenciais para respeitar o limite baixo de conexões do MySQL/Clever Cloud.
        // Evita abrir várias conexões ao mesmo tempo em telas como Dashboard.
        const receitaMesAgg = await client_1.prisma.pagamento.aggregate({
            _sum: { valor: true },
            where: { pagoEm: { gte: monthStart, lte: monthEnd } },
        });
        const despesasMesAgg = await client_1.prisma.despesa.aggregate({
            _sum: { valor: true },
            where: { data: { gte: monthStart, lte: monthEnd } },
        });
        const clientesAtivos = await client_1.prisma.cliente.count({ where: { status: 'ATIVO' } });
        const clientesInadimplentes = await client_1.prisma.cliente.count({ where: { status: 'INADIMPLENTE' } });
        const cobrancasHoje = await client_1.prisma.mensalidade.count({
            where: {
                status: { in: ['PENDENTE', 'ATRASADO'] },
                vencimento: { gte: today, lt: tomorrow },
            },
        });
        const cobrancasAtrasadas = await client_1.prisma.mensalidade.count({
            where: {
                status: { in: ['PENDENTE', 'ATRASADO'] },
                vencimento: { lt: today },
            },
        });
        const ultimosPagamentos = await client_1.prisma.pagamento.findMany({
            include: { cliente: true, mensalidade: true },
            orderBy: { pagoEm: 'desc' },
            take: 5,
        });
        const receitaMes = (0, format_1.toNumber)(receitaMesAgg._sum.valor);
        const despesasMes = (0, format_1.toNumber)(despesasMesAgg._sum.valor);
        const lucro = receitaMes - despesasMes;
        const meses = Array.from({ length: 6 }, (_, index) => (0, date_fns_1.subMonths)(now, 5 - index));
        const graficoMensal = [];
        for (const mes of meses) {
            const start = (0, date_fns_1.startOfMonth)(mes);
            const end = (0, date_fns_1.endOfMonth)(mes);
            const receita = await client_1.prisma.pagamento.aggregate({
                _sum: { valor: true },
                where: { pagoEm: { gte: start, lte: end } },
            });
            const despesas = await client_1.prisma.despesa.aggregate({
                _sum: { valor: true },
                where: { data: { gte: start, lte: end } },
            });
            const receitaValor = (0, format_1.toNumber)(receita._sum.valor);
            const despesasValor = (0, format_1.toNumber)(despesas._sum.valor);
            graficoMensal.push({
                mes: (0, date_fns_1.format)(mes, 'MMM'),
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
