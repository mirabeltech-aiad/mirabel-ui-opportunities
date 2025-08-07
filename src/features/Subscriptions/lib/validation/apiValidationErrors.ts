/**
 * @fileoverview API Validation Error Handling
 * 
 * Error logging and handling utilities for API validation
 */

import { ValidationError } from './apiValidationTypes';

/**
 * Validation error logger
 */
export function logValidationError(error: ValidationError) {
  console.error(`[API Validation Error] ${error.type} validation failed`, {
    endpoint: error.endpoint,
    method: error.method,
    errors: error.errors,
    data: error.originalData,
  });
}