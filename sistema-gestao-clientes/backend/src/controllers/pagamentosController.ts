import { Request, Response } from 'express';
import { z } from 'zod';
import { pagamentosService } from '../services/pagamentosService';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export const pagamentosController = {
  async list(req: Request, res: Response) {
    const query = querySchema.parse(req.query);
    const result = await pagamentosService.list(query.page, query.perPage);
    return res.json({ success: true, ...result, page: query.page, perPage: query.perPage });
  },
};
