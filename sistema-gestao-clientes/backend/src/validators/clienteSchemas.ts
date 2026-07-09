import { z } from 'zod';

export const clienteCreateSchema = z.object({
  nome: z.string().trim().min(2).max(160),
  telefone: z.string().trim().max(30).optional().nullable(),
  diaPagamento: z.coerce.number().int().min(1).max(31),
  valor: z.coerce.number().min(0),
  status: z.enum(['ATIVO', 'INATIVO', 'INADIMPLENTE']).default('ATIVO'),
  observacoes: z.string().trim().optional().nullable(),
});

export const clienteUpdateSchema = clienteCreateSchema.partial();

const emptyToUndefined = (value: unknown) => value === '' ? undefined : value;

export const clienteQuerySchema = z.object({
  search: z.preprocess(emptyToUndefined, z.string().optional()),
  status: z.preprocess(emptyToUndefined, z.enum(['ATIVO', 'INATIVO', 'INADIMPLENTE']).optional()),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});
