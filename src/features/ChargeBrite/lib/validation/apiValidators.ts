/**
 * @fileoverview Pre-configured API Validators
 * 
 * Ready-to-use validation middleware for common endpoints
 */

import { z } from 'zod';
import { createApiValidationMiddleware } from './apiValidationMiddleware';
import { ApiSchemas } from './apiSchemas';

/**
 * Pre-configured API validators
 */
export const ApiValidators = {
  /** Reports API validators */
  reports: {
    list: createApiValidationMiddleware({
      endpoint: '/reports',
      method: 'GET',
      requestSchema: ApiSchemas.queryParams(),
      responseSchema: ApiSchemas.paginatedResponse(z.any()),
    }),

    generate: createApiValidationMiddleware({
      endpoint: '/reports/generate',
      method: 'POST',
      requestSchema: z.object({
        templateId: z.string().uuid(),
        parameters: z.record(z.any()),
      }),
      responseSchema: ApiSchemas.response(z.object({
        reportId: z.string().uuid(),
        status: z.enum(['pending', 'processing', 'completed', 'failed']),
      })),
    }),
  },

  /** User API validators */
  users: {
    profile: createApiValidationMiddleware({
      endpoint: '/users/profile',
      method: 'GET',
      responseSchema: ApiSchemas.response(z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
      })),
    }),
  },
} as const;