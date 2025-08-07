/**
 * @fileoverview Main types export for Reports feature
 * 
 * Centralized type definitions organized by concern:
 * - API types: External service interfaces and data structures
 * - State types: Component and context state management
 * - Props types: React component prop interfaces
 * - Utility types: Helper types and business logic interfaces
 */

// === FEATURE CONTRACTS ===
// Main feature interface contracts
export type { FeatureAPI } from './api';
export type { FeatureState, StateOperations } from './state';
export type { FeatureProps } from './props';

// === API TYPES ===
// Core API types
export type {
  ApiResponse,
  ReportDataResponse,
  ReportTemplate,
  ReportGenerationRequest,
  ReportSchedule,
  GeneratedReport,
  ReportFilters,
  PaginationParams,
  PaginatedResponse,
  DatabaseReport
} from './api';

// Report-specific data types (re-exported for convenience)
export type {
  TrialData,
  RevenueChurnMetrics,
  CohortChurnMetrics,
  NetMRRMetrics,
  ContractRenewal,
  CrossSellCustomer,
  ExpansionDeal
} from './api';

// === STATE TYPES ===
// Context and state management
export type {
  ReportsState,
  ReportsAction,
  ReportsContextValue,
  ReportsActionType,
  FilteringState,
  DataState,
  PaginationControlState,
  ReportFormState
} from './state';

// Hook return types
export type {
  ReportsFilteringHookResult,
  FilteredReportsHookResult,
  PaginationState
} from './state';

// === COMPONENT PROPS ===
// Main component props
export type {
  ReportsLayoutProps,
  ReportsDirectoryProps,
  ReportCardProps,
  ReportsHeaderProps,
  ReportsFilterBarProps,
  BaseReportProps,
  DateRangeFilter
} from './props';

// Common component props
export type {
  ReportsErrorBoundaryProps,
  ReportsLoadingStateProps,
  ReportsEmptyStateProps,
  ReportsProviderProps
} from './props';

// Hook props
export type {
  UseReportsFilteringProps,
  UseFilteredReportsProps,
  UseReportsDataProps
} from './props';

// === UTILITY TYPES ===
// Business logic types
export type {
  ReportWithBusinessModel
} from '../utils/businessModelFilters';

// External dependencies
export type { BusinessModel } from '@/contexts/BusinessModelContext';

// === LEGACY EXPORTS ===
// Maintain backward compatibility
export type {
  Report
} from '../components/types';