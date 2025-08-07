/**
 * @fileoverview Reports Feature API Reference
 * 
 * Complete API documentation for the Reports feature, including all interfaces,
 * classes, methods, and their usage patterns. This serves as the definitive
 * reference for developers working with the Reports system.
 * 
 * @author Reports Team
 * @since 1.0.0
 * @version 2.0.0
 */

/**
 * ========================================================================================
 * API REFERENCE - SERVICES
 * ========================================================================================
 */

/**
 * @namespace ReportsApiService
 * @description Main service class for all report-related API operations
 * 
 * @example
 * ```typescript
 * import { reportsApiService } from '@/features/reports/services';
 * 
 * // Get all templates for current business model
 * const templates = await reportsApiService.getReportTemplates('media');
 * 
 * // Generate a new report
 * const report = await reportsApiService.generateReport(templateId, params);
 * ```
 */
export interface ReportsApiServiceReference {
  /**
   * Retrieves all available reports
   * 
   * @returns {Promise<Report[]>} Array of available reports
   * @throws {ApiError} When request fails
   * 
   * @example
   * ```typescript
   * const reports = await reportsApiService.getReports();
   * console.log(`Found ${reports.length} reports`);
   * ```
   */
  getReports(): Promise<any[]>;

  /**
   * Fetches report templates filtered by business model
   * 
   * @param {BusinessModel} businessModel - Business model context ('media' | 'saas')
   * @returns {Promise<ReportTemplate[]>} Filtered templates array
   * @throws {ApiError} When database query fails
   * 
   * @cache 10 minutes
   * @retry 2 attempts
   * 
   * @example
   * ```typescript
   * // Get media-specific templates
   * const mediaTemplates = await reportsApiService.getReportTemplates('media');
   * 
   * // Get SaaS-specific templates
   * const saasTemplates = await reportsApiService.getReportTemplates('saas');
   * ```
   */
  getReportTemplates(businessModel: string): Promise<any[]>;

  /**
   * Initiates report generation with specified parameters
   * 
   * @param {string} templateId - ID of template to use
   * @param {Record<string, any>} parameters - Generation parameters
   * @returns {Promise<ReportDataResponse>} Generation response with status
   * @throws {ApiError} When generation fails to start
   * 
   * @retry 2 attempts
   * @cache_invalidation Clears getReportStatus cache
   * 
   * @example
   * ```typescript
   * const params = {
   *   dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
   *   format: 'pdf',
   *   productIds: ['prod-1', 'prod-2']
   * };
   * 
   * const response = await reportsApiService.generateReport('template-123', params);
   * console.log(`Report ${response.reportId} is ${response.status}`);
   * ```
   */
  generateReport(templateId: string, parameters: Record<string, any>): Promise<any>;

  /**
   * Retrieves current status and data of a generated report
   * 
   * @param {string} reportId - ID of the report to check
   * @returns {Promise<ReportDataResponse>} Current status and available data
   * @throws {ApiError} When status cannot be retrieved
   * 
   * @cache 30 seconds
   * @retry 3 attempts
   * 
   * @example
   * ```typescript
   * const status = await reportsApiService.getReportStatus('report-123');
   * 
   * switch (status.status) {
   *   case 'generating':
   *     console.log('Still processing...');
   *     break;
   *   case 'published':
   *     console.log('Report ready!', status.data);
   *     break;
   *   case 'archived':
   *     console.log('Report failed or expired');
   *     break;
   * }
   * ```
   */
  getReportStatus(reportId: string): Promise<any>;

  /**
   * Creates a schedule for automatic report generation
   * 
   * @param {string} templateId - Template to use for scheduled reports
   * @param {Object} schedule - Schedule configuration
   * @param {string} schedule.frequency - How often to run ('daily'|'weekly'|'monthly')
   * @param {string} schedule.nextRunDate - ISO date for next execution
   * @param {Record<string, any>} schedule.parameters - Parameters for generation
   * @returns {Promise<{scheduleId: string}>} Created schedule identifier
   * @throws {ApiError} When scheduling fails
   * 
   * @retry 2 attempts
   * 
   * @example
   * ```typescript
   * const schedule = {
   *   frequency: 'monthly',
   *   nextRunDate: '2024-02-01T09:00:00Z',
   *   parameters: { format: 'pdf', recipients: ['admin@company.com'] }
   * };
   * 
   * const result = await reportsApiService.scheduleReport('template-123', schedule);
   * console.log(`Scheduled with ID: ${result.scheduleId}`);
   * ```
   */
  scheduleReport(templateId: string, schedule: {
    frequency: string;
    nextRunDate: string;
    parameters: Record<string, any>;
  }): Promise<{ scheduleId: string }>;
}

