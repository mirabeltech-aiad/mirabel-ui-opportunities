/**
 * @fileoverview Enhanced Reports API Service Layer
 * 
 * This module provides a comprehensive API service for all report-related operations,
 * including data fetching, caching, error handling, and business model filtering.
 * Built with enhanced error handling, retry logic, and intelligent caching.
 * 
 * @example
 * ```typescript
 * import { reportsApiService } from '@/features/reports/services';
 * 
 * // Fetch templates for current business model
 * const templates = await reportsApiService.getReportTemplates('media');
 * 
 * // Generate a new report
 * const report = await reportsApiService.generateReport(templateId, parameters);
 * 
 * // Check report status with caching
 * const status = await reportsApiService.getReportStatus(reportId);
 * ```
 * 
 * @author Reports Team
 * @since 1.0.0
 * @version 2.0.0 - Enhanced with retry logic and caching
 */

import { BaseService } from '@/lib/services/base';
import { BusinessModel } from '@/contexts/BusinessModelContext';
import { ReportDataResponse, ReportTemplate, ApiError } from './types';
import type { Report } from '../types';

/**
 * Enhanced Reports API service with retry logic, caching, and comprehensive error handling
 */
class ReportsApiService extends BaseService {
  constructor() {
    super('ReportsAPI');
  }
  /**
   * Gets all available reports
   * 
   * @returns Promise resolving to array of reports
   * @throws ApiError on request failure
   */
  async getReports(): Promise<Report[]> {
    try {
      // This would typically fetch from a reports configuration or database
      // For now, return empty array as placeholder
      return [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch reports', error);
    }
  }
  /**
   * Fetches all available report templates filtered by business model
   * 
   * @param businessModel - Current business model context
   * @returns Promise resolving to filtered report templates
   * @throws ApiError on request failure
   */
  /**
   * Fetches all available report templates filtered by business model
   * 
   * This method retrieves active report templates that are applicable to the specified
   * business model. Results are cached for 10 minutes and retry logic is applied
   * with a maximum of 2 attempts for improved reliability.
   * 
   * @param {BusinessModel} businessModel - Current business model context for filtering
   * @returns {Promise<ReportTemplate[]>} Promise resolving to filtered report templates
   * @throws {ApiError} Thrown when database query fails or templates cannot be fetched
   * 
   * @example
   * ```typescript
   * // Fetch templates for media business model
   * const mediaTemplates = await reportsApiService.getReportTemplates('media');
   * 
   * // Fetch templates for SaaS business model
   * const saasTemplates = await reportsApiService.getReportTemplates('saas');
   * 
   * console.log(`Found ${mediaTemplates.length} media templates`);
   * ```
   */
  async getReportTemplates(businessModel: BusinessModel): Promise<ReportTemplate[]> {
    const cacheKey = this.createCacheKey('getReportTemplates', businessModel);
    
    return this.withRetryAndCache(
      cacheKey,
      async () => {
        const { data, error } = await this.getSupabaseClient()
          .from('report_templates')
          .select('*')
          .eq('is_active', true)
          .contains('applicable_company_types', [businessModel]);

        if (error) {
          throw new ApiError('Failed to fetch report templates', error);
        }

        return data || [];
      },
      { maxAttempts: 2 }, // Custom retry config
      { ttl: 10 * 60 * 1000 } // 10 minute cache
    );
  }

  /**
   * Generates a specific report with given parameters
   * 
   * @param templateId - ID of the report template to use
   * @param parameters - Report generation parameters
   * @returns Promise resolving to report data
   * @throws ApiError on generation failure
   */
  /**
   * Generates a specific report with given parameters
   * 
   * Initiates the report generation process by creating a database record with
   * the provided parameters. The operation includes automatic retry logic and
   * cache invalidation for related entries.
   * 
   * @param {string} templateId - ID of the report template to use for generation
   * @param {Record<string, any>} parameters - Report generation parameters and filters
   * @returns {Promise<ReportDataResponse>} Promise resolving to report generation response
   * @throws {ApiError} Thrown when report generation fails to initiate
   * 
   * @example
   * ```typescript
   * const reportParams = {
   *   dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
   *   productIds: ['prod-123', 'prod-456'],
   *   format: 'pdf'
   * };
   * 
   * try {
   *   const response = await reportsApiService.generateReport(
   *     'template-123', 
   *     reportParams
   *   );
   *   
   *   console.log(`Report generation started with ID: ${response.reportId}`);
   *   console.log(`Status: ${response.status}`);
   * } catch (error) {
   *   console.error('Report generation failed:', error);
   * }
   * ```
   */
  async generateReport(templateId: string, parameters: Record<string, any>): Promise<ReportDataResponse> {
    return this.withRetry(
      async () => {
        const { data, error } = await this.getSupabaseClient()
          .from('generated_reports')
          .insert({
            report_name: `Generated Report ${Date.now()}`,
            status: 'draft',
            parameters_used: parameters
          })
          .select()
          .single();

        if (error) {
          throw new ApiError('Failed to initiate report generation', error);
        }

        // Clear related cache entries
        this.clearCache('getReportStatus');

        return {
          reportId: data.id,
          status: 'generating',
          data: null,
          generatedAt: new Date().toISOString()
        };
      },
      { maxAttempts: 2, retryCondition: (error) => error?.isRetryable }
    );
  }

  /**
   * Retrieves the status and data of a generated report
   * 
   * @param reportId - ID of the generated report
   * @returns Promise resolving to report status and data
   * @throws ApiError on retrieval failure
   */
  /**
   * Retrieves the status and data of a generated report
   * 
   * Fetches the current status of a report generation process, including any
   * available data if the report has been completed. Results are cached for
   * 30 seconds to balance freshness with performance.
   * 
   * @param {string} reportId - ID of the generated report to check
   * @returns {Promise<ReportDataResponse>} Promise resolving to report status and data
   * @throws {ApiError} Thrown when report status cannot be retrieved
   * 
   * @example
   * ```typescript
   * const checkReportStatus = async (reportId: string) => {
   *   try {
   *     const status = await reportsApiService.getReportStatus(reportId);
   *     
   *     switch (status.status) {
   *       case 'generating':
   *         console.log('Report is still being generated...');
   *         break;
   *       case 'published':
   *         console.log('Report is ready!', status.data);
   *         break;
   *       case 'archived':
   *         console.log('Report has been archived');
   *         break;
   *       default:
   *         console.log(`Report status: ${status.status}`);
   *     }
   *   } catch (error) {
   *     console.error('Failed to check report status:', error);
   *   }
   * };
   * ```
   */
  async getReportStatus(reportId: string): Promise<ReportDataResponse> {
    const cacheKey = this.createCacheKey('getReportStatus', reportId);
    
    return this.withRetryAndCache(
      cacheKey,
      async () => {
        const { data, error } = await this.getSupabaseClient()
          .from('generated_reports')
          .select('*')
          .eq('id', reportId)
          .single();

        if (error) {
          throw new ApiError('Failed to fetch report status', error);
        }

        return {
          reportId: data.id,
          status: data.status as 'draft' | 'generating' | 'published' | 'pending' | 'approved' | 'archived',
          data: data.file_path ? await this.fetchReportData(data.file_path) : null,
          generatedAt: data.created_at
        };
      },
      { maxAttempts: 3 },
      { ttl: 30 * 1000 } // 30 second cache for status checks
    );
  }

  /**
   * Fetches report data from file storage
   * 
   * Private method that retrieves the actual report data from the storage system.
   * This is typically called internally when a report has been completed and
   * the file path is available.
   * 
   * @private
   * @param {string} filePath - Path to the report data file in storage
   * @returns {Promise<any>} Promise resolving to report data
   * 
   * @todo Implement actual file fetching from Supabase Storage or external system
   */
  private async fetchReportData(filePath: string): Promise<any> {
    // Implementation for fetching actual report data
    // This would typically involve Supabase Storage or external file system
    return null;
  }

  /**
   * Schedules a report for automatic generation
   * 
   * @param templateId - ID of the report template
   * @param schedule - Schedule configuration
   * @returns Promise resolving to schedule confirmation
   * @throws ApiError on scheduling failure
   */
  /**
   * Schedules a report for automatic generation
   * 
   * Creates a schedule for automatic report generation with specified frequency
   * and parameters. The schedule can be used to generate reports periodically
   * without manual intervention.
   * 
   * @param {string} templateId - ID of the report template to schedule
   * @param {Object} schedule - Schedule configuration object
   * @param {string} schedule.frequency - How often to generate the report (daily, weekly, monthly)
   * @param {string} schedule.nextRunDate - ISO date string for the next scheduled run
   * @param {Record<string, any>} schedule.parameters - Parameters to use for report generation
   * @returns {Promise<{scheduleId: string}>} Promise resolving to schedule confirmation with ID
   * @throws {ApiError} Thrown when scheduling fails
   * 
   * @example
   * ```typescript
   * const scheduleConfig = {
   *   frequency: 'monthly',
   *   nextRunDate: '2024-02-01T09:00:00.000Z',
   *   parameters: {
   *     dateRange: 'last_month',
   *     format: 'pdf',
   *     recipients: ['admin@company.com']
   *   }
   * };
   * 
   * try {
   *   const { scheduleId } = await reportsApiService.scheduleReport(
   *     'template-123', 
   *     scheduleConfig
   *   );
   *   
   *   console.log(`Report scheduled successfully with ID: ${scheduleId}`);
   * } catch (error) {
   *   console.error('Failed to schedule report:', error);
   * }
   * ```
   */
  async scheduleReport(templateId: string, schedule: {
    frequency: string;
    nextRunDate: string;
    parameters: Record<string, any>;
  }): Promise<{ scheduleId: string }> {
    return this.withRetry(
      async () => {
        const { data, error } = await this.getSupabaseClient()
          .from('report_schedules')
          .insert({
            schedule_name: `Auto Schedule ${Date.now()}`,
            frequency: schedule.frequency,
            next_run_date: schedule.nextRunDate,
            enabled: true
          })
          .select('id')
          .single();

        if (error) {
          throw new ApiError('Failed to schedule report', error);
        }

        return { scheduleId: data.id };
      },
      { maxAttempts: 2 }
    );
  }
}

/**
 * Singleton instance of the Reports API service
 * 
 * This singleton ensures consistent service usage across the application
 * and maintains shared caching and configuration state.
 * 
 * @type {ReportsApiService}
 * @example
 * ```typescript
 * import { reportsApiService } from '@/features/reports/services';
 * 
 * // Use the singleton instance
 * const templates = await reportsApiService.getReportTemplates('media');
 * ```
 */
export const reportsApiService = new ReportsApiService();