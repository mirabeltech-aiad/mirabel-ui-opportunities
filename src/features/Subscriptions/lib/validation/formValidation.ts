/**
 * @fileoverview Enhanced Form Validation
 * 
 * Comprehensive form validation with error messaging, field-level validation,
 * and React Hook Form integration.
 * 
 * @author Validation Team
 * @since 1.0.0
 */

import { z } from 'zod';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { ValidationFactory, createValidationFactory } from '@/lib/factories/validationFactory';

/**
 * Form field validation result
 */
export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Form validation context
 */
export interface FormValidationContext<T extends FieldValues> {
  /** React Hook Form instance */
  form: UseFormReturn<T>;
  /** Field validators */
  validators: Record<string, (value: any) => FieldValidationResult>;
  /** Real-time validation enabled */
  realTimeValidation?: boolean;
  /** Debounce delay for real-time validation */
  debounceMs?: number;
}

/**
 * Enhanced form field configuration
 */
export interface FormFieldConfig {
  /** Field label */
  label: string;
  /** Field name */
  name: string;
  /** Required field */
  required?: boolean;
  /** Help text */
  helpText?: string;
  /** Custom validation rules */
  validation?: z.ZodTypeAny;
  /** Real-time validation */
  validateOnChange?: boolean;
  /** Validation debounce delay */
  debounceMs?: number;
  /** Field dependencies for conditional validation */
  dependencies?: string[];
}

/**
 * Create enhanced form validator
 */
export function createFormValidator<T extends z.ZodTypeAny>(config: {
  name: string;
  schema: T;
  fieldConfigs?: Record<string, FormFieldConfig>;
}) {
  const { name, schema, fieldConfigs = {} } = config;
  
  const baseValidator = createValidationFactory({
    name,
    schema,
  });

  /**
   * Validate single field
   */
  const validateField = (
    fieldName: string,
    value: any,
    allValues?: z.infer<T>
  ): FieldValidationResult => {
    const fieldConfig = fieldConfigs[fieldName];
    
    // Use field-specific validation if available
    if (fieldConfig?.validation) {
      try {
        fieldConfig.validation.parse(value);
        return { isValid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            isValid: false,
            error: error.errors[0]?.message || 'Invalid value',
          };
        }
        return { isValid: false, error: 'Validation failed' };
      }
    }

    // Use full schema validation for the field
    const fieldValidator = baseValidator.createFieldValidator(fieldName as keyof z.infer<T>);
    const result = fieldValidator(value);
    
    return {
      isValid: result.success,
      error: result.firstError,
    };
  };

  /**
   * Validate all fields
   */
  const validateForm = (values: z.infer<T>) => {
    const result = baseValidator.validate(values);
    const fieldErrors: Record<string, string> = {};
    
    if (!result.success && result.errors) {
      Object.entries(result.errors).forEach(([field, messages]) => {
        fieldErrors[field] = messages[0];
      });
    }

    return {
      isValid: result.success,
      data: result.data,
      errors: fieldErrors,
      firstError: result.firstError,
    };
  };

  /**
   * Create field validator with dependencies
   */
  const createDependentFieldValidator = (
    fieldName: string,
    dependencies: string[]
  ) => {
    return (value: any, allValues?: z.infer<T>) => {
      // Check dependencies first
      if (allValues && dependencies.length > 0) {
        for (const dep of dependencies) {
          const depValue = (allValues as any)[dep];
          if (!depValue || depValue === '') {
            return {
              isValid: false,
              error: `Please fill in ${dep} first`,
            };
          }
        }
      }

      return validateField(fieldName, value, allValues);
    };
  };

  return {
    schema: baseValidator.schema,
    validate: baseValidator.validate,
    validateAsync: baseValidator.validateAsync,
    validateField,
    validateForm,
    createDependentFieldValidator,
    fieldConfigs,
  };
}

/**
 * Form validation hooks for React Hook Form integration
 */
