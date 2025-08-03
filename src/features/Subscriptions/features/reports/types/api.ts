/**
 * @fileoverview API-related type definitions for Reports feature
 * 
 * Contains all types related to API requests, responses, and data structures
 * that interface with external services and backend systems.
 */

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
  PaginatedResponse
} from '../services/types';

// Hook types for API operations
export type {
  DatabaseReport
} from '../hooks/types';

// Service-specific API types
export type {
  GeographicStats,
  AcquisitionStats
} from '@/services/reports/types';

// Report-specific API data types
export type {
  TrialData,
  MonthlyTrend as TrialMonthlyTrend,
  SourceData,
  RetentionData,
  TimeDistribution,
  ConversionSummary,
  InsightData
} from '@/components/reports/trial-conversion/types';

export type {
  RevenueChurnMetrics,
  RevenueChurnTrend,
  RevenueWaterfall,
  ChurnBySegment,
  ChurnByProduct,
  GeographicChurn,
  HighValueChurn,
  RevenueRecovery,
  CohortRetention,
  PredictiveRisk
} from '@/components/reports/revenue-churn/types';

export type {
  CohortChurnMetrics,
  CohortRetentionData,
  CohortLifetimeTrend,
  CohortPrediction,
  CohortSegmentData,
  CohortRevenueImpactData,
  CohortBehaviorData,
  CohortRiskData
} from '@/components/reports/churn-cohort/types';

export type {
  NetMRRMetrics,
  NetMRRTrend,
  MRRBridge,
  SegmentNetMRR,
  CohortNetRetention,
  ProductMRRAnalysis,
  GeographicNetMRR,
  ExpansionOpportunity,
  RevenueBridge,
  PredictiveNetChurn
} from '@/components/reports/net-mrr-churn/types';

export type {
  ContractRenewal,
  ExpansionDriver,
  ExpansionMetrics,
  ExpansionTrendData,
  ExpansionDistribution,
  ContractSizeBucket,
  RenewalOutcome,
  GeographicExpansion,
  CustomerSegmentExpansion,
  TenureExpansion,
  PredictiveIndicator
} from '@/components/reports/contract-expansion/types';

export type {
  CrossSellCustomer,
  TrendData as CrossSellTrendData,
  ProductCombination,
  SegmentData as CrossSellSegmentData,
  TimeToXSellData,
  AffinityMatrixItem
} from '@/components/reports/cross-sell/types';

export type {
  ExpansionDeal,
  PaybackDistribution,
  ROITrendData,
  ExpansionTypeData,
  InvestmentBreakdown,
  ChannelPerformance
} from '@/components/reports/expansion-payback/types';

/**
 * Main Feature API contract - defines all API-related functionality
 */
export interface FeatureAPI {
  // Core report operations
  getReports: () => Promise<any[]>;
  getReport: (id: string) => Promise<any>;
  generateReport: (request: any) => Promise<any>;
  
  // Template operations
  getTemplates: () => Promise<any[]>;
  getTemplate: (id: string) => Promise<any>;
  
  // Schedule operations
  getSchedules: () => Promise<any[]>;
  createSchedule: (schedule: any) => Promise<any>;
  updateSchedule: (id: string, schedule: any) => Promise<any>;
  deleteSchedule: (id: string) => Promise<void>;
  
  // Data fetching for specific report types
  getTrialConversionData: (filters?: any) => Promise<{
    summary: any;
    trends: any[];
    sources: any[];
    retention: any[];
    timeDistribution: any[];
    insights: any;
  }>;
  
  getRevenueChurnData: (filters?: any) => Promise<{
    metrics: any;
    trends: any[];
    waterfall: any[];
    segments: any[];
    products: any[];
    geographic: any[];
    highValue: any[];
    recovery: any[];
    cohorts: any[];
    predictive: any[];
  }>;
  
  // Error handling
  handleApiError: (error: unknown) => Error;
}
