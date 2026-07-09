import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { usuariosRepository } from '../repositories/usuariosRepository';

export async function bootstrapAdminUser() {
  if (!env.ADMIN_EMAIL) return;

  let senhaHash = env.ADMIN_PASSWORD_HASH;

  if (!senhaHash && env.ADMIN_PASSWORD) {
    senhaHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  }

  if (!senhaHash) {
    console.warn('ADMIN_EMAIL informado sem ADMIN_PASSWORD_HASH ou ADMIN_PASSWORD. Usuário não foi criado/atualizado.');
    return;
  }

  await usuariosRepository.upsertAdmin({
    nome: env.ADMIN_NAME || 'Administrador',
    email: env.ADMIN_EMAIL.toLowerCase(),
    senhaHash,
  });

  console.log(`Usuário único pronto: ${env.ADMIN_EMAIL}`);
}