export function useFormValidation<T extends FieldValues>(
  validator: ReturnType<typeof createFormValidator>
) {
  /**
   * Create validation rules for React Hook Form
   */
  const createValidationRules = (fieldName: keyof T) => {
    const fieldConfig = validator.fieldConfigs[fieldName as string];
    
    return {
      required: fieldConfig?.required ? `${fieldConfig.label} is required` : false,
      validate: (value: any, formValues: T) => {
        const result = fieldConfig?.dependencies
          ? validator.createDependentFieldValidator(
              fieldName as string,
              fieldConfig.dependencies
            )(value, formValues)
          : validator.validateField(fieldName as string, value, formValues);
        
        return result.isValid || result.error || true;
      },
    };
  };

  /**
   * Get field error message
   */
  const getFieldError = (form: UseFormReturn<T>, fieldName: keyof T) => {
    const error = form.formState.errors[fieldName];
    if (!error) return '';
    
    // Handle different error message types
    if (typeof error.message === 'string') {
      return error.message;
    }
    return 'Validation error';
  };

  /**
   * Check if field has error
   */
  const hasFieldError = (form: UseFormReturn<T>, fieldName: keyof T) => {
    return !!form.formState.errors[fieldName];
  };

  return {
    createValidationRules,
    getFieldError,
    hasFieldError,
  };
}

/**
 * Enhanced error message formatting
 */
export const ErrorMessageFormatter = {
  /**
   * Format field error with context
   */
  formatFieldError: (
    error: string,
    fieldLabel: string,
    fieldValue?: any
  ): string => {
    // Replace generic messages with contextual ones
    const contextualError = error
      .replace('String must contain at least', `${fieldLabel} must contain at least`)
      .replace('Invalid email address', `Please enter a valid email address`)
      .replace('Required', `${fieldLabel} is required`)
      .replace('Invalid', `Please enter a valid ${fieldLabel.toLowerCase()}`);
    
    return contextualError;
  },

  /**
   * Format multiple errors
   */
  formatMultipleErrors: (errors: string[]): string => {
    if (errors.length === 1) return errors[0];
    if (errors.length === 2) return `${errors[0]} and ${errors[1]}`;
    
    const lastError = errors[errors.length - 1];
    const otherErrors = errors.slice(0, -1).join(', ');
    return `${otherErrors}, and ${lastError}`;
  },
} as const;

/**
 * Common form validation schemas
 */
export const FormSchemas = {
  /** User registration */
  userRegistration: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
  }).refine(
    data => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  ),

  /** Contact form */
  contactForm: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Please enter a valid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    newsletter: z.boolean().optional(),
  }),

  /** Report generation */
  reportGeneration: z.object({
    templateId: z.string().uuid('Please select a valid template'),
    dateRange: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }).refine(
      data => data.startDate <= data.endDate,
      { message: 'End date must be after start date' }
    ),
    format: z.enum(['pdf', 'excel', 'csv'], {
      errorMap: () => ({ message: 'Please select a valid format' }),
    }),
    includeCharts: z.boolean().default(true),
    filterBy: z.object({
      productIds: z.array(z.string().uuid()).optional(),
      businessUnits: z.array(z.string()).optional(),
    }).optional(),
  }),
} as const;

/**
 * Pre-configured form validators
 */
export const FormValidators = {
  userRegistration: createFormValidator({
    name: 'User Registration',
    schema: FormSchemas.userRegistration,
    fieldConfigs: {
      email: {
        label: 'Email',
        name: 'email',
        required: true,
        helpText: 'We\'ll never share your email with anyone else',
        validateOnChange: true,
        debounceMs: 500,
      },
      password: {
        label: 'Password',
        name: 'password',
        required: true,
        helpText: 'Must be at least 8 characters with uppercase, lowercase, and number',
        validateOnChange: true,
        debounceMs: 300,
      },
      confirmPassword: {
        label: 'Confirm Password',
        name: 'confirmPassword',
        required: true,
        dependencies: ['password'],
        validateOnChange: true,
        debounceMs: 300,
      },
    },
  }),

  contactForm: createFormValidator({
    name: 'Contact Form',
    schema: FormSchemas.contactForm,
  }),

  reportGeneration: createFormValidator({
    name: 'Report Generation',
    schema: FormSchemas.reportGeneration,
  }),
} as const;