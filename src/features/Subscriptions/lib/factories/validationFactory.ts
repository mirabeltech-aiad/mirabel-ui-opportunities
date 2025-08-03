/**
 * @fileoverview Validation Factory Pattern
 * 
 * Factory for generating validation schemas and functions using Zod.
 * Provides reusable validation patterns and error handling.
 * 
 * @author Factory Team
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Common field validation patterns
 */
export const ValidationPatterns = {
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  uuid: z.string().uuid('Invalid UUID format'),
  url: z.string().url('Invalid URL format'),
  required: z.string().min(1, 'This field is required'),
  optionalString: z.string().optional(),
  positiveNumber: z.number().positive('Must be a positive number'),
  nonNegativeNumber: z.number().nonnegative('Must be zero or greater'),
  dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  futureDate: z.date().refine(date => date > new Date(), 'Date must be in the future'),
  pastDate: z.date().refine(date => date < new Date(), 'Date must be in the past'),
} as const;

/**
 * Validation factory configuration
 */
export interface ValidationFactoryConfig<TSchema extends z.ZodTypeAny> {
  /** Schema name for error messages */
  name: string;
  /** Zod schema */
  schema: TSchema;
  /** Custom error messages */
  errorMessages?: Record<string, string>;
  /** Transform function for successful validation */
  transform?: (data: z.infer<TSchema>) => any;
}

/**
 * Validation result interface
 */
export interface ValidationResult<T> {
  /** Whether validation was successful */
  success: boolean;
  /** Validated and transformed data (if successful) */
  data?: T;
  /** Validation errors (if unsuccessful) */
  errors?: Record<string, string[]>;
  /** First error message (convenience) */
  firstError?: string;
}

/**
 * Validation factory return type
 */
export interface ValidationFactory<TSchema extends z.ZodTypeAny> {
  /** Zod schema */
  schema: TSchema;
  /** Validate function */
  validate: (data: unknown) => ValidationResult<z.infer<TSchema>>;
  /** Async validate function */
  validateAsync: (data: unknown) => Promise<ValidationResult<z.infer<TSchema>>>;
  /** Parse function (throws on error) */
  parse: (data: unknown) => z.infer<TSchema>;
  /** Safe parse function */
  safeParse: (data: unknown) => z.SafeParseReturnType<unknown, z.infer<TSchema>>;
  /** Create field validator */
  createFieldValidator: (field: keyof z.infer<TSchema>) => (value: unknown) => ValidationResult<any>;
}

/**
 * Creates a validation factory with comprehensive validation utilities
 * 
 * @param config - Validation factory configuration
 * @returns Complete validation factory
 * 
 * @example
 * ```typescript
 * const userValidation = createValidationFactory({
 *   name: 'User',
 *   schema: z.object({
 *     email: ValidationPatterns.email,
 *     name: ValidationPatterns.required,
 *     age: ValidationPatterns.positiveNumber
 *   })
 * });
 * 
 * const result = userValidation.validate({
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   age: 25
 * });
 * 
 * if (result.success) {
 *   console.log('Valid user:', result.data);
 * } else {
 *   console.log('Validation errors:', result.errors);
 * }
 * ```
 */
