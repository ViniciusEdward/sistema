import { prisma } from '../prisma/client';

export const usuariosRepository = {
  findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  },

  findById(id: number) {
    return prisma.usuario.findUnique({ where: { id } });
  },

  upsertAdmin(input: { nome: string; email: string; senhaHash: string }) {
    return prisma.usuario.upsert({
      where: { email: input.email },
      update: { nome: input.nome, senhaHash: input.senhaHash, ativo: true },
      create: { nome: input.nome, email: input.email, senhaHash: input.senhaHash, ativo: true },
    });
  },
};
