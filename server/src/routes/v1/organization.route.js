import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/authorize.middleware.js';
import { requireOrganization } from '../../middleware/tenant.middleware.js';
import { createOrganizationSchema } from '../../validators/organization.validator.js';
import { createOrganization, getCurrentOrganization } from '../../controllers/organization.controller.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

// ── Super Admin Routes ──────────────────────────────────────────
router.post('/', authenticate, authorizeRoles(ROLES.SUPER_ADMIN), validate({ body: createOrganizationSchema }), createOrganization);

// ── Authenticated Tenant Routes ──────────────────────────────────
router.get('/current', authenticate, requireOrganization, getCurrentOrganization);

export default router;
