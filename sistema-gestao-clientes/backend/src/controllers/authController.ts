import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { loginSchema } from '../validators/authSchemas';
import { authCookieName, getAuthCookieOptions, getClearCookieOptions } from '../utils/cookie';

export const authController = {
  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.senha);
    res.cookie(authCookieName, result.token, getAuthCookieOptions());
    return res.json({ success: true, data: result.usuario });
  },

  async me(req: Request, res: Response) {
    const usuario = await authService.getMe(req.user!.id);
    return res.json({ success: true, data: usuario });
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie(authCookieName, getClearCookieOptions());
    return res.json({ success: true, message: 'Logout realizado.' });
  },
};