/**
 * ========================================================================================
 * API REFERENCE - BASE SERVICES
 * ========================================================================================
 */

/**
 * @namespace BaseService
 * @description Enhanced base service with retry, caching, and error handling
 * 
 * @example
 * ```typescript
 * class CustomService extends BaseService {
 *   constructor() {
 *     super('CustomService');
 *   }
 * 
 *   async getData() {
 *     return this.withRetryAndCache(
 *       'data-key',
 *       () => this.getSupabaseClient().from('table').select('*')
 *     );
 *   }
 * }
 * ```
 */
export interface BaseServiceReference {
  /**
   * Execute operation with retry logic and exponential backoff
   * 
   * @template T - Return type
   * @param {() => Promise<T>} operation - Operation to retry
   * @param {Partial<RetryConfig>} config - Retry configuration
   * @returns {Promise<T>} Operation result
   * @throws {ServiceError} After all retries exhausted
   * 
   * @default_config { maxAttempts: 3, baseDelay: 1000, backoffFactor: 2 }
   * 
   * @example
   * ```typescript
   * const result = await this.withRetry(
   *   () => fetch('/api/data'),
   *   { maxAttempts: 5, baseDelay: 2000 }
   * );
   * ```
   */
  withRetry<T>(operation: () => Promise<T>, config?: any): Promise<T>;

  /**
   * Execute operation with intelligent caching
   * 
   * @template T - Return type
   * @param {string} key - Cache key
   * @param {() => Promise<T>} operation - Operation to cache
   * @param {Partial<CacheConfig>} config - Cache configuration
   * @returns {Promise<T>} Cached or fresh result
   * 
   * @default_config { ttl: 300000, maxSize: 100 }
   * 
   * @example
   * ```typescript
   * const data = await this.withCache(
   *   'user:123',
   *   () => fetchUser(123),
   *   { ttl: 600000 } // 10 minutes
   * );
   * ```
   */
  withCache<T>(key: string, operation: () => Promise<T>, config?: any): Promise<T>;

  /**
   * Execute operation with both retry and caching
   * 
   * @template T - Return type
   * @param {string} key - Cache key
   * @param {() => Promise<T>} operation - Operation to execute
   * @param {Partial<RetryConfig>} retryConfig - Retry configuration
   * @param {Partial<CacheConfig>} cacheConfig - Cache configuration
   * @returns {Promise<T>} Operation result
   * 
   * @example
   * ```typescript
   * const apiData = await this.withRetryAndCache(
   *   'complex-data',
   *   () => complexAPICall(),
   *   { maxAttempts: 3 },
   *   { ttl: 900000 } // 15 minutes
   * );
   * ```
   */
  withRetryAndCache<T>(key: string, operation: () => Promise<T>, retryConfig?: any, cacheConfig?: any): Promise<T>;

  /**
   * Clear cache entries by pattern or completely
   * 
   * @param {string} [pattern] - Regex pattern for selective clearing
   * 
   * @example
   * ```typescript
   * // Clear all cache
   * this.clearCache();
   * 
   * // Clear user-related cache
   * this.clearCache('user:.*');
   * ```
   */
  clearCache(pattern?: string): void;

  /**
   * Apply date range filters to Supabase query
   * 
   * @template T - Query builder type
   * @param {T} query - Supabase query builder
   * @param {Object} filters - Filter configuration
   * @param {string} dateField - Database field for filtering
   * @returns {T} Modified query
   * 
   * @example
   * ```typescript
   * let query = supabase.from('orders').select('*');
   * query = this.applyDateFilters(query, {
   *   dateRange: { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') }
   * }, 'order_date');
   * ```
   */
  applyDateFilters<T>(query: T, filters?: any, dateField?: string): T;

