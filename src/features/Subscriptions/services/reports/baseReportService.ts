/**
 * @fileoverview Enhanced Base Report Service
 * 
 * Provides a specialized base class for all report-related services, extending
 * the enhanced BaseService with report-specific functionality. This includes
 * comprehensive filter applications, standardized error handling, and optimized
 * caching strategies tailored for reporting operations.
 * 
 * Features:
 * - Combined filter application (date, product, business unit)
 * - Report-specific caching strategies
 * - Enhanced error context for report operations
 * - Consistent filter parameter handling
 * 
 * @example
 * ```typescript
 * class SubscriptionReportService extends BaseReportService {
 *   async getSubscriptionReport(filters: ReportFilters) {
 *     return this.withRetryAndCache(
 *       this.createCacheKey('subscriptionReport', filters),
 *       async () => {
 *         let query = this.getSupabaseClient().from('subscriptions').select('*');
 *         query = this.applyReportFilters(query, filters);
 *         return query;
 *       }
 *     );
 *   }
 * }
 * ```
 * 
 * @author Reports Team
 * @since 1.0.0
 * @version 2.0.0 - Enhanced with BaseService integration
 */

import { BaseService } from '../../lib/services/base';
import { ReportFilters } from './types';

/**
 * Enhanced base report service class with comprehensive filtering and caching
 * 
 * This class extends BaseService to provide report-specific functionality while
 * inheriting all the robust error handling, retry logic, and caching capabilities.
 * It standardizes filter application across all report services.
 * 
 * @abstract
 * @class BaseReportService
 * @extends BaseService
 */
export abstract class BaseReportService extends BaseService {
  /**
   * Creates an instance of BaseReportService
   * 
   * @constructor
   */
  constructor() {
    super('ReportService');
  }

  /**
   * Apply comprehensive report filters to a Supabase query
   * 
   * This method combines multiple filter types commonly used in reporting:
   * date range filtering, product filtering, and other report-specific filters.
   * It provides a consistent interface for applying filters across all report services.
   * 
   * @template T - Type of the Supabase query builder
   * @param {T} query - Supabase query builder instance
   * @param {ReportFilters} [filters] - Comprehensive filter configuration
   * @param {string} [dateField='created_at'] - Database field name for date filtering
   * @returns {T} Modified query with all applicable filters applied
   * 
   * @example
   * ```typescript
   * // Apply comprehensive filters to a report query
   * let query = this.getSupabaseClient().from('sales_data').select('*');
   * query = this.applyReportFilters(query, {
   *   dateRange: {
   *     startDate: new Date('2024-01-01'),
   *     endDate: new Date('2024-01-31')
   *   },
   *   productIds: ['prod-1', 'prod-2'],
   *   businessUnitIds: ['unit-1'],
   *   status: ['active', 'pending']
   * }, 'sale_date');
   * ```
   */
  protected applyReportFilters<T extends Record<string, any>>(
    query: T,
    filters?: ReportFilters,
    dateField = 'created_at'
  ): T {
    // Apply date filters
    query = this.applyDateFilters(query, filters, dateField);
    
    // Apply product filters
    query = this.applyProductFilters(query, filters);
    
    return query;
  }
}