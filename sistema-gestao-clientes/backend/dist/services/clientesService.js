"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientesService = void 0;
const client_1 = require("@prisma/client");
const clientesRepository_1 = require("../repositories/clientesRepository");
const ApiError_1 = require("../utils/ApiError");
exports.clientesService = {
    async list(filters) {
        const result = await clientesRepository_1.clientesRepository.list(filters);
        return {
            ...result,
            page: filters.page,
            perPage: filters.perPage,
        };
    },
    async getById(id) {
        const cliente = await clientesRepository_1.clientesRepository.findById(id);
        if (!cliente)
            throw new ApiError_1.ApiError(404, 'Cliente não encontrado.');
        return cliente;
    },
    create(input) {
        return clientesRepository_1.clientesRepository.create({
            nome: input.nome,
            telefone: input.telefone || null,
            diaPagamento: input.diaPagamento,
            valor: new client_1.Prisma.Decimal(input.valor),
            status: input.status,
            observacoes: input.observacoes || null,
        });
    },
    async update(id, input) {
        await this.getById(id);
        return clientesRepository_1.clientesRepository.update(id, {
            ...(input.nome !== undefined ? { nome: input.nome } : {}),
            ...(input.telefone !== undefined ? { telefone: input.telefone || null } : {}),
            ...(input.diaPagamento !== undefined ? { diaPagamento: input.diaPagamento } : {}),
            ...(input.valor !== undefined ? { valor: new client_1.Prisma.Decimal(input.valor) } : {}),
            ...(input.status !== undefined ? { status: input.status } : {}),
            ...(input.observacoes !== undefined ? { observacoes: input.observacoes || null } : {}),
        });
    },
    async remove(id) {
        await this.getById(id);
        await clientesRepository_1.clientesRepository.removeWithDependencies(id);
        return { deleted: true };
    },
};
