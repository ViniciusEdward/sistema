"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mensalidadesRepository = void 0;
const client_1 = require("../prisma/client");
function whereFromFilters(filters) {
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
exports.mensalidadesRepository = {
    async list(filters) {
        const where = whereFromFilters(filters);
        // Sequencial para respeitar bancos MySQL com limite baixo de conexões.
        const data = await client_1.prisma.mensalidade.findMany({
            where,
            include: { cliente: true, pagamento: true },
            orderBy: [{ vencimento: 'asc' }, { id: 'desc' }],
            skip: (filters.page - 1) * filters.perPage,
            take: filters.perPage,
        });
        const total = await client_1.prisma.mensalidade.count({ where });
        return { data, total };
    },
    findById(id) {
        return client_1.prisma.mensalidade.findUnique({
            where: { id },
            include: { cliente: true, pagamento: true, caixaTransacao: true },
        });
    },
    create(data) {
        return client_1.prisma.mensalidade.create({ data, include: { cliente: true } });
    },
    update(id, data) {
        return client_1.prisma.mensalidade.update({ where: { id }, data, include: { cliente: true, pagamento: true } });
    },
    remove(id) {
        return client_1.prisma.mensalidade.delete({ where: { id } });
    },
};
