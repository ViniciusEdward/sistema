"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clienteQuerySchema = exports.clienteUpdateSchema = exports.clienteCreateSchema = void 0;
const zod_1 = require("zod");
exports.clienteCreateSchema = zod_1.z.object({
    nome: zod_1.z.string().trim().min(2).max(160),
    telefone: zod_1.z.string().trim().max(30).optional().nullable(),
    diaPagamento: zod_1.z.coerce.number().int().min(1).max(31),
    valor: zod_1.z.coerce.number().min(0),
    status: zod_1.z.enum(['ATIVO', 'INATIVO', 'INADIMPLENTE']).default('ATIVO'),
    observacoes: zod_1.z.string().trim().optional().nullable(),
});
exports.clienteUpdateSchema = exports.clienteCreateSchema.partial();
const emptyToUndefined = (value) => value === '' ? undefined : value;
exports.clienteQuerySchema = zod_1.z.object({
    search: zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional()),
    status: zod_1.z.preprocess(emptyToUndefined, zod_1.z.enum(['ATIVO', 'INATIVO', 'INADIMPLENTE']).optional()),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    perPage: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