  /**
   * Apply product ID filters to Supabase query
   * 
   * @template T - Query builder type
   * @param {T} query - Supabase query builder
   * @param {Object} filters - Filter configuration
   * @returns {T} Modified query
   * 
   * @example
   * ```typescript
   * let query = supabase.from('subscriptions').select('*');
   * query = this.applyProductFilters(query, {
   *   productIds: ['prod-1', 'prod-2']
   * });
   * ```
   */
  applyProductFilters<T>(query: T, filters?: any): T;

  /**
   * Handle paginated operations with caching
   * 
   * @template T - Item type
   * @param {Function} operation - Paginated operation
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @param {string} cacheKey - Optional cache key
   * @returns {Promise<PaginatedResult<T>>} Paginated result
   * 
   * @example
   * ```typescript
   * const result = await this.withPagination(
   *   (offset, limit) => supabase.from('users').select('*').range(offset, offset + limit - 1),
   *   1, // page
   *   20 // limit
   * );
   * ```
   */
  withPagination<T>(operation: Function, page?: number, limit?: number, cacheKey?: string): Promise<any>;
}

/**
 * ========================================================================================
 * API REFERENCE - ERROR HANDLING
 * ========================================================================================
 */

/**
 * @namespace ServiceError
 * @description Enhanced error class with context and retry information
 * 
 * @example
 * ```typescript
 * try {
 *   await someOperation();
 * } catch (error) {
 *   if (error instanceof ServiceError) {
 *     console.log(`Error code: ${error.code}`);
 *     console.log(`Retryable: ${error.isRetryable}`);
 *     console.log(`Context:`, error.context);
 *   }
 * }
 * ```
 */
export interface ServiceErrorReference {
  /**
   * Error code for programmatic handling
   * @type {string}
   * 
   * Common codes:
   * - 'NETWORK_ERROR': Network connectivity issues
   * - 'DATABASE_ERROR': Database operation failures
   * - 'VALIDATION_ERROR': Input validation failures
   * - 'PERMISSION_ERROR': Authorization failures
   * - 'QUOTA_EXCEEDED': Rate limit or quota violations
   * - 'TEMPLATE_NOT_FOUND': Report template not found
   * - 'INVALID_PARAMETERS': Invalid request parameters
   */
  readonly code: string;

  /**
   * Additional error context and metadata
   * @type {Record<string, any>}
   * 
   * @example
   * ```typescript
   * error.context = {
   *   service: 'ReportsAPI',
   *   operation: 'generateReport',
   *   templateId: 'template-123',
   *   userId: 'user-456'
   * };
   * ```
   */
  readonly context: Record<string, any>;

  /**
   * Indicates if the operation can be retried
   * @type {boolean}
   */
  readonly isRetryable: boolean;

  /**
   * HTTP status code if applicable
   * @type {number | undefined}
   */
  readonly statusCode?: number;
}

/**
 * ========================================================================================
 * API REFERENCE - TYPE DEFINITIONS
 * ========================================================================================
 */

/**
 * Report template configuration
 */
export interface ReportTemplateReference {
  /** Unique template identifier */
  id: string;
  
  /** Human-readable template name */
  name: string;
  
  /** Detailed template description */
  description: string;
  
  /** Business models this template supports */
  applicable_company_types: string[];
  
  /** Template-specific parameters schema */
  parameters: Record<string, any>;
  
  /** Whether template is currently active */
  is_active: boolean;
  
  /** SQL query for data extraction */
  sql_query?: string;
  
  /** Output format (pdf, excel, csv) */
  output_format: string;
  
  /** Template version */
  version: string;
}

/**
 * Report generation response
 */
export interface ReportDataResponseReference {
  /** Generated report identifier */
  reportId: string;
  
  /** Current generation status */
  status: 'draft' | 'generating' | 'published' | 'pending' | 'approved' | 'archived';
  
  /** Report data (when completed) */
  data: any | null;
  
  /** Generation timestamp */
  generatedAt: string;
}

/**
 * Report filtering options
 */
export interface ReportFiltersReference {
  /** Date range for filtering */
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  
  /** Product IDs to include */
  productIds?: string[];
  
  /** Business unit IDs to include */
  businessUnitIds?: string[];
  
  /** Status values to filter by */
  status?: string[];
  
  /** Search query for text fields */
  search?: string;
}

/**
 * ========================================================================================
 * CONFIGURATION REFERENCE
 * ========================================================================================
 */

/**
 * Default service configurations
 */
export const DefaultConfigurations = {
  /**
   * Retry configuration defaults
   */
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2
  },
  
  /**
   * Cache configuration defaults
   */
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  },
  
  /**
   * Report-specific timeouts
   */
  reports: {
    generationTimeout: 30 * 60 * 1000, // 30 minutes
    statusPollInterval: 5 * 1000, // 5 seconds
    templateCacheTtl: 10 * 60 * 1000, // 10 minutes
    statusCacheTtl: 30 * 1000 // 30 seconds
  }
};

/**
 * ========================================================================================
 * USAGE PATTERNS AND BEST PRACTICES
 * ========================================================================================
 */

/**
 * Recommended usage patterns for different scenarios
 */
export const UsagePatterns = {
  /**
   * Pattern: Simple report generation
   * Use when: Basic report needs without complex requirements
   */
  simpleGeneration: `
    const response = await reportsApiService.generateReport(templateId, params);
    const result = await pollReportCompletion(response.reportId);
  `,
  
  /**
   * Pattern: Cached template fetching
   * Use when: Displaying template lists that don't change frequently
   */
  cachedTemplates: `
    const templates = await reportsApiService.getReportTemplates(businessModel);
    // Results cached for 10 minutes automatically
  `,
  
  /**
   * Pattern: Custom service implementation
   * Use when: Domain-specific report logic is needed
   */
  customService: `
    class DomainReportService extends BaseReportService {
      async getDomainReport(filters) {
        return this.withRetryAndCache(
          this.createCacheKey('domainReport', filters),
          () => this.performDomainSpecificOperation(filters)
        );
      }
    }
  `,
  
  /**
   * Pattern: Error handling
   * Use when: Robust error handling is required
   */
  errorHandling: `
    try {
      const result = await reportsApiService.generateReport(id, params);
      return result;
    } catch (error) {
      if (error instanceof ServiceError) {
        switch (error.code) {
          case 'TEMPLATE_NOT_FOUND':
            return handleMissingTemplate();
          case 'INVALID_PARAMETERS':
            return handleInvalidParams(error.context);
          default:
            throw error;
        }
      }
      throw error;
    }
  `
};

/**
 * ========================================================================================
 * MIGRATION GUIDE
 * ========================================================================================
 */

/**
 * Migration from v1.x to v2.x
 */
export const MigrationGuide = {
  /**
   * Breaking changes in v2.0
   */
  breakingChanges: [
    'BaseReportService now extends enhanced BaseService',
    'Error handling uses ServiceError instead of generic Error',
    'Cache keys are automatically prefixed with service name',
    'Retry logic is now configurable and enabled by default'
  ],
  
  /**
   * Migration steps
   */
  steps: [
    '1. Update service imports to use new base classes',
    '2. Replace manual error handling with ServiceError checking',
    '3. Remove manual retry logic (now handled automatically)',
    '4. Update cache key generation to use createCacheKey method',
    '5. Test error scenarios with new error types'
  ],
  
  /**
   * Code examples
   */
  before: `
    // v1.x approach
    class OldService {
      async getData() {
        try {
          const result = await supabase.from('table').select('*');
          return result.data;
        } catch (error) {
          console.error(error);
          throw new Error('Operation failed');
        }
      }
    }
  `,
  
  after: `
    // v2.x approach
    class NewService extends BaseService {
      constructor() {
        super('NewService');
      }
      
      async getData() {
        return this.withRetryAndCache(
          this.createCacheKey('getData'),
          async () => {
            const { data, error } = await this.getSupabaseClient()
              .from('table')
              .select('*');
            
            if (error) {
              throw new ServiceError('Data fetch failed', 'DATABASE_ERROR', { table: 'table' }, true);
            }
            
            return data;
          }
        );
      }
    }
  `
};

/**
 * ========================================================================================
 */