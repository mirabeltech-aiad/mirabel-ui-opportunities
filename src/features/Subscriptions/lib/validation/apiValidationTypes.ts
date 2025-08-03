/**
 * @fileoverview API Validation Types
 * 
 * Type definitions for API validation system
 */

/**
 * API validation configuration
 */
export interface ApiValidationConfig {
  /** Enable request validation */
  validateRequests?: boolean;
  /** Enable response validation */
  validateResponses?: boolean;
  /** Throw on validation errors */
  throwOnError?: boolean;
  /** Custom error handler */
  onError?: (error: ValidationError) => void;
}

/**
 * Validation error details
 */
export interface ValidationError {
  type: 'request' | 'response';
  endpoint: string;
  method: string;
  errors: Record<string, string[]>;
  originalData: unknown;
}