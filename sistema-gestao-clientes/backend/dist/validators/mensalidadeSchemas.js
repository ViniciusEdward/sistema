"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagarMensalidadeSchema = exports.mensalidadeQuerySchema = exports.mensalidadeUpdateSchema = exports.mensalidadeCreateSchema = void 0;
const zod_1 = require("zod");
const isoDate = zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use formato YYYY-MM-DD.');
const emptyToUndefined = (value) => value === '' ? undefined : value;
exports.mensalidadeCreateSchema = zod_1.z.object({
    clienteId: zod_1.z.coerce.number().int().positive(),
    competencia: isoDate,
    vencimento: isoDate,
    valor: zod_1.z.coerce.number().min(0),
    status: zod_1.z.enum(['PENDENTE', 'ATRASADO', 'CANCELADO']).default('PENDENTE'),
    observacoes: zod_1.z.string().trim().optional().nullable(),
});
exports.mensalidadeUpdateSchema = zod_1.z.object({
    competencia: isoDate.optional(),
    vencimento: isoDate.optional(),
    valor: zod_1.z.coerce.number().min(0).optional(),
    status: zod_1.z.enum(['PENDENTE', 'ATRASADO', 'CANCELADO']).optional(),
    observacoes: zod_1.z.string().trim().optional().nullable(),
});
exports.mensalidadeQuerySchema = zod_1.z.object({
    search: zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional()),
    status: zod_1.z.preprocess(emptyToUndefined, zod_1.z.enum(['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO']).optional()),
    clienteId: zod_1.z.coerce.number().int().positive().optional(),
    inicio: zod_1.z.preprocess(emptyToUndefined, isoDate.optional()),
    fim: zod_1.z.preprocess(emptyToUndefined, isoDate.optional()),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    perPage: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
exports.pagarMensalidadeSchema = zod_1.z.object({
    formaPagamento: zod_1.z.enum(['PIX', 'DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'OUTRO']),
    pagoEm: zod_1.z.string().datetime().optional(),
    observacao: zod_1.z.string().trim().optional().nullable(),
});
