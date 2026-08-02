import { Router } from 'express';
import healthRoute from './health.route.js';
import authRoute from './auth.route.js';
import organizationRoute from './organization.route.js';
import employeeRoute from './employee.route.js';

const router = Router();

router.use('/health', healthRoute);
router.use('/auth', authRoute);
router.use('/organizations', organizationRoute);
router.use('/employees', employeeRoute);

export default router;
