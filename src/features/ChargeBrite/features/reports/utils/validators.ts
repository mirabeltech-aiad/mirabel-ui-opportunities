/**
 * @fileoverview Validation utilities for Reports feature
 * 
 * Zod schemas and validation functions for runtime type safety
 * and data validation throughout the reports feature.
 */

import { z } from 'zod';

/**
 * Schema for date range validation
 */
export const DateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date()
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"]
  }
);

/**
 * Schema for report generation parameters
 */
export const ReportParametersSchema = z.object({
  dateRange: DateRangeSchema.optional(),
  productIds: z.array(z.string().uuid()).optional(),
  businessUnits: z.array(z.string()).optional(),
  format: z.enum(['pdf', 'excel', 'csv', 'json']).optional()
});

/**
 * Schema for report template validation
 */
export const ReportTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Report name is required"),
  description: z.string(),
  template_type: z.string(),
  sql_query: z.string().optional(),
  output_format: z.string(),
  version: z.string(),
  applicable_company_types: z.array(z.string()),
  template_config: z.any(),
  parameters: z.any().optional(),
  is_active: z.boolean(),
  is_system_template: z.boolean()
});

/**
 * Schema for report generation request
 */
export const ReportGenerationRequestSchema = z.object({
  templateId: z.string().uuid("Invalid template ID"),
  parameters: ReportParametersSchema,
  schedule: z.object({
    frequency: z.enum(['once', 'daily', 'weekly', 'monthly', 'quarterly']),
    nextRun: z.string().datetime().optional()
  }).optional()
});

/**
 * Schema for report filters
 */
export const ReportFiltersSchema = z.object({
  searchQuery: z.string().optional(),
  category: z.string().optional(),
  businessModel: z.enum(['media', 'saas']).optional(),
  status: z.array(z.string()).optional(),
  dateRange: DateRangeSchema.optional(),
  productIds: z.array(z.string().uuid()).optional(),
  businessUnits: z.array(z.string()).optional()
});

/**
 * Schema for pagination parameters
 */
export const PaginationSchema = z.object({
  page: z.number().min(0, "Page must be non-negative"),
  limit: z.number().min(1).max(100, "Limit must be between 1 and 100"),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

/**
 * Validates a date range for reports
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Validation result with error messages
 */
export const validateDateRange = (startDate: Date, endDate: Date) => {
  try {
    DateRangeSchema.parse({ startDate, endDate });
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors[0]?.message || 'Invalid date range' 
      };
    }
    return { isValid: false, error: 'Unknown validation error' };
  }
};

/**
 * Validates report generation parameters
 * 
 * @param parameters - Parameters to validate
 * @returns Validation result
 */
export const validateReportParameters = (parameters: any) => {
  try {
    ReportParametersSchema.parse(parameters);
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors.map(e => e.message).join(', ')
      };
    }
    return { isValid: false, error: 'Invalid parameters' };
  }
};

/**
 * Validates a UUID string
 * 
 * @param id - UUID string to validate
 * @returns Whether the UUID is valid
 */
export const isValidUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Validates report template data
 * 
 * @param template - Template data to validate
 * @returns Validation result
 */
export const validateReportTemplate = (template: any) => {
  try {
    ReportTemplateSchema.parse(template);
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
    }
    return { isValid: false, error: 'Invalid template data' };
  }
};

/**
 * Validates business model compatibility
 * 
 * @param businessModel - Current business model
 * @param applicableModels - Models the report applies to
 * @returns Whether the report is compatible
 */
export const isBusinessModelCompatible = (
  businessModel: string, 
  applicableModels: string[]
): boolean => {
  if (!applicableModels || applicableModels.length === 0) {
    return true; // Universal compatibility
  }
  return applicableModels.includes(businessModel);
};

/**
 * Sanitizes user input for search queries
 * 
 * @param input - Raw user input
 * @returns Sanitized search string
 */
export const sanitizeSearchInput = (input: string): string => {
  return input
    .trim()
    .toLowerCase()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes that could break queries
    .slice(0, 100); // Limit length
};