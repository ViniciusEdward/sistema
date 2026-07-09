"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuariosRepository = void 0;
const client_1 = require("../prisma/client");
exports.usuariosRepository = {
    findByEmail(email) {
        return client_1.prisma.usuario.findUnique({ where: { email } });
    },
    findById(id) {
        return client_1.prisma.usuario.findUnique({ where: { id } });
    },
    upsertAdmin(input) {
        return client_1.prisma.usuario.upsert({
            where: { email: input.email },
            update: { nome: input.nome, senhaHash: input.senhaHash, ativo: true },
            create: { nome: input.nome, email: input.email, senhaHash: input.senhaHash, ativo: true },
        });
    },
};
