import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService';

export const dashboardController = {
  async get(_req: Request, res: Response) {
    const data = await dashboardService.get();
    return res.json({ success: true, data });
  },
};
