/**
 * @fileoverview API Validation Configuration
 * 
 * Global configuration management for API validation
 */

import { ApiValidationConfig } from './apiValidationTypes';
import { logValidationError } from './apiValidationErrors';

/**
 * Global validation configuration
 */
let globalConfig: ApiValidationConfig = {
  validateRequests: true,
  validateResponses: true,
  throwOnError: false,
};

/**
 * Set global API validation configuration
 */
export function setGlobalApiValidationConfig(config: Partial<ApiValidationConfig>) {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * Get global API validation configuration
 */
export function getGlobalApiValidationConfig(): ApiValidationConfig {
  return globalConfig;
}

/**
 * Setup global error handling for API validation
 */
export function setupApiValidationErrorHandling() {
  setGlobalApiValidationConfig({
    onError: logValidationError,
  });
}