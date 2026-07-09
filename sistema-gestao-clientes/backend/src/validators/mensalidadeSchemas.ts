import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use formato YYYY-MM-DD.');
const emptyToUndefined = (value: unknown) => value === '' ? undefined : value;

export const mensalidadeCreateSchema = z.object({
  clienteId: z.coerce.number().int().positive(),
  competencia: isoDate,
  vencimento: isoDate,
  valor: z.coerce.number().min(0),
  status: z.enum(['PENDENTE', 'ATRASADO', 'CANCELADO']).default('PENDENTE'),
  observacoes: z.string().trim().optional().nullable(),
});

export const mensalidadeUpdateSchema = z.object({
  competencia: isoDate.optional(),
  vencimento: isoDate.optional(),
  valor: z.coerce.number().min(0).optional(),
  status: z.enum(['PENDENTE', 'ATRASADO', 'CANCELADO']).optional(),
  observacoes: z.string().trim().optional().nullable(),
});

export const mensalidadeQuerySchema = z.object({
  search: z.preprocess(emptyToUndefined, z.string().optional()),
  status: z.preprocess(emptyToUndefined, z.enum(['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO']).optional()),
  clienteId: z.coerce.number().int().positive().optional(),
  inicio: z.preprocess(emptyToUndefined, isoDate.optional()),
  fim: z.preprocess(emptyToUndefined, isoDate.optional()),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export const pagarMensalidadeSchema = z.object({
  formaPagamento: z.enum(['PIX', 'DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'OUTRO']),
  pagoEm: z.string().datetime().optional(),
  observacao: z.string().trim().optional().nullable(),
});
