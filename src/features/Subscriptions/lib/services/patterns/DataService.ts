/**
 * @fileoverview Generic data service pattern with CRUD operations
 */

import { BaseService, ServiceError } from '../base';

export interface DataServiceConfig {
  tableName: string;
  cachePrefix?: string;
  defaultRetryAttempts?: number;
  defaultCacheTtl?: number;
}

export interface QueryFilters {
  dateRange?: { startDate?: Date; endDate?: Date };
  productIds?: string[];
  businessUnitIds?: string[];
  status?: string[];
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Generic data service with standardized CRUD operations
 */
export class DataService<T extends Record<string, any>> extends BaseService {
  protected readonly config: DataServiceConfig;

  constructor(config: DataServiceConfig) {
    super(`DataService:${config.tableName}`);
    this.config = {
      cachePrefix: config.tableName,
      defaultRetryAttempts: 3,
      defaultCacheTtl: 5 * 60 * 1000, // 5 minutes
      ...config
    };
  }

  /**
   * Find all records with optional filtering and pagination
   */
  async findAll(
    filters?: QueryFilters,
    pagination?: PaginationOptions,
    cacheOptions?: { ttl?: number; force?: boolean }
  ): Promise<{ data: T[]; totalCount: number; page: number; totalPages: number }> {
    const cacheKey = this.createCacheKey('findAll', filters, pagination);
    
    if (cacheOptions?.force) {
      this.clearCache(cacheKey);
    }

    return this.withRetryAndCache(
      cacheKey,
      async () => {
        let query = this.getSupabaseClient()
          .from(this.config.tableName as any)
          .select('*', { count: 'exact' });

        // Apply filters
        query = this.applyQueryFilters(query, filters);

        // Apply pagination and sorting
        const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc' } = pagination || {};
        const offset = (page - 1) * limit;
        
        query = query
          .order(sortBy, { ascending: sortOrder === 'asc' })
          .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
          throw new ServiceError(
            `Failed to fetch ${this.config.tableName}`,
            'FETCH_ERROR',
            { table: this.config.tableName, filters, pagination },
            true
          );
        }

        return {
          data: (data || []) as unknown as T[],
          totalCount: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        };
      },
      { maxAttempts: this.config.defaultRetryAttempts },
      { ttl: cacheOptions?.ttl || this.config.defaultCacheTtl }
    );
  }

  /**
   * Find a single record by ID
   */
  async findById(
    id: string,
    cacheOptions?: { ttl?: number; force?: boolean }
  ): Promise<T | null> {
    const cacheKey = this.createCacheKey('findById', id);
    
    if (cacheOptions?.force) {
      this.clearCache(cacheKey);
    }

    return this.withRetryAndCache(
      cacheKey,
      async () => {
        const { data, error } = await this.getSupabaseClient()
          .from(this.config.tableName as any)
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          throw new ServiceError(
            `Failed to fetch ${this.config.tableName} by ID`,
            'FETCH_BY_ID_ERROR',
            { table: this.config.tableName, id },
            true
          );
        }

        return data as unknown as T | null;
      },
      { maxAttempts: this.config.defaultRetryAttempts },
      { ttl: cacheOptions?.ttl || this.config.defaultCacheTtl }
    );
  }

  /**
   * Create a new record
   */
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    return this.withRetry(
      async () => {
        const { data: result, error } = await this.getSupabaseClient()
          .from(this.config.tableName as any)
          .insert(data as any)
          .select()
          .single();

        if (error) {
          throw new ServiceError(
            `Failed to create ${this.config.tableName}`,
            'CREATE_ERROR',
            { table: this.config.tableName, data },
            false
          );
        }

        // Clear related cache entries
        this.clearCache(`${this.config.cachePrefix}:findAll`);
        
        return result as unknown as T;
      },
      { maxAttempts: 2 }
    );
  }

  /**
   * Update an existing record
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<T> {
    return this.withRetry(
      async () => {
        const { data: result, error } = await this.getSupabaseClient()
          .from(this.config.tableName as any)
          .update(data as any)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw new ServiceError(
            `Failed to update ${this.config.tableName}`,
            'UPDATE_ERROR',
            { table: this.config.tableName, id, data },
            false
          );
        }

        // Clear related cache entries
        this.clearCache(`${this.config.cachePrefix}:findById:${id}`);
        this.clearCache(`${this.config.cachePrefix}:findAll`);
        
        return result as unknown as T;
      },
      { maxAttempts: 2 }
    );
  }

  /**
   * Delete a record
   */
  async delete(id: string): Promise<void> {
    return this.withRetry(
      async () => {
        const { error } = await this.getSupabaseClient()
          .from(this.config.tableName as any)
          .delete()
          .eq('id', id);

        if (error) {
          throw new ServiceError(
            `Failed to delete ${this.config.tableName}`,
            'DELETE_ERROR',
            { table: this.config.tableName, id },
            false
          );
        }

        // Clear related cache entries
        this.clearCache(`${this.config.cachePrefix}:findById:${id}`);
        this.clearCache(`${this.config.cachePrefix}:findAll`);
      },
      { maxAttempts: 2 }
    );
  }

  /**
   * Apply filters to Supabase query
   */
  protected applyQueryFilters(query: any, filters?: QueryFilters): any {
    if (!filters) return query;

    // Apply date filters
    if (filters.dateRange) {
      query = this.applyDateFilters(query, { dateRange: filters.dateRange });
    }

    // Apply product filters
    if (filters.productIds?.length) {
      query = this.applyProductFilters(query, { productIds: filters.productIds });
    }

    // Apply business unit filters
    if (filters.businessUnitIds?.length) {
      query = query.in('business_unit_id', filters.businessUnitIds);
    }

    // Apply status filters
    if (filters.status?.length) {
      query = query.in('status', filters.status);
    }

    // Apply search filter
    if (filters.search) {
      // This is a basic implementation - customize based on searchable fields
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    return query;
  }

  /**
   * Get aggregated statistics
   */
  async getStats(filters?: QueryFilters): Promise<Record<string, number>> {
    const cacheKey = this.createCacheKey('getStats', filters);
    
    return this.withRetryAndCache(
      cacheKey,
      async () => {
        let query = this.getSupabaseClient()
          .from(this.config.tableName as any)
          .select('*', { count: 'exact', head: true });

        query = this.applyQueryFilters(query, filters);

        const { count, error } = await query;

        if (error) {
          throw new ServiceError(
            `Failed to get stats for ${this.config.tableName}`,
            'STATS_ERROR',
            { table: this.config.tableName, filters },
            true
          );
        }

        return {
          total: count || 0
        };
      },
      { maxAttempts: this.config.defaultRetryAttempts },
      { ttl: 60 * 1000 } // 1 minute cache for stats
    );
  }
}