/**
 * @fileoverview State management type definitions for Reports feature
 * 
 * Contains all types related to component state, context state, and 
 * state management operations including reducers and actions.
 */

// Context and state types
export type {
  ReportsState,
  ReportsAction,
  ReportsContextValue,
  ReportsActionType
} from '../context/types';

// Hook return types
export type {
  ReportsFilteringHookResult,
  FilteredReportsHookResult,
  PaginationState
} from '../hooks/types';

// Service types for state operations
export type {
  ReportFilters,
  ReportSchedule
} from '../services/types';

// Component state types
export type {
  Report,
  ReportCardProps,
  ReportsHeaderProps,
  ReportsDirectoryProps,
  ReportsFilterBarProps,
  BaseReportProps,
  DateRangeFilter
} from '../components/types';

// External context dependencies
export type { BusinessModel } from '@/contexts/BusinessModelContext';

/**
 * Main Feature State contract - defines all state-related functionality
 */
export interface FeatureState {
  // Core state properties
  reports: any[];
  filteredReports: any[];
  isLoading: boolean;
  error: string | null;
  
  // Filter state
  searchQuery: string;
  activeCategory: string;
  favoriteReports: Set<string>;
  
  // Pagination state
  pagination: any;
  
  // Metadata
  categories: string[];
  categoryReportCounts: Record<string, number>;
  reportsByCategory: Record<string, any[]>;
  lastUpdated: Date | null;
  
  // Business context
  businessModel: any | null;
  
  // Computed state
  displayedReports: any[];
  favoriteReportsData: any[];
  hasActiveFilters: boolean;
  totalFilteredCount: number;
}

/**
 * State management operations interface
 */
export interface StateOperations {
  // Search operations
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  
  // Category operations
  setActiveCategory: (category: string) => void;
  resetCategory: () => void;
  
  // Favorites operations
  toggleFavorite: (reportId: string) => void;
  clearFavorites: () => void;
  
  // Data operations
  setReports: (reports: any[]) => void;
  refreshReports: () => Promise<void>;
  
  // Loading and error operations
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Pagination operations
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPagination: () => void;
  
  // Filter operations
  applyFilters: () => void;
  clearAllFilters: () => void;
}

/**
 * Hook state interfaces for specific functionalities
 */
export interface FilteringState {
  searchQuery: string;
  activeCategory: string;
  favoriteReports: Set<string>;
  hasActiveFilters: boolean;
}

export interface DataState {
  reports: any[];
  filteredReports: any[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface PaginationControlState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Form state for report-related forms
 */
export interface ReportFormState {
  templateId: string;
  name: string;
  description: string;
  filters: any;
  schedule?: any;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
