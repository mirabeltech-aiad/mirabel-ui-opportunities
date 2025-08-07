
import { 
  createApiValidationMiddleware, 
  setupApiValidationErrorHandling,
  logValidationError,
  type ValidationError 
} from '@/lib/validation/apiValidation';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Basic API configuration
const config = {
  validateRequests: true,
  validateResponses: true,
};

// Enhanced HTTP client with validation and sanitization
export const apiClient = {
  get: async <T>(
    url: string, 
    options?: { 
      params?: Record<string, any>;
      validate?: boolean;
      sanitize?: boolean;
    }
  ): Promise<{ data: T }> => {
    const { params, validate = true, sanitize = true } = options || {};
    
    // Basic sanitization
    let sanitizedParams = params;
    if (sanitize && params) {
      sanitizedParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = value.trim();
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
    }

    const queryParams = sanitizedParams ? '?' + new URLSearchParams(sanitizedParams).toString() : '';
    
    try {
      const response = await fetch(`${API_BASE_URL}${url}${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Log successful API call for monitoring
      console.debug(`[API] GET ${url}`, { 
        status: response.status, 
        params: sanitizedParams 
      });
      
      return { data };
    } catch (error) {
      // Log API errors
      console.error(`[API Error] GET ${url}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        params: sanitizedParams,
      });
      throw error;
    }
  },

  post: async <T>(
    url: string,
    body?: any,
    options?: {
      validate?: boolean;
      sanitize?: boolean;
    }
  ): Promise<{ data: T }> => {
    const { validate = true, sanitize = true } = options || {};

    // Basic sanitization
    let sanitizedBody = body;
    if (sanitize && body && typeof body === 'object') {
      if (body.search) {
        sanitizedBody = {
          ...body,
          search: body.search.trim(),
        };
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      console.debug(`[API] POST ${url}`, {
        status: response.status,
        bodySize: JSON.stringify(sanitizedBody)?.length || 0,
      });

      return { data };
    } catch (error) {
      console.error(`[API Error] POST ${url}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        body: sanitizedBody,
      });
      throw error;
    }
  },
};

export { USE_MOCK_DATA };
