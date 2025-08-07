/**
 * @fileoverview Service Factory Pattern
 * 
 * Factory for extending the base service pattern with specialized functionality.
 * Provides standardized service creation with built-in patterns.
 * 
 * @author Factory Team
 * @since 1.0.0
 */

import { BaseService, ServiceError } from '@/lib/services/base';
import { DataService } from '@/lib/services/patterns';

/**
 * Service factory configuration
 */
export interface ServiceFactoryConfig {
  /** Service name for logging and caching */
  name: string;
  /** Whether to enable request/response logging */
  enableLogging?: boolean;
}

/**
 * CRUD service factory configuration
 */
export interface CrudServiceFactoryConfig<T> extends ServiceFactoryConfig {
  /** Database table name */
  tableName: string;
  /** Default cache TTL for this service */
  defaultCacheTtl?: number;
  /** Custom data transformers */
  transformers?: {
    /** Transform data after receiving from API */
    afterRead?: (data: any) => T;
  };
}

/**
 * Creates a specialized CRUD service extending DataService
 */
export function createCrudServiceFactory<T extends Record<string, any>>(
  config: CrudServiceFactoryConfig<T>
) {
  const {
    tableName,
    defaultCacheTtl = 300000,
    transformers = {},
  } = config;

  return class extends DataService<T> {
    constructor() {
      super({
        tableName,
        cachePrefix: `${config.name.toLowerCase()}_`,
        defaultRetryAttempts: 3,
        defaultCacheTtl,
      });
    }

    /**
     * Enhanced findAll with custom transformers
     */
    async findAll(filters?: any, pagination?: any, cacheOptions?: any) {
      const result = await super.findAll(filters, pagination, cacheOptions);
      
      if (transformers.afterRead) {
        result.data = result.data.map(transformers.afterRead!);
      }
      
      return result;
    }
  };
}

/**
 * Factory for creating Supabase-specific services
 */
export function createSupabaseServiceFactory(config: ServiceFactoryConfig) {
  const { name } = config;

  return class extends BaseService {
    constructor() {
      super(name);
    }

    /**
     * Execute Supabase query with error handling
     */
    protected async executeQuery<T>(queryBuilder: any, operation: string): Promise<T> {
      const { data, error } = await queryBuilder;

      if (error) {
        throw new ServiceError(
          `Supabase ${operation} failed: ${error.message}`,
          'SUPABASE_ERROR',
          { operation, error }
        );
      }

      return data;
    }
  };
}

/**
 * Pre-configured service factories for common use cases
 */
export const ServiceFactories = {
  /**
   * Create a subscriptions service
   */
  createSubscriptionsService: () => createCrudServiceFactory({
    name: 'Subscriptions',
    tableName: 'subscriptions',
    defaultCacheTtl: 180000, // 3 minutes
    enableLogging: true,
  }),

  /**
   * Create a reports service
   */
  createReportsService: () => createSupabaseServiceFactory({
    name: 'Reports',
    enableLogging: true,
  }),
} as const;