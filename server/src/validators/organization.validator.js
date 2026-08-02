import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1, 'Organization name is required').max(100, 'Name must be 100 characters or less'),
  domain: z.string().trim().toLowerCase().max(255).optional(),
});
