
import { useApiOrchestration } from './useApiOrchestration';
import { useSubscriptionMetrics, useSubscriptionGrowthData, useSubscriptionChurnData, useSubscriptionGeographicData, useSubscriptionLifecycleData } from './useSubscriptionData';
import { useRevenueMetrics } from './useRevenueData';

export const useCirculationDataOrchestrator = (dateRange?: { startDate?: Date; endDate?: Date }) => {
  const { registerCall, isCallEnabled, stage, progress, isStageComplete } = useApiOrchestration();

  // Register calls with proper priorities and dependencies
  registerCall('subscription-metrics', 'critical');
  registerCall('revenue-metrics', 'critical');
  registerCall('subscription-growth', 'important', ['subscription-metrics']);
  registerCall('subscription-lifecycle', 'important', ['subscription-metrics']);
  registerCall('subscription-churn', 'secondary', ['subscription-growth']);
  registerCall('subscription-geographic', 'background', ['subscription-metrics']);

  // Use hooks with orchestrated timing - pass dateRange and defer based on call enablement
  const metricsQuery = useSubscriptionMetrics(dateRange, !isCallEnabled('subscription-metrics'));
  const revenueQuery = useRevenueMetrics();
  const growthQuery = useSubscriptionGrowthData(dateRange, !isCallEnabled('subscription-growth'));
  const lifecycleQuery = useSubscriptionLifecycleData(dateRange, !isCallEnabled('subscription-lifecycle'));
  const churnQuery = useSubscriptionChurnData(dateRange, !isCallEnabled('subscription-churn'));
  const geoQuery = useSubscriptionGeographicData(dateRange, !isCallEnabled('subscription-geographic'));

  // Determine overall loading state based on stage completion
  const isInitialLoading = stage === 'initial' || (!isCallEnabled('subscription-metrics') && !isCallEnabled('revenue-metrics'));
  const isCriticalDataReady = isStageComplete('critical');
  const isImportantDataReady = isStageComplete('important');

  return {
    // Data queries
    metrics: metricsQuery,
    revenue: revenueQuery,
    growth: growthQuery,
    lifecycle: lifecycleQuery,
    churn: churnQuery,
    geographic: geoQuery,
    
    // Loading states
    isInitialLoading,
    isCriticalDataReady,
    isImportantDataReady,
    
    // Progress tracking
    loadingStage: stage,
    overallProgress: progress,
    
    // Stage-specific readiness
    canShowOverview: isCriticalDataReady,
    canShowCharts: isImportantDataReady,
    canShowDetails: stage !== 'initial'
  };
};
