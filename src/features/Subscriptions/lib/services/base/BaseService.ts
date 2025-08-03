/**
 * @fileoverview Enhanced Base Service Class with Comprehensive Error Handling
 * 
 * This module provides a robust base service class that includes retry logic,
 * intelligent caching, comprehensive error handling, and Supabase integration.
 * All service classes should extend this base to inherit these capabilities.
 * 
 * Key Features:
 * - Exponential backoff retry logic with configurable conditions
 * - TTL-based in-memory caching with size limits
 * - Enhanced error context and categorization
 * - Supabase query helper methods
 * - Pagination support with caching
 * - Detailed logging and monitoring
 * 
 * @example
 * ```typescript
 * // Extend BaseService for your domain
 * class UserService extends BaseService {
 *   constructor() {
 *     super('UserService');
 *   }
 * 
 *   async getUser(id: string) {
 *     return this.withRetryAndCache(
 *       `user:${id}`,
 *       () => this.getSupabaseClient().from('users').select('*').eq('id', id).single()
 *     );
 *   }
 * }
 * ```
 * 
 * @author Platform Team
 * @since 1.0.0
 * @version 2.0.0 - Enhanced with caching and retry logic
 */

import { supabase } from '../../../integrations/supabase/client';

/**
 * Configuration interface for retry logic
 * 
 * @interface RetryConfig
 * @property {number} maxAttempts - Maximum number of retry attempts (default: 3)
 * @property {number} baseDelay - Base delay in milliseconds before first retry (default: 1000)
 * @property {number} maxDelay - Maximum delay in milliseconds (default: 10000)
 * @property {number} backoffFactor - Multiplier for exponential backoff (default: 2)
 * @property {Function} [retryCondition] - Optional function to determine if error is retryable
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: any) => boolean;
}

/**
 * Configuration interface for caching behavior
 * 
 * @interface CacheConfig
 * @property {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @property {number} maxSize - Maximum number of cached entries (default: 100)
 * @property {Function} [keyGenerator] - Optional custom cache key generator
 */
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number;
  keyGenerator?: (...args: any[]) => string;
}

/**
 * Enhanced service error class with detailed context and retry information
 * 
 * Provides structured error handling with categorization, context preservation,
 * and retry capability indication for consistent error management across services.
 * 
 * @class ServiceError
 * @extends Error
 * @property {string} code - Specific error code for programmatic handling
 * @property {Record<string, any>} context - Additional error context and metadata
 * @property {boolean} isRetryable - Indicates if the operation can be retried
 * @property {number} [statusCode] - HTTP status code if applicable
 */
export class ServiceError extends Error {
  public readonly code: string;
  public readonly context: Record<string, any>;
  public readonly isRetryable: boolean;
  public readonly statusCode?: number;

  /**
   * Creates a new ServiceError instance
   * 
   * @param {string} message - Human-readable error message
   * @param {string} [code='UNKNOWN_ERROR'] - Error code for categorization
   * @param {Record<string, any>} [context={}] - Additional error context
   * @param {boolean} [isRetryable=false] - Whether the operation can be retried
   * @param {number} [statusCode] - HTTP status code if applicable
   */
  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    context: Record<string, any> = {},
    isRetryable: boolean = false,
    statusCode?: number
  ) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.context = context;
    this.isRetryable = isRetryable;
    this.statusCode = statusCode;
  }
}

/**
 * Internal cache entry structure with TTL support
 * 
 * @interface CacheEntry
 * @template T - Type of cached data
 * @property {T} data - The cached data
 * @property {number} timestamp - When the entry was cached (milliseconds)
 * @property {number} ttl - Time to live for this entry (milliseconds)
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Enhanced base service class providing comprehensive infrastructure capabilities
 * 
 * This abstract class provides a robust foundation for all service implementations,
 * including automatic retry logic, intelligent caching, error handling, and
 * Supabase integration. All domain services should extend this class.
 * 
 * @abstract
 * @class BaseService
 */
