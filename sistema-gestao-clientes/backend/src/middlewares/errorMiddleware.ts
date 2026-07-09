import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export function notFoundMiddleware(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Rota não encontrada: ${req.method} ${req.originalUrl}`));
}

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos.',
      errors: err.flatten(),
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Registro duplicado.' });
    }
    if (err.code === 'P2003') {
      return res.status(409).json({
        success: false,
        message: 'Este registro possui vínculos e não pode ser alterado dessa forma.',
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Registro não encontrado.' });
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    const message = err.message || '';
    if (message.includes('max_user_connections')) {
      return res.status(503).json({
        success: false,
        message:
          'O banco atingiu o limite de conexões. Feche phpMyAdmin/Workbench e tente novamente em alguns minutos.',
      });
    }
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor.',
  });
}
