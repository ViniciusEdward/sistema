import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { asyncHandler } from '../utils/asyncHandler';

export const dashboardRoutes = Router();

dashboardRoutes.get('/', asyncHandler(dashboardController.get));
