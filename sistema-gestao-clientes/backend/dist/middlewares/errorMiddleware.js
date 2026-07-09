"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = notFoundMiddleware;
exports.errorMiddleware = errorMiddleware;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
function notFoundMiddleware(req, _res, next) {
    next(new ApiError_1.ApiError(404, `Rota não encontrada: ${req.method} ${req.originalUrl}`));
}
function errorMiddleware(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos.',
            errors: err.flatten(),
        });
    }
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details,
        });
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
    if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        const message = err.message || '';
        if (message.includes('max_user_connections')) {
            return res.status(503).json({
                success: false,
                message: 'O banco atingiu o limite de conexões. Feche phpMyAdmin/Workbench e tente novamente em alguns minutos.',
            });
        }
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor.',
    });
}
