import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { authCookieName } from '../utils/cookie';

type AuthJwtPayload = {
  sub: string;
  email: string;
};

function isAuthJwtPayload(payload: unknown): payload is AuthJwtPayload {
  if (!payload || typeof payload !== 'object') return false;

  const data = payload as Partial<AuthJwtPayload>;
  return typeof data.sub === 'string' && typeof data.email === 'string';
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[authCookieName];
  const bearerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice('Bearer '.length)
    : undefined;
  const token = cookieToken || bearerToken;

  if (!token) {
    throw new ApiError(401, 'Sessão expirada ou token ausente. Faça login novamente.');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (!isAuthJwtPayload(decoded)) {
      throw new ApiError(401, 'Token inválido. Faça login novamente.');
    }

    req.user = {
      id: Number(decoded.sub),
      email: decoded.email,
    };

    next();
  } catch {
    throw new ApiError(401, 'Token inválido. Faça login novamente.');
  }
}
