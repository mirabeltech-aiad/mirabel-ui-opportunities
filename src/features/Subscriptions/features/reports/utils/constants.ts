/**
 * @fileoverview Constants for Reports feature
 * 
 * Centralized constants used throughout the reports feature
 * for consistency and maintainability.
 */

/**
 * Report categories for organization and filtering
 */
export const REPORT_CATEGORIES = {
  SUBSCRIBER: 'Subscriber Reports',
  PERFORMANCE: 'Performance Reports', 
  REVENUE: 'Revenue Reports',
  COMPLIANCE: 'Compliance Reports',
  CUSTOM: 'Custom Reports'
} as const;

/**
 * Report status options
 */
export const REPORT_STATUS = {
  DRAFT: 'draft',
  GENERATING: 'generating',
  PUBLISHED: 'published',
  PENDING: 'pending',
  APPROVED: 'approved',
  ARCHIVED: 'archived',
  FAILED: 'failed'
} as const;

/**
 * Time period presets for reports
 */
export const TIME_PERIODS = {
  LAST_7_DAYS: 'last7days',
  LAST_30_DAYS: 'last30days',
  LAST_90_DAYS: 'last90days',
  LAST_YEAR: 'lastyear',
  CUSTOM: 'custom'
} as const;

/**
 * Output formats supported by reports
 */
export const OUTPUT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json'
} as const;

/**
 * Business model types
 */
export const BUSINESS_MODELS = {
  MEDIA: 'media',
  SAAS: 'saas'
} as const;

/**
 * Default pagination settings
 */
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  INITIAL_PAGE: 0
} as const;

/**
 * Color scheme for report categories
 */
export const CATEGORY_COLORS = {
  [REPORT_CATEGORIES.SUBSCRIBER]: '#0ea5e9',
  [REPORT_CATEGORIES.PERFORMANCE]: '#3b82f6', 
  [REPORT_CATEGORIES.REVENUE]: '#6366f1',
  [REPORT_CATEGORIES.COMPLIANCE]: '#8b5cf6',
  [REPORT_CATEGORIES.CUSTOM]: '#a855f7'
} as const;

/**
 * Icon colors for report categories
 */
export const CATEGORY_ICON_COLORS = {
  [REPORT_CATEGORIES.SUBSCRIBER]: 'text-sky-500',
  [REPORT_CATEGORIES.PERFORMANCE]: 'text-blue-500',
  [REPORT_CATEGORIES.REVENUE]: 'text-indigo-500', 
  [REPORT_CATEGORIES.COMPLIANCE]: 'text-purple-500',
  [REPORT_CATEGORIES.CUSTOM]: 'text-violet-500'
} as const;

/**
 * Media-specific keywords for filtering
 */
export const MEDIA_KEYWORDS = [
  'print',
  'digital', 
  'magazine',
  'newspaper',
  'issue',
  'fulfillment',
  'circulation',
  'publication',
  'complimentary',
  'gift',
  'subscription',
  'postal',
  'delivery'
] as const;

/**
 * SaaS-specific keywords for filtering
 */
export const SAAS_KEYWORDS = [
  'usage',
  'seat',
  'license',
  'api',
  'feature',
  'tier',
  'plan',
  'billing',
  'mrr',
  'arr',
  'churn',
  'expansion',
  'conversion'
] as const;

/**
 * Default report configuration
 */
export const DEFAULT_REPORT_CONFIG = {
  refreshInterval: 300000, // 5 minutes
  cacheTimeout: 600000,    // 10 minutes
  maxRetries: 3,
  retryDelay: 1000
} as const;