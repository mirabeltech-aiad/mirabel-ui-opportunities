/**
 * @fileoverview Basic Validation Schemas
 */

import { z } from 'zod';

export const UserSchemas = {
  profile: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
};