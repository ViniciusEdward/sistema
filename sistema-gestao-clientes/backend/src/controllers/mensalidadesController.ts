import { Request, Response } from 'express';
import { MensalidadeStatus } from '@prisma/client';
import { mensalidadesService } from '../services/mensalidadesService';
import { mensalidadeCreateSchema, mensalidadeQuerySchema, mensalidadeUpdateSchema, pagarMensalidadeSchema } from '../validators/mensalidadeSchemas';

function parseDateMaybe(value?: string) {
  return value ? new Date(`${value}T00:00:00.000Z`) : undefined;
}

export const mensalidadesController = {
  async list(req: Request, res: Response) {
    const query = mensalidadeQuerySchema.parse(req.query);
    const result = await mensalidadesService.list({
      ...query,
      status: query.status as MensalidadeStatus | undefined,
      inicio: parseDateMaybe(query.inicio),
      fim: parseDateMaybe(query.fim),
    });
    return res.json({ success: true, ...result });
  },

  async getById(req: Request, res: Response) {
    const mensalidade = await mensalidadesService.getById(Number(req.params.id));
    return res.json({ success: true, data: mensalidade });
  },

  async create(req: Request, res: Response) {
    const data = mensalidadeCreateSchema.parse(req.body);
    const mensalidade = await mensalidadesService.create(data);
    return res.status(201).json({ success: true, data: mensalidade });
  },

  async update(req: Request, res: Response) {
    const data = mensalidadeUpdateSchema.parse(req.body);
    const mensalidade = await mensalidadesService.update(Number(req.params.id), data);
    return res.json({ success: true, data: mensalidade });
  },

  async remove(req: Request, res: Response) {
    const result = await mensalidadesService.remove(Number(req.params.id));
    return res.json({ success: true, data: result });
  },

  async pagar(req: Request, res: Response) {
    const data = pagarMensalidadeSchema.parse(req.body);
    const result = await mensalidadesService.pagar(Number(req.params.id), data);
    return res.json({ success: true, data: result });
  },
};
