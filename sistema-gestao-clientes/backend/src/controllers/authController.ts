import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { loginSchema } from '../validators/authSchemas';
import { getAuthCookieOptions } from '../utils/cookie';

export const authController = {
  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.senha);
    res.cookie('sgc_token', result.token, getAuthCookieOptions());
    return res.json({ success: true, data: result.usuario });
  },

  async me(req: Request, res: Response) {
    const usuario = await authService.getMe(req.user!.id);
    return res.json({ success: true, data: usuario });
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie('sgc_token', getAuthCookieOptions());
    return res.json({ success: true, message: 'Logout realizado.' });
  },
};