export function createValidationFactory<TSchema extends z.ZodTypeAny>(
  config: ValidationFactoryConfig<TSchema>
): ValidationFactory<TSchema> {
  const { name, schema, errorMessages = {}, transform } = config;

  /**
   * Convert Zod errors to our format
   */
  const formatErrors = (zodError: z.ZodError): Record<string, string[]> => {
    const errors: Record<string, string[]> = {};
    
    zodError.errors.forEach((error) => {
      const path = error.path.join('.');
      const message = errorMessages[path] || error.message;
      
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(message);
    });
    
    return errors;
  };

  /**
   * Get first error message
   */
  const getFirstError = (errors: Record<string, string[]>): string | undefined => {
    const firstKey = Object.keys(errors)[0];
    return firstKey ? errors[firstKey][0] : undefined;
  };

  /**
   * Validate function
   */
  const validate = (data: unknown): ValidationResult<z.infer<TSchema>> => {
    try {
      const parsed = schema.parse(data);
      const transformed = transform ? transform(parsed) : parsed;
      
      return {
        success: true,
        data: transformed,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = formatErrors(error);
        return {
          success: false,
          errors,
          firstError: getFirstError(errors),
        };
      }
      
      return {
        success: false,
        errors: { general: [`${name} validation failed`] },
        firstError: `${name} validation failed`,
      };
    }
  };

  /**
   * Async validate function
   */
  const validateAsync = async (data: unknown): Promise<ValidationResult<z.infer<TSchema>>> => {
    try {
      const parsed = await schema.parseAsync(data);
      const transformed = transform ? transform(parsed) : parsed;
      
      return {
        success: true,
        data: transformed,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = formatErrors(error);
        return {
          success: false,
          errors,
          firstError: getFirstError(errors),
        };
      }
      
      return {
        success: false,
        errors: { general: [`${name} validation failed`] },
        firstError: `${name} validation failed`,
      };
    }
  };

  /**
   * Parse function (throws on error)
   */
  const parse = (data: unknown): z.infer<TSchema> => {
    return schema.parse(data);
  };

  /**
   * Safe parse function
   */
  const safeParse = (data: unknown): z.SafeParseReturnType<unknown, z.infer<TSchema>> => {
    return schema.safeParse(data);
  };

  /**
   * Create field validator
   */
  const createFieldValidator = (field: keyof z.infer<TSchema>) => {
    return (value: unknown): ValidationResult<any> => {
      try {
        // Extract field schema if it's an object schema
        if ('shape' in schema && schema.shape) {
          const fieldSchema = (schema.shape as any)[field];
          if (fieldSchema) {
            const parsed = fieldSchema.parse(value);
            return { success: true, data: parsed };
          }
        }
        
        // Fallback to full validation
        const result = validate({ [field]: value } as any);
        if (result.success) {
          return { success: true, data: (result.data as any)[field] };
        }
        
        const fieldErrors = result.errors?.[String(field)];
        return {
          success: false,
          errors: fieldErrors ? { [String(field)]: fieldErrors } : result.errors,
          firstError: fieldErrors?.[0] || result.firstError,
        };
      } catch (error) {
        return {
          success: false,
          errors: { [String(field)]: ['Validation failed'] },
          firstError: 'Validation failed',
        };
      }
    };
  };

  return {
    schema,
    validate,
    validateAsync,
    parse,
    safeParse,
    createFieldValidator,
  };
}

/**
 * Common schema builders
 */
export const SchemaBuilders = {
  /**
   * Create a pagination schema
   */
  pagination: () => z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),

  /**
   * Create a date range schema
   */
  dateRange: () => z.object({
    startDate: z.date(),
    endDate: z.date(),
  }).refine(
    (data) => data.startDate <= data.endDate,
    { message: 'Start date must be before or equal to end date' }
  ),

  /**
   * Create a filter schema
   */
  filters: <T extends Record<string, z.ZodTypeAny>>(fields: T) => z.object({
    ...fields,
    search: z.string().optional(),
    status: z.array(z.string()).optional(),
  }),

  /**
   * Create an ID array schema
   */
  idArray: () => z.array(ValidationPatterns.uuid).min(1, 'At least one ID is required'),

  /**
   * Create a form data schema with file uploads
   */
  formWithFiles: <T extends Record<string, z.ZodTypeAny>>(fields: T) => z.object({
    ...fields,
    files: z.array(z.instanceof(File)).optional(),
  }),
} as const;

/**
 * Pre-built common validations
 */
export const CommonValidations = {
  /** User profile validation */
  userProfile: createValidationFactory({
    name: 'UserProfile',
    schema: z.object({
      email: ValidationPatterns.email,
      firstName: ValidationPatterns.required,
      lastName: ValidationPatterns.required,
      phone: ValidationPatterns.phone.optional(),
      dateOfBirth: z.date().optional(),
    }),
  }),

  /** Report filters validation */
  reportFilters: createValidationFactory({
    name: 'ReportFilters',
    schema: z.object({
      dateRange: SchemaBuilders.dateRange().optional(),
      productIds: z.array(ValidationPatterns.uuid).optional(),
      businessUnitIds: z.array(ValidationPatterns.uuid).optional(),
      status: z.array(z.string()).optional(),
      search: z.string().optional(),
    }),
  }),

  /** Pagination validation */
  pagination: createValidationFactory({
    name: 'Pagination',
    schema: SchemaBuilders.pagination(),
  }),
} as const;