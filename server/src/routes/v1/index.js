import { Router } from 'express';
import healthRoutes from './health.route.js';
import authRoutes from './auth.route.js';

const router = Router();

// Health check
router.use(healthRoutes);

// Authentication
router.use('/auth', authRoutes);

export default router;
