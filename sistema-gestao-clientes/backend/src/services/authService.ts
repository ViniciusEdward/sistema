import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { usuariosRepository } from '../repositories/usuariosRepository';
import { ApiError } from '../utils/ApiError';

export const authService = {
  async login(email: string, senha: string) {
    const usuario = await usuariosRepository.findByEmail(email.toLowerCase());

    if (!usuario || !usuario.ativo) {
      throw new ApiError(401, 'E-mail ou senha inválidos.');
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaOk) {
      throw new ApiError(401, 'E-mail ou senha inválidos.');
    }

    const token = jwt.sign(
      { email: usuario.email },
      env.JWT_SECRET,
      { subject: String(usuario.id), expiresIn: env.JWT_EXPIRES_IN } as SignOptions,
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  },

  async getMe(userId: number) {
    const usuario = await usuariosRepository.findById(userId);
    if (!usuario || !usuario.ativo) {
      throw new ApiError(401, 'Usuário inválido.');
    }
    return { id: usuario.id, nome: usuario.nome, email: usuario.email };
  },
};
