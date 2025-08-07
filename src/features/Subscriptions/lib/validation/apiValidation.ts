/**
 * @fileoverview API Boundary Validation
 * 
 * Centralized exports for API validation system
 * 
 * @author Validation Team
 * @since 1.0.0
 */

// Core types
export type { ApiValidationConfig, ValidationError } from './apiValidationTypes';

// Core middleware
export { createApiValidationMiddleware } from './apiValidationMiddleware';

// Common schemas
export { ApiSchemas } from './apiSchemas';

// Pre-configured validators
export { ApiValidators } from './apiValidators';

// Configuration management
export {
  setGlobalApiValidationConfig,
  getGlobalApiValidationConfig,
  setupApiValidationErrorHandling,
} from './apiValidationConfig';

// Error handling
export { logValidationError } from './apiValidationErrors';