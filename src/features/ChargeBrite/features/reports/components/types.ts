/**
 * @fileoverview Component prop type definitions for Reports feature
 * 
 * Centralized type definitions for all report component props.
 * Ensures consistent interfaces across the feature.
 */

import { BusinessModel } from '@/contexts/BusinessModelContext';

/**
 * Base report structure for display components
 */
export interface Report {
  /** Unique identifier for the report */
  id: string;
  /** Display title of the report */
  title: string;
  /** Detailed description of report contents */
  description: string;
  /** Report category for grouping */
  category: string;
  /** Search keywords for filtering */
  keywords: string[];
  /** Theme color for visual consistency */
  color: string;
  /** Icon color for visual hierarchy */
  iconColor: string;
  /** Optional React component for rendering */
  component?: React.ComponentType<any>;
}

/**
 * Props for individual report card component
 */
export interface ReportCardProps {
  /** Report data to display */
  report: Report;
  /** Callback when report is selected */
  onSelect: (reportId: string) => void;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for reports directory header component
 */
export interface ReportsHeaderProps {
  /** Total number of available reports */
  totalReports: number;
  /** Number of reports after filtering */
  filteredCount: number;
  /** Current business model context */
  businessModel: BusinessModel;
  /** Loading state indicator */
  isLoading: boolean;
  /** Error state for display */
  error: Error | null;
  /** Callback to refresh report data */
  onRefresh: () => void;
}

/**
 * Props for main reports directory component
 */
export interface ReportsDirectoryProps {
  /** All available reports */
  reports: Report[];
  /** Filtered reports to display */
  filteredReports: Report[];
  /** Callback when a report is selected */
  onReportSelect: (reportId: string) => void;
}

/**
 * Props for reports filter bar component
 */
export interface ReportsFilterBarProps {
  /** Callback when search query changes */
  onSearchChange?: (searchTerm: string) => void;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Date range filter for reports
 */
export interface DateRangeFilter {
  /** Start date for the range */
  startDate?: Date;
  /** End date for the range */
  endDate?: Date;
}

/**
 * Common props for individual report components
 */
export interface BaseReportProps {
  /** Optional date range filter */
  dateRange?: DateRangeFilter;
  /** Selected time period preset */
  selectedPeriod?: string;
  /** Optional additional CSS classes */
  className?: string;
}