"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
const cookie_1 = require("../utils/cookie");
function isAuthJwtPayload(payload) {
    if (!payload || typeof payload !== 'object')
        return false;
    const data = payload;
    return typeof data.sub === 'string' && typeof data.email === 'string';
}
function authMiddleware(req, _res, next) {
    const cookieToken = req.cookies?.[cookie_1.authCookieName];
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice('Bearer '.length)
        : undefined;
    const token = cookieToken || bearerToken;
    if (!token) {
        throw new ApiError_1.ApiError(401, 'Sessão expirada ou token ausente. Faça login novamente.');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (!isAuthJwtPayload(decoded)) {
            throw new ApiError_1.ApiError(401, 'Token inválido. Faça login novamente.');
        }
        req.user = {
            id: Number(decoded.sub),
            email: decoded.email,
        };
        next();
    }
    catch {
        throw new ApiError_1.ApiError(401, 'Token inválido. Faça login novamente.');
    }
}
