"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapAdminUser = bootstrapAdminUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const usuariosRepository_1 = require("../repositories/usuariosRepository");
async function bootstrapAdminUser() {
    if (!env_1.env.ADMIN_EMAIL)
        return;
    let senhaHash = env_1.env.ADMIN_PASSWORD_HASH;
    if (!senhaHash && env_1.env.ADMIN_PASSWORD) {
        senhaHash = await bcryptjs_1.default.hash(env_1.env.ADMIN_PASSWORD, 10);
    }
    if (!senhaHash) {
        console.warn('ADMIN_EMAIL informado sem ADMIN_PASSWORD_HASH ou ADMIN_PASSWORD. Usuário não foi criado/atualizado.');
        return;
    }
    await usuariosRepository_1.usuariosRepository.upsertAdmin({
        nome: env_1.env.ADMIN_NAME || 'Administrador',
        email: env_1.env.ADMIN_EMAIL.toLowerCase(),
        senhaHash,
    });
    console.log(`Usuário único pronto: ${env_1.env.ADMIN_EMAIL}`);
}
