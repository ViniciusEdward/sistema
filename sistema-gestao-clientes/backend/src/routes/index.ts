import { Router } from 'express';
import { authRoutes } from './authRoutes';
import { clientesRoutes } from './clientesRoutes';
import { dashboardRoutes } from './dashboardRoutes';
import { mensalidadesRoutes } from './mensalidadesRoutes';
import { pagamentosRoutes } from './pagamentosRoutes';
import { authMiddleware } from '../middlewares/authMiddleware';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/dashboard', authMiddleware, dashboardRoutes);
routes.use('/clientes', authMiddleware, clientesRoutes);
routes.use('/mensalidades', authMiddleware, mensalidadesRoutes);
routes.use('/pagamentos', authMiddleware, pagamentosRoutes);
