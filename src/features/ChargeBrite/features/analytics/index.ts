/**
 * @fileoverview Analytics Feature Entry Point
 * 
 * Comprehensive analytics feature module providing subscriber intelligence,
 * behavioral analysis, and predictive modeling capabilities for media and SaaS businesses.
 * 
 * This feature follows the enhanced project structure guidelines with modular
 * organization, clear separation of concerns, and agent-readable documentation.
 * 
 * @example Basic Usage
 * ```tsx
 * import { AnalyticsDashboard, useAnalyticsOverview } from '@/features/analytics';
 * 
 * function App() {
 *   return <AnalyticsDashboard />;
 * }
 * ```
 * 
 * @example Service Integration
 * ```tsx
 * import { analyticsService } from '@/features/analytics';
 * 
 * const demographics = await analyticsService.getDemographics(['product1']);
 * ```
 * 
 * @author Analytics Team
 * @since 1.0.0
 */

// === MAIN COMPONENTS ===
/**
 * Core analytics components for data visualization and user interaction.
 * All components are optimized for performance with lazy loading support.
 */
export { 
  AnalyticsDashboard,           // Main analytics dashboard container
  AnalyticsOverviewCards,       // High-level metric cards
  AnalyticsKeyInsights,         // AI-driven insights display
  AnalyticsFilters,            // Data filtering controls
  AnalyticsTabNavigation,      // Tab-based navigation
  SubscriberDemographics,      // Demographic analysis charts
  BehavioralSegmentation,      // Behavioral analysis components
  LifetimeValueAnalysis,       // LTV prediction and analysis
  EngagementScoring,           // Engagement metrics visualization
  ChurnPredictionModel,        // Churn prediction interface
  CostAnalyticsOverview        // Cost analysis dashboard
} from './components';

// === CUSTOM HOOKS ===
/**
 * React hooks for data fetching, state management, and analytics orchestration.
 * All hooks include error handling, loading states, and caching.
 */
export { 
  useAnalyticsDataOrchestrator // Orchestrate multiple data sources
} from './hooks';

// === SERVICE LAYER ===
/**
 * Analytics service providing API integration with mock data support.
 * Includes retry logic, error handling, and data transformation.
 */
export { analyticsService } from './services';

// === TYPE DEFINITIONS ===
/**
 * Complete TypeScript definitions for analytics data structures,
 * API interfaces, and component props.
 */
export * from './types';