import { Router } from 'express';
import { authController } from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware } from '../middlewares/authMiddleware';

export const authRoutes = Router();

authRoutes.post('/login', asyncHandler(authController.login));
authRoutes.post('/logout', asyncHandler(authController.logout));
authRoutes.get('/me', authMiddleware, asyncHandler(authController.me));
