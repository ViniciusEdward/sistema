import { Router } from 'express';
import { pagamentosController } from '../controllers/pagamentosController';
import { asyncHandler } from '../utils/asyncHandler';

export const pagamentosRoutes = Router();

pagamentosRoutes.get('/', asyncHandler(pagamentosController.list));
