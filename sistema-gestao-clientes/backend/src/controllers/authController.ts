import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { loginSchema } from '../validators/authSchemas';
import { authCookieName, getAuthCookieOptions, getClearCookieOptions } from '../utils/cookie';

export const authController = {
  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.senha);

    // Mantém o cookie httpOnly para navegadores que aceitam cookies normalmente.
    res.cookie(authCookieName, result.token, getAuthCookieOptions());

    // Também retorna o token para fallback mobile. Alguns navegadores móveis bloqueiam
    // cookies em fluxos com proxy/rewrite, então o frontend envia Authorization Bearer.
    return res.json({
      success: true,
      data: {
        usuario: result.usuario,
        token: result.token,
      },
    });
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