export abstract class BaseService {
  protected readonly serviceName: string;
  private readonly cache = new Map<string, CacheEntry<any>>();
  
  protected readonly defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryCondition: (error: any) => {
      // Retry on network errors, timeouts, and 5xx status codes
      return error?.isRetryable || 
             error?.code === 'NETWORK_ERROR' || 
             error?.code === 'TIMEOUT' ||
             (error?.statusCode >= 500 && error?.statusCode < 600);
    }
  };

  protected readonly defaultCacheConfig: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    keyGenerator: (...args: any[]) => JSON.stringify(args)
  };

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Execute operation with automatic retry logic and exponential backoff
   * 
   * Wraps an operation with configurable retry logic, automatically retrying
   * failed operations based on the retry condition and using exponential backoff
   * to prevent overwhelming downstream services.
   * 
   * @template T - Return type of the operation
   * @param {() => Promise<T>} operation - Async operation to execute with retry
   * @param {Partial<RetryConfig>} [retryConfig={}] - Custom retry configuration
   * @returns {Promise<T>} Promise resolving to operation result
   * @throws {ServiceError} Enhanced error after all retry attempts exhausted
   * 
   * @example
   * ```typescript
   * const result = await this.withRetry(
   *   () => fetch('/api/data').then(r => r.json()),
   *   { maxAttempts: 5, baseDelay: 2000 }
   * );
   * ```
   */
  protected async withRetry<T>(
    operation: () => Promise<T>,
    retryConfig: Partial<RetryConfig> = {}
  ): Promise<T> {
    const config = { ...this.defaultRetryConfig, ...retryConfig };
    let lastError: any;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry if this is the last attempt or error is not retryable
        if (attempt === config.maxAttempts || !config.retryCondition!(error)) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
          config.maxDelay
        );

        this.logRetry(attempt, config.maxAttempts, delay, error);
        await this.sleep(delay);
      }
    }

    throw this.enhanceError(lastError);
  }

  /**
   * Execute operation with intelligent caching
   * 
   * Wraps an operation with TTL-based caching. Results are stored in memory
   * and returned from cache if still valid, otherwise the operation is executed
   * and the result is cached for future use.
   * 
   * @template T - Return type of the operation
   * @param {string} key - Unique cache key for this operation
   * @param {() => Promise<T>} operation - Async operation to execute and cache
   * @param {Partial<CacheConfig>} [cacheConfig={}] - Custom cache configuration
   * @returns {Promise<T>} Promise resolving to operation result (cached or fresh)
   * 
   * @example
   * ```typescript
   * const userData = await this.withCache(
   *   'user:123',
   *   () => fetchUserFromAPI(123),
   *   { ttl: 10 * 60 * 1000 } // 10 minutes
   * );
   * ```
   */
  protected async withCache<T>(
    key: string,
    operation: () => Promise<T>,
    cacheConfig: Partial<CacheConfig> = {}
  ): Promise<T> {
    const config = { ...this.defaultCacheConfig, ...cacheConfig };
    
    // Check cache first
    const cached = this.getFromCache<T>(key, config.ttl);
    if (cached !== null) {
      return cached;
    }

    // Execute operation and cache result
    const result = await operation();
    this.setInCache(key, result, config);
    
    return result;
  }

  /**
   * Execute operation with both retry logic and caching
   * 
   * Combines the benefits of caching and retry logic. Checks cache first,
   * and if no valid cached result exists, executes the operation with retry
   * logic and caches the successful result.
   * 
   * @template T - Return type of the operation
   * @param {string} key - Unique cache key for this operation
   * @param {() => Promise<T>} operation - Async operation to execute
   * @param {Partial<RetryConfig>} [retryConfig={}] - Custom retry configuration
   * @param {Partial<CacheConfig>} [cacheConfig={}] - Custom cache configuration
   * @returns {Promise<T>} Promise resolving to operation result
   * 
   * @example
   * ```typescript
   * const apiData = await this.withRetryAndCache(
   *   'api:complex-data',
   *   () => complexAPIOperation(),
   *   { maxAttempts: 3 },
   *   { ttl: 15 * 60 * 1000 }
   * );
   * ```
   */
  protected async withRetryAndCache<T>(
    key: string,
    operation: () => Promise<T>,
    retryConfig: Partial<RetryConfig> = {},
    cacheConfig: Partial<CacheConfig> = {}
  ): Promise<T> {
    return this.withCache(
      key,
      () => this.withRetry(operation, retryConfig),
      cacheConfig
    );
  }

  /**
   * Get cached value if not expired
   */
  private getFromCache<T>(key: string, ttl: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set value in cache with TTL
   */
  private setInCache<T>(key: string, data: T, config: CacheConfig): void {
    // Enforce cache size limit
    if (this.cache.size >= config.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: config.ttl
    });
  }

  /**
   * Clear cache entries by pattern or all entries
   * 
   * Removes cached entries either entirely or matching a specific pattern.
   * Useful for cache invalidation after data mutations.
   * 
   * @param {string} [pattern] - Optional regex pattern to match cache keys
   * 
   * @example
   * ```typescript
   * // Clear all cache
   * this.clearCache();
   * 
   * // Clear all user-related cache entries
   * this.clearCache('user:.*');
   * 
   * // Clear specific cache entries
   * this.clearCache('reports:templates:.*');
   * ```
   */
  protected clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Enhance error with service context
   */
  private enhanceError(error: any): ServiceError {
    if (error instanceof ServiceError) {
      return error;
    }

    // Handle Supabase errors
    if (error?.code) {
      const isRetryable = ['PGRST301', '23505'].includes(error.code) === false;
      return new ServiceError(
        error.message || 'Database operation failed',
        error.code,
        { 
          service: this.serviceName,
          details: error.details,
          hint: error.hint 
        },
        isRetryable,
        error.status
      );
    }

    // Handle network errors
    if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
      return new ServiceError(
        'Network connection failed',
        'NETWORK_ERROR',
        { service: this.serviceName, originalError: error.message },
        true
      );
    }

    // Default error handling
    return new ServiceError(
      error?.message || 'Unknown service error',
      'UNKNOWN_ERROR',
      { service: this.serviceName, originalError: error },
      false
    );
  }

  /**
   * Log retry attempt
   */
  private logRetry(attempt: number, maxAttempts: number, delay: number, error: any): void {
    console.warn(`[${this.serviceName}] Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`, {
      error: error?.message,
      code: error?.code
    });
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get the configured Supabase client instance
   * 
   * Provides access to the authenticated Supabase client for database operations.
   * This method should be used by subclasses for all Supabase interactions.
   * 
   * @returns {SupabaseClient} Configured Supabase client instance
   * @protected
   */
  protected getSupabaseClient() {
    return supabase;
  }

  /**
   * Apply date range filters to a Supabase query
   * 
   * Helper method to consistently apply date filtering across all services.
   * Supports both start and end date filtering on any date field.
   * 
   * @template T - Type of the Supabase query builder
   * @param {T} query - Supabase query builder instance
   * @param {Object} [filters] - Filter configuration object
   * @param {Object} [filters.dateRange] - Date range filter configuration
   * @param {Date} [filters.dateRange.startDate] - Start date for filtering
   * @param {Date} [filters.dateRange.endDate] - End date for filtering
   * @param {string} [dateField='created_at'] - Database field name for date filtering
   * @returns {T} Modified query with date filters applied
   * 
   * @example
   * ```typescript
   * let query = this.getSupabaseClient().from('reports').select('*');
   * query = this.applyDateFilters(query, {
   *   dateRange: {
   *     startDate: new Date('2024-01-01'),
   *     endDate: new Date('2024-01-31')
   *   }
   * }, 'generated_at');
   * ```
   */
  protected applyDateFilters<T extends Record<string, any>>(
    query: T,
    filters?: { dateRange?: { startDate?: Date; endDate?: Date } },
    dateField = 'created_at'
  ): T {
    if (filters?.dateRange?.startDate) {
      query = query.gte(dateField, filters.dateRange.startDate.toISOString()) as T;
    }

    if (filters?.dateRange?.endDate) {
      query = query.lte(dateField, filters.dateRange.endDate.toISOString()) as T;
    }

    return query;
  }

  /**
   * Apply product ID filters to a Supabase query
   * 
   * Helper method to consistently apply product filtering across all services.
   * Filters results to only include records with specified product IDs.
   * 
   * @template T - Type of the Supabase query builder
   * @param {T} query - Supabase query builder instance
   * @param {Object} [filters] - Filter configuration object
   * @param {string[]} [filters.productIds] - Array of product IDs to filter by
   * @returns {T} Modified query with product filters applied
   * 
   * @example
   * ```typescript
   * let query = this.getSupabaseClient().from('subscriptions').select('*');
   * query = this.applyProductFilters(query, {
   *   productIds: ['prod-basic', 'prod-premium']
   * });
   * ```
   */
  protected applyProductFilters<T extends Record<string, any>>(
    query: T,
    filters?: { productIds?: string[] }
  ): T {
    if (filters?.productIds?.length) {
      query = query.in('product_id', filters.productIds) as T;
    }
    return query;
  }

  /**
   * Create a standardized cache key for the service
   * 
   * Generates consistent cache keys using service name, operation, and parameters.
   * This ensures cache keys are unique and organized by service.
   * 
   * @param {string} operation - Name of the operation being cached
   * @param {...any[]} params - Parameters to include in the cache key
   * @returns {string} Formatted cache key
   * 
   * @example
   * ```typescript
   * const key = this.createCacheKey('getUser', userId, options);
   * // Returns: "UserService:getUser:["123",{"includeProfile":true}]"
   * ```
   */
  protected createCacheKey(operation: string, ...params: any[]): string {
    return `${this.serviceName}:${operation}:${JSON.stringify(params)}`;
  }

  /**
   * Handle paginated operations with automatic caching
   * 
   * Wraps paginated database operations with caching and provides a consistent
   * pagination interface. Results include metadata for building pagination UI.
   * 
   * @template T - Type of individual items in the result set
   * @param {Function} operation - Function that performs the paginated query
   * @param {number} [page=1] - Page number (1-based)
   * @param {number} [limit=20] - Number of items per page
   * @param {string} [cacheKey] - Optional custom cache key
   * @returns {Promise<Object>} Paginated result with metadata
   * @returns {T[]} returns.data - Array of items for the current page
   * @returns {number} returns.totalCount - Total number of items across all pages
   * @returns {number} returns.page - Current page number
   * @returns {number} returns.totalPages - Total number of pages
   * 
   * @example
   * ```typescript
   * const result = await this.withPagination(
   *   (offset, limit) => this.getSupabaseClient()
   *     .from('users')
   *     .select('*', { count: 'exact' })
   *     .range(offset, offset + limit - 1),
   *   1, // page
   *   10 // limit
   * );
   * 
   * console.log(`Page ${result.page} of ${result.totalPages}`);
   * console.log(`Showing ${result.data.length} of ${result.totalCount} items`);
   * ```
   */
  protected async withPagination<T>(
    operation: (offset: number, limit: number) => Promise<{ data: T[]; count: number }>,
    page: number = 1,
    limit: number = 20,
    cacheKey?: string
  ): Promise<{ data: T[]; totalCount: number; page: number; totalPages: number }> {
    const offset = (page - 1) * limit;
    const key = cacheKey || this.createCacheKey('pagination', offset, limit);

    const result = await this.withCache(key, () => operation(offset, limit));
    
    return {
      data: result.data,
      totalCount: result.count,
      page,
      totalPages: Math.ceil(result.count / limit)
    };
  }
}