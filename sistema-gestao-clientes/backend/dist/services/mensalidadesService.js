"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mensalidadesService = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("../prisma/client");
const clientesRepository_1 = require("../repositories/clientesRepository");
const mensalidadesRepository_1 = require("../repositories/mensalidadesRepository");
const ApiError_1 = require("../utils/ApiError");
const format_1 = require("../utils/format");
function parseDateOnly(date) {
    return new Date(`${date}T00:00:00.000Z`);
}
exports.mensalidadesService = {
    async list(filters) {
        const result = await mensalidadesRepository_1.mensalidadesRepository.list(filters);
        return {
            ...result,
            page: filters.page,
            perPage: filters.perPage,
        };
    },
    async getById(id) {
        const mensalidade = await mensalidadesRepository_1.mensalidadesRepository.findById(id);
        if (!mensalidade)
            throw new ApiError_1.ApiError(404, 'Mensalidade não encontrada.');
        return mensalidade;
    },
    async create(input) {
        const cliente = await clientesRepository_1.clientesRepository.findById(input.clienteId);
        if (!cliente)
            throw new ApiError_1.ApiError(404, 'Cliente não encontrado.');
        return mensalidadesRepository_1.mensalidadesRepository.create({
            cliente: { connect: { id: input.clienteId } },
            competencia: parseDateOnly(input.competencia),
            vencimento: parseDateOnly(input.vencimento),
            valor: new client_1.Prisma.Decimal(input.valor),
            status: input.status,
            observacoes: input.observacoes || null,
        });
    },
    async update(id, input) {
        const mensalidade = await this.getById(id);
        if (mensalidade.status === 'PAGO') {
            throw new ApiError_1.ApiError(409, 'Mensalidade paga não pode ser editada.');
        }
        return mensalidadesRepository_1.mensalidadesRepository.update(id, {
            ...(input.competencia !== undefined ? { competencia: parseDateOnly(input.competencia) } : {}),
            ...(input.vencimento !== undefined ? { vencimento: parseDateOnly(input.vencimento) } : {}),
            ...(input.valor !== undefined ? { valor: new client_1.Prisma.Decimal(input.valor) } : {}),
            ...(input.status !== undefined ? { status: input.status } : {}),
            ...(input.observacoes !== undefined ? { observacoes: input.observacoes || null } : {}),
        });
    },
    async remove(id) {
        const mensalidade = await this.getById(id);
        if (mensalidade.status === 'PAGO') {
            throw new ApiError_1.ApiError(409, 'Não é permitido excluir uma mensalidade já paga.');
        }
        await mensalidadesRepository_1.mensalidadesRepository.remove(id);
        return { deleted: true };
    },
    async pagar(id, input) {
        const mensalidade = await client_2.prisma.mensalidade.findUnique({
            where: { id },
            include: { cliente: true, pagamento: true },
        });
        if (!mensalidade)
            throw new ApiError_1.ApiError(404, 'Mensalidade não encontrada.');
        if (mensalidade.pagamento || mensalidade.status === 'PAGO') {
            throw new ApiError_1.ApiError(409, 'Mensalidade já está marcada como paga.');
        }
        const pagoEm = input.pagoEm ? new Date(input.pagoEm) : new Date();
        return client_2.prisma.$transaction(async (tx) => {
            const mensalidadeAtualizada = await tx.mensalidade.update({
                where: { id },
                data: {
                    status: 'PAGO',
                    pagoEm,
                    formaPagamento: input.formaPagamento,
                },
                include: { cliente: true },
            });
            const pagamento = await tx.pagamento.create({
                data: {
                    mensalidadeId: mensalidade.id,
                    clienteId: mensalidade.clienteId,
                    valor: mensalidade.valor,
                    pagoEm,
                    formaPagamento: input.formaPagamento,
                    observacao: input.observacao || null,
                },
            });
            const descricao = `Mensalidade ${mensalidade.cliente.nome} - ${(0, format_1.toDateOnly)(mensalidade.competencia)}`;
            const caixaTransacao = await tx.caixaTransacao.create({
                data: {
                    tipo: client_1.CaixaTipo.ENTRADA,
                    origem: client_1.CaixaOrigem.MENSALIDADE,
                    descricao,
                    valor: mensalidade.valor,
                    dataTransacao: new Date(`${(0, format_1.toDateOnly)(pagoEm)}T00:00:00.000Z`),
                    mensalidadeId: mensalidade.id,
                },
            });
            return { mensalidade: mensalidadeAtualizada, pagamento, caixaTransacao };
        });
    },
};
