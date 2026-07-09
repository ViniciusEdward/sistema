"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const usuariosRepository_1 = require("../repositories/usuariosRepository");
const ApiError_1 = require("../utils/ApiError");
exports.authService = {
    async login(email, senha) {
        const usuario = await usuariosRepository_1.usuariosRepository.findByEmail(email.toLowerCase());
        if (!usuario || !usuario.ativo) {
            throw new ApiError_1.ApiError(401, 'E-mail ou senha inválidos.');
        }
        const senhaOk = await bcryptjs_1.default.compare(senha, usuario.senhaHash);
        if (!senhaOk) {
            throw new ApiError_1.ApiError(401, 'E-mail ou senha inválidos.');
        }
        const token = jsonwebtoken_1.default.sign({ email: usuario.email }, env_1.env.JWT_SECRET, { subject: String(usuario.id), expiresIn: env_1.env.JWT_EXPIRES_IN });
        return {
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            },
        };
    },
    async getMe(userId) {
        const usuario = await usuariosRepository_1.usuariosRepository.findById(userId);
        if (!usuario || !usuario.ativo) {
            throw new ApiError_1.ApiError(401, 'Usuário inválido.');
        }
        return { id: usuario.id, nome: usuario.nome, email: usuario.email };
    },
};
