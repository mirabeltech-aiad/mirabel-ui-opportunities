/**
 * @fileoverview Type definitions for Reports feature hooks
 * 
 * Comprehensive type definitions for all hook return values and parameters
 * in the reports feature to ensure consistent interfaces.
 */

import { ReportWithBusinessModel } from '../utils/businessModelFilters';
import { BusinessModel } from '@/contexts/BusinessModelContext';

/**
 * Return type for useReportsFiltering hook
 */
export interface ReportsFilteringHookResult {
  /** Current search query string */
  searchQuery: string;
  /** Function to update search query */
  setSearchQuery: (query: string) => void;
  /** Currently active category filter */
  activeCategory: string;
  /** Function to update active category */
  setActiveCategory: (category: string) => void;
  /** Array of favorite report IDs */
  favoriteReports: string[];
  /** Function to toggle favorite status */
  toggleFavorite: (reportId: string) => void;
  /** All filtered reports based on business model */
  filteredReports: ReportWithBusinessModel[];
  /** Reports grouped by category */
  reportsByCategory: Record<string, ReportWithBusinessModel[]>;
  /** Available category names */
  categories: string[];
  /** Reports marked as favorites */
  favoriteReportsData: ReportWithBusinessModel[];
  /** Count of reports per category */
  categoryReportCounts: Record<string, number>;
  /** Reports to display based on current filters */
  displayedReports: ReportWithBusinessModel[];
}

/**
 * Return type for useFilteredReports hook
 */
export interface FilteredReportsHookResult {
  /** Fetched reports from database */
  reports: DatabaseReport[];
  /** Loading state indicator */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Current business model */
  businessModel: BusinessModel;
  /** Function to refresh data */
  refreshReports: () => void;
}

/**
 * Database report structure
 */
export interface DatabaseReport {
  /** Unique identifier */
  id: string;
  /** Report name */
  name: string;
  /** Report description */
  description: string;
  /** Template type */
  template_type: string;
  /** Configuration object */
  template_config: any;
  /** Report parameters */
  parameters: any;
  /** Active status */
  is_active: boolean;
  /** Creation timestamp */
  created_at: string;
  /** Update timestamp */
  updated_at: string;
}

/**
 * Filter state for reports
 */
export interface ReportFilters {
  /** Text search query */
  searchQuery: string;
  /** Selected category */
  category: string;
  /** Business model filter */
  businessModel: BusinessModel;
  /** Status filters */
  status: string[];
  /** Date range filter */
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Pagination state for report listings
 */
export interface PaginationState {
  /** Current page (0-based) */
  page: number;
  /** Items per page */
  limit: number;
  /** Total items count */
  total: number;
  /** Has next page */
  hasNext: boolean;
  /** Has previous page */
  hasPrevious: boolean;
}