import { Request, Response } from 'express';
import { clientesService } from '../services/clientesService';
import { clienteCreateSchema, clienteQuerySchema, clienteUpdateSchema } from '../validators/clienteSchemas';

export const clientesController = {
  async list(req: Request, res: Response) {
    const filters = clienteQuerySchema.parse(req.query);
    const result = await clientesService.list(filters);
    return res.json({ success: true, ...result });
  },

  async getById(req: Request, res: Response) {
    const cliente = await clientesService.getById(Number(req.params.id));
    return res.json({ success: true, data: cliente });
  },

  async create(req: Request, res: Response) {
    const data = clienteCreateSchema.parse(req.body);
    const cliente = await clientesService.create(data);
    return res.status(201).json({ success: true, data: cliente });
  },

  async update(req: Request, res: Response) {
    const data = clienteUpdateSchema.parse(req.body);
    const cliente = await clientesService.update(Number(req.params.id), data);
    return res.json({ success: true, data: cliente });
  },

  async remove(req: Request, res: Response) {
    const result = await clientesService.remove(Number(req.params.id));
    return res.json({ success: true, data: result });
  },
};
