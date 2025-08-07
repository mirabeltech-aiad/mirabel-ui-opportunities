/**
 * @fileoverview Component props type definitions for Reports feature
 * 
 * Contains all prop interfaces for React components, ensuring type safety
 * and consistent component contracts across the feature.
 */

import type { ReactNode } from 'react';
import type { Report, DateRangeFilter } from '../components/types';
import type { BusinessModel } from '@/contexts/BusinessModelContext';
import type { FeatureState, StateOperations } from './state';
import type { FeatureAPI } from './api';

/**
 * Main Feature Props contract - defines component prop interfaces
 */
export interface FeatureProps {
  // Layout props
  layout: ReportsLayoutProps;
  
  // Directory props
  directory: ReportsDirectoryProps;
  
  // Card props
  card: ReportCardProps;
  
  // Header props
  header: ReportsHeaderProps;
  
  // Filter props
  filterBar: ReportsFilterBarProps;
  
  // Common props
  base: BaseReportProps;
}

/**
 * Layout component props
 */
export interface ReportsLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
  className?: string;
}

/**
 * Main directory component props
 */
export interface ReportsDirectoryProps {
  reports: Report[];
  filteredReports: Report[];
  isLoading?: boolean;
  error?: string | null;
  businessModel?: BusinessModel | null;
  onReportSelect: (report: Report) => void;
  onRefresh?: () => void;
  className?: string;
}

/**
 * Individual report card props
 */
export interface ReportCardProps {
  report: Report;
  isFavorite?: boolean;
  isSelected?: boolean;
  onClick?: (report: Report) => void;
  onFavoriteToggle?: (reportId: string) => void;
  onPreview?: (report: Report) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * Directory header props
 */
export interface ReportsHeaderProps {
  totalCount: number;
  filteredCount: number;
  favoriteCount: number;
  isLoading?: boolean;
  error?: string | null;
  businessModel?: BusinessModel | null;
  onRefresh?: () => void;
  actions?: ReactNode;
  className?: string;
}

/**
 * Filter bar props
 */
export interface ReportsFilterBarProps {
  searchQuery: string;
  activeCategory: string;
  categories: string[];
  categoryReportCounts: Record<string, number>;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  showFavoritesOnly?: boolean;
  onFavoritesToggle?: (show: boolean) => void;
  className?: string;
}

/**
 * Base props for individual report components
 */
export interface BaseReportProps {
  dateRange?: DateRangeFilter;
  selectedPeriod?: string;
  businessModel?: BusinessModel;
  className?: string;
  onExport?: (format: 'pdf' | 'csv' | 'excel') => void;
  onShare?: () => void;
  onSchedule?: () => void;
}

/**
 * Error boundary props
 */
export interface ReportsErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showReportButton?: boolean;
  resetKeys?: Array<string | number>;
}

/**
 * Loading state props
 */
export interface ReportsLoadingStateProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton' | 'pulse';
  className?: string;
}

/**
 * Empty state props
 */
export interface ReportsEmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  variant?: 'no-data' | 'no-results' | 'error' | 'loading';
  className?: string;
}

/**
 * Provider props
 */
export interface ReportsProviderProps {
  children: ReactNode;
  initialState?: Partial<FeatureState>;
  api?: Partial<FeatureAPI>;
}

/**
 * Hook props interfaces
 */
export interface UseReportsFilteringProps {
  reports: Report[];
  initialSearchQuery?: string;
  initialCategory?: string;
  businessModel?: BusinessModel | null;
}

export interface UseFilteredReportsProps {
  businessModel?: BusinessModel | null;
  autoFetch?: boolean;
  refreshInterval?: number;
}

export interface UseReportsDataProps {
  autoLoad?: boolean;
  businessModel?: BusinessModel | null;
  filters?: Record<string, any>;
}

/**
 * Modal/Dialog props
 */
export interface ReportPreviewModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerate?: (report: Report) => void;
  onSchedule?: (report: Report) => void;
}

export interface ReportScheduleDialogProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (schedule: any) => void;
}

/**
 * Export action props
 */
export interface ReportExportProps {
  reportId: string;
  format: 'pdf' | 'csv' | 'excel';
  filters?: Record<string, any>;
  onExportStart?: () => void;
  onExportComplete?: (file: Blob) => void;
  onExportError?: (error: Error) => void;
}

/**
 * Analytics and tracking props
 */
export interface ReportsAnalyticsProps {
  trackReportView?: (reportId: string) => void;
  trackReportGenerate?: (reportId: string, format: string) => void;
  trackFilterChange?: (filter: string, value: any) => void;
  trackSearchQuery?: (query: string) => void;
}

// Re-export component types for convenience
export type {
  Report,
  DateRangeFilter
} from '../components/types';