"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientesRepository = void 0;
const client_1 = require("../prisma/client");
function whereFromFilters(filters) {
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
exports.clientesRepository = {
    async list(filters) {
        const where = whereFromFilters(filters);
        // Sequencial para respeitar bancos MySQL com limite baixo de conexões.
        const data = await client_1.prisma.cliente.findMany({
            where,
            orderBy: { nome: 'asc' },
            skip: (filters.page - 1) * filters.perPage,
            take: filters.perPage,
        });
        const total = await client_1.prisma.cliente.count({ where });
        return { data, total };
    },
    findById(id) {
        return client_1.prisma.cliente.findUnique({
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
    create(data) {
        return client_1.prisma.cliente.create({ data });
    },
    update(id, data) {
        return client_1.prisma.cliente.update({ where: { id }, data });
    },
    async removeWithDependencies(id) {
        return client_1.prisma.$transaction(async (tx) => {
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
