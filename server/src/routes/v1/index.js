import { Router } from 'express';
import healthRoutes from './health.route.js';

const router = Router();

// Health check
router.use(healthRoutes);

// Future route modules will be registered here
// e.g., router.use('/auth', authRoutes);

export default router;
