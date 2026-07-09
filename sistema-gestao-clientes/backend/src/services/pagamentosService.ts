import { pagamentosRepository } from '../repositories/pagamentosRepository';

export const pagamentosService = {
  list(page: number, perPage: number) {
    return pagamentosRepository.list(page, perPage);
  },
};
