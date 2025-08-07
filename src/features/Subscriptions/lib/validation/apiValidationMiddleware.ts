/**
 * @fileoverview API Validation Middleware
 * 
 * Core middleware factory for API request/response validation
 */

import { z } from 'zod';
import { ValidationFactory, createValidationFactory } from '@/lib/factories/validationFactory';
import { ApiValidationConfig, ValidationError } from './apiValidationTypes';

/**
 * API validation middleware factory
 */
export function createApiValidationMiddleware<
  TRequest extends z.ZodTypeAny,
  TResponse extends z.ZodTypeAny
>(config: {
  endpoint: string;
  method: string;
  requestSchema?: TRequest;
  responseSchema?: TResponse;
  validationConfig?: ApiValidationConfig;
}) {
  const {
    endpoint,
    method,
    requestSchema,
    responseSchema,
    validationConfig = {}
  } = config;

  const {
    validateRequests = true,
    validateResponses = true,
    throwOnError = false,
    onError
  } = validationConfig;

  // Create validation factories
  const requestValidator = requestSchema
    ? createValidationFactory({
        name: `${method} ${endpoint} Request`,
        schema: requestSchema,
      })
    : null;

  const responseValidator = responseSchema
    ? createValidationFactory({
        name: `${method} ${endpoint} Response`,
        schema: responseSchema,
      })
    : null;

  /**
   * Validate request data
   */
  const validateRequest = (data: unknown) => {
    if (!validateRequests || !requestValidator) {
      return { isValid: true, data };
    }

    const result = requestValidator.validate(data);
    if (!result.success) {
      const error: ValidationError = {
        type: 'request',
        endpoint,
        method,
        errors: result.errors || {},
        originalData: data,
      };

      if (onError) {
        onError(error);
      }

      if (throwOnError) {
        throw new Error(`Request validation failed: ${result.firstError}`);
      }

      return { isValid: false, error, data: null };
    }

    return { isValid: true, data: result.data };
  };

  /**
   * Validate response data
   */
  const validateResponse = (data: unknown) => {
    if (!validateResponses || !responseValidator) {
      return { isValid: true, data };
    }

    const result = responseValidator.validate(data);
    if (!result.success) {
      const error: ValidationError = {
        type: 'response',
        endpoint,
        method,
        errors: result.errors || {},
        originalData: data,
      };

      if (onError) {
        onError(error);
      }

      if (throwOnError) {
        throw new Error(`Response validation failed: ${result.firstError}`);
      }

      return { isValid: false, error, data: null };
    }

    return { isValid: true, data: result.data };
  };

  return {
    validateRequest,
    validateResponse,
    requestValidator,
    responseValidator,
  };
}