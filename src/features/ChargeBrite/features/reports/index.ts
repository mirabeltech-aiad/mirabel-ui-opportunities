/**
 * @fileoverview Reports Feature Entry Point
 * 
 * Comprehensive reporting system providing report generation, scheduling,
 * and analytics capabilities for both media and SaaS business models.
 * 
 * This feature follows the enhanced project structure guidelines with modular
 * organization, clear separation of concerns, and agent-readable documentation.
 * 
 * Key Features:
 * - Multi-business model report support (Media/SaaS)
 * - Advanced filtering and search capabilities
 * - Real-time report generation and scheduling
 * - Comprehensive audit and compliance reporting
 * - Performance analytics and insights
 * 
 * @example Basic Dashboard Usage
 * ```tsx
 * import { ReportsDirectoryPage } from '@/features/reports';
 * 
 * function App() {
 *   return <ReportsDirectoryPage />;
 * }
 * ```
 * 
 * @example Custom Report Integration
 * ```tsx
 * import { useReportsFiltering, ReportCard } from '@/features/reports';
 * 
 * function CustomReports() {
 *   const { filteredReports, setSearchTerm } = useReportsFiltering();
 *   return (
 *     <div>
 *       {filteredReports.map(report => 
 *         <ReportCard key={report.id} report={report} />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example Service Layer Usage
 * ```tsx
 * import { reportsApiService } from '@/features/reports';
 * 
 * const report = await reportsApiService.generateReport({
 *   templateId: 'template123',
 *   parameters: { dateRange: '2024-01-01,2024-12-31' }
 * });
 * ```
 * 
 * @author Reports Team
 * @since 1.0.0
 */

// === MAIN PAGE COMPONENTS ===
/**
 * Primary page components for reports feature integration.
 * These components provide complete reporting interfaces.
 */
export { default as ReportsDirectoryPage } from './pages/ReportsDirectory';  // Main reports directory page

// Backward compatibility export
export { default as ReportsDirectory } from './pages/ReportsDirectory';     // Legacy export alias

// === DIRECTORY COMPONENTS ===
/**
 * Components for report listing, browsing, and selection.
 * Optimized for large datasets with efficient rendering.
 */
export { default as ReportsHeader } from './components/directory/ReportsHeader';     // Directory header with metrics
export { default as ReportCard } from './components/directory/ReportCard';           // Individual report display card

// === FILTER COMPONENTS ===
/**
 * Advanced filtering and search components for report discovery.
 * Supports business model filtering, categories, and search terms.
 */
export { default as ReportsFilterBar } from './components/filters/ReportsFilterBar'; // Primary filter interface

// === CONTEXT AND STATE MANAGEMENT ===
/**
 * React context providers and state management hooks.
 * Centralized state management with reducer pattern and action creators.
 */
export {
  ReportsProvider,      // Context provider for reports state
  useReportsContext,    // Access reports context value
  useReportsState       // Direct state access hook
} from './context';

// === CUSTOM HOOKS ===
/**
 * Specialized React hooks for data fetching and state management.
 * All hooks include error handling, loading states, and optimization.
 */
export {
  useReportsFiltering,  // Report filtering and search logic
  useFilteredReports    // Database report fetching with business model filtering
} from './hooks';

// === SERVICE LAYER ===
/**
 * API service layer with comprehensive report management capabilities.
 * Includes report generation, scheduling, template management, and data fetching.
 */
export {
  reportsApiService     // Main reports API service
} from './services';

// === UTILITY FUNCTIONS ===
/**
 * Business logic utilities for report processing and filtering.
 * Optimized functions for business model compatibility and data transformation.
 */
export {
  filterReportsByBusinessModel,  // Filter reports by business model compatibility
  getExcludedReports,           // Get reports excluded for specific business models
  auditMediaSpecificReports     // Audit media-specific report configurations
} from './utils';

// === CONSTANTS ===
/**
 * Feature constants including categories, status values, and configuration defaults.
 * Centralized configuration for consistent behavior across components.
 */
export {
  REPORT_CATEGORIES,       // Available report categories
  REPORT_STATUS,          // Report generation status values
  TIME_PERIODS,           // Standard time period options
  OUTPUT_FORMATS,         // Supported output formats
  BUSINESS_MODELS,        // Supported business model types
  PAGINATION_DEFAULTS,    // Default pagination settings
  CATEGORY_COLORS,        // Category color mappings
  CATEGORY_ICON_COLORS    // Category icon color mappings
} from './utils/constants';

// Type exports
export type {
  // Component types
  Report,
  ReportCardProps,
  ReportsHeaderProps,
  ReportsDirectoryProps,
  ReportsFilterBarProps,
  BaseReportProps,
  DateRangeFilter,
  
  // API types
  ApiResponse,
  ReportDataResponse,
  ReportTemplate,
  ReportGenerationRequest,
  ReportSchedule,
  GeneratedReport,
  ReportFilters,
  PaginationParams,
  PaginatedResponse,
  
  // Hook types
  ReportsFilteringHookResult,
  FilteredReportsHookResult,
  DatabaseReport,
  PaginationState,
  
  // Utility types
  ReportWithBusinessModel,
  BusinessModel
} from './types';