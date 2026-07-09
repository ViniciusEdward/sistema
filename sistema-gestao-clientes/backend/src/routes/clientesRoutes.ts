import { Router } from 'express';
import { clientesController } from '../controllers/clientesController';
import { asyncHandler } from '../utils/asyncHandler';

export const clientesRoutes = Router();

clientesRoutes.get('/', asyncHandler(clientesController.list));
clientesRoutes.get('/:id', asyncHandler(clientesController.getById));
clientesRoutes.post('/', asyncHandler(clientesController.create));
clientesRoutes.put('/:id', asyncHandler(clientesController.update));
clientesRoutes.delete('/:id', asyncHandler(clientesController.remove));
