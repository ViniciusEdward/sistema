import { Router } from 'express';
import { mensalidadesController } from '../controllers/mensalidadesController';
import { asyncHandler } from '../utils/asyncHandler';

export const mensalidadesRoutes = Router();

mensalidadesRoutes.get('/', asyncHandler(mensalidadesController.list));
mensalidadesRoutes.get('/:id', asyncHandler(mensalidadesController.getById));
mensalidadesRoutes.post('/', asyncHandler(mensalidadesController.create));
mensalidadesRoutes.put('/:id', asyncHandler(mensalidadesController.update));
mensalidadesRoutes.delete('/:id', asyncHandler(mensalidadesController.remove));
mensalidadesRoutes.post('/:id/pagar', asyncHandler(mensalidadesController.pagar));
