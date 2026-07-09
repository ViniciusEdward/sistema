"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagamentosRepository = void 0;
const client_1 = require("../prisma/client");
exports.pagamentosRepository = {
    async list(page = 1, perPage = 20) {
        // Sequencial para respeitar bancos MySQL com limite baixo de conexões.
        const data = await client_1.prisma.pagamento.findMany({
            include: {
                cliente: true,
                mensalidade: true,
            },
            orderBy: { pagoEm: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        });
        const total = await client_1.prisma.pagamento.count();
        return { data, total };
    },
};
