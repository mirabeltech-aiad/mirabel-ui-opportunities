/**
 * @fileoverview Common API Schemas
 * 
 * Reusable Zod schemas for API validation
 */

import { z } from 'zod';

/**
 * Common API schemas
 */
export const ApiSchemas = {
  /** Standard API response wrapper */
  response: <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
      success: z.boolean(),
      data: dataSchema,
      message: z.string().optional(),
      errors: z.array(z.string()).optional(),
    }),

  /** Paginated response */
  paginatedResponse: <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
      success: z.boolean(),
      data: z.array(dataSchema),
      pagination: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().nonnegative(),
        totalPages: z.number().int().nonnegative(),
      }),
      message: z.string().optional(),
    }),

  /** Error response */
  error: () =>
    z.object({
      success: z.literal(false),
      message: z.string(),
      code: z.string().optional(),
      details: z.any().optional(),
    }),

  /** Query parameters */
  queryParams: () =>
    z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
      search: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).default('asc'),
    }),
} as const;