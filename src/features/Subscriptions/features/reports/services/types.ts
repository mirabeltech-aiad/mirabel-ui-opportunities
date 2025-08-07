/**
 * @fileoverview Type definitions for Reports API services
 * 
 * Comprehensive type definitions for all API-related operations,
 * requests, responses, and error handling in the reports feature.
 */

/**
 * Standard API response wrapper for all report operations
 */
export interface ApiResponse<T = any> {
  /** Response data payload */
  data: T;
  /** Operation success indicator */
  success: boolean;
  /** Optional error message */
  message?: string;
  /** Response timestamp */
  timestamp: string;
}

/**
 * Report data response structure
 */
export interface ReportDataResponse {
  /** Unique identifier for the generated report */
  reportId: string;
  /** Current status of the report */
  status: 'draft' | 'generating' | 'published' | 'pending' | 'approved' | 'archived';
  /** Actual report data (null if still generating) */
  data: any | null;
  /** Timestamp when report was generated */
  generatedAt: string;
  /** Optional error message if generation failed */
  error?: string;
}

/**
 * Report template structure from database
 */
export interface ReportTemplate {
  /** Unique identifier */
  id: string;
  /** Template display name */
  name: string;
  /** Detailed description */
  description: string;
  /** Template type/category */
  template_type: string;
  /** SQL query for data extraction */
  sql_query?: string;
  /** Output format specification */
  output_format: string;
  /** Template version */
  version: string;
  /** Applicable company types */
  applicable_company_types: string[];
  /** Template configuration */
  template_config: any; // Using any to match Supabase Json type
  /** Available parameters */
  parameters?: any; // Using any to match Supabase Json type
  /** Active status */
  is_active: boolean;
  /** System template flag */
  is_system_template: boolean;
  /** Audit bureau assignment */
  audit_bureau?: string;
  /** Creation metadata */
  created_at: string;
  updated_at: string;
  created_by?: string;
}

/**
 * Report generation request parameters
 */
export interface ReportGenerationRequest {
  /** Template ID to use for generation */
  templateId: string;
  /** Report parameters */
  parameters: {
    /** Date range for the report */
    dateRange?: {
      startDate: string;
      endDate: string;
    };
    /** Specific products to include */
    productIds?: string[];
    /** Business units to filter */
    businessUnits?: string[];
    /** Output format preference */
    format?: 'pdf' | 'excel' | 'csv' | 'json';
    /** Additional custom parameters */
    [key: string]: any;
  };
  /** Optional scheduling information */
  schedule?: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
    nextRun?: string;
  };
}

/**
 * Report schedule configuration
 */
export interface ReportSchedule {
  /** Unique identifier */
  id: string;
  /** Associated template ID */
  template_id: string;
  /** Schedule name */
  schedule_name: string;
  /** Frequency of generation */
  frequency: string;
  /** Next scheduled run date */
  next_run_date: string;
  /** Last execution date */
  last_run_date?: string;
  /** Schedule enabled status */
  enabled: boolean;
  /** Auto-submit generated reports */
  auto_submit: boolean;
  /** Email recipients for reports */
  email_recipients?: string[];
  /** Schedule metadata */
  created_at: string;
  updated_at: string;
  created_by?: string;
}

/**
 * Generated report record
 */
export interface GeneratedReport {
  /** Unique identifier */
  id: string;
  /** Source template ID */
  template_id: string;
  /** Report name */
  report_name: string;
  /** Report period */
  report_period_start?: string;
  report_period_end?: string;
  /** Current status */
  status: 'draft' | 'generating' | 'completed' | 'published' | 'expired' | 'failed';
  /** Parameters used for generation */
  parameters_used: Record<string, any>;
  /** File path for completed reports */
  file_path?: string;
  /** File size in bytes */
  file_size_bytes?: number;
  /** Download count */
  download_count: number;
  /** Expiration date */
  expires_at?: string;
  /** Generation metadata */
  created_at: string;
  updated_at: string;
  generated_by?: string;
  approved_by?: string;
  approval_date?: string;
  publication_date?: string;
}

/**
 * API error structure for consistent error handling
 */
export class ApiError extends Error {
  /** HTTP status code */
  public status?: number;
  /** Detailed error information */
  public details?: any;
  /** Error code for categorization */
  public code?: string;

  constructor(message: string, details?: any, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
    this.status = status;
    this.code = code;
  }
}

/**
 * Filter parameters for report queries
 */
export interface ReportFilters {
  /** Text search query */
  searchQuery?: string;
  /** Category filter */
  category?: string;
  /** Business model filter */
  businessModel?: string;
  /** Status filter */
  status?: string[];
  /** Date range filter */
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  /** Product filter */
  productIds?: string[];
  /** Business unit filter */
  businessUnits?: string[];
}

/**
 * Pagination parameters for report listings
 */
export interface PaginationParams {
  /** Page number (0-based) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  /** Data items for current page */
  items: T[];
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Has next page flag */
  hasNext: boolean;
  /** Has previous page flag */
  hasPrevious: boolean;
}