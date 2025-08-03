import { useApiOrchestration } from '@/hooks/useApiOrchestration';
import { useSubscriberDemographics, useBehavioralSegments, useLifetimeValues, useEngagementMetrics, useChurnPredictions, useAnalyticsOverview } from './useAnalyticsData';

export const useAnalyticsDataOrchestrator = () => {
  const { registerCall, isCallEnabled, stage, progress, isStageComplete } = useApiOrchestration();

  // Register analytics calls with optimized priorities
  registerCall('analytics-overview', 'critical');
  registerCall('subscriber-demographics', 'critical');
  registerCall('behavioral-segments', 'important', ['analytics-overview']);
  registerCall('engagement-metrics', 'important', ['subscriber-demographics']);
  registerCall('lifetime-values', 'secondary', ['behavioral-segments']);
  registerCall('churn-predictions', 'background', ['engagement-metrics']);

  // Use hooks with orchestrated timing
  const overviewQuery = useAnalyticsOverview(!isCallEnabled('analytics-overview'));
  const demographicsQuery = useSubscriberDemographics(!isCallEnabled('subscriber-demographics'));
  const segmentsQuery = useBehavioralSegments(!isCallEnabled('behavioral-segments'));
  const engagementQuery = useEngagementMetrics(!isCallEnabled('engagement-metrics'));
  const lifetimeQuery = useLifetimeValues(!isCallEnabled('lifetime-values'));
  const churnQuery = useChurnPredictions(!isCallEnabled('churn-predictions'));

  // Loading state management
  const isInitialLoading = stage === 'initial' || (!isCallEnabled('analytics-overview') && !isCallEnabled('subscriber-demographics'));
  const isCriticalDataReady = isStageComplete('critical');
  const isImportantDataReady = isStageComplete('important');

  return {
    // Data queries
    overview: overviewQuery,
    demographics: demographicsQuery,
    segments: segmentsQuery,
    engagement: engagementQuery,
    lifetime: lifetimeQuery,
    churn: churnQuery,
    
    // Loading states
    isInitialLoading,
    isCriticalDataReady,
    isImportantDataReady,
    
    // Progress tracking
    loadingStage: stage,
    overallProgress: progress,
    
    // Component readiness flags
    canShowOverview: isCriticalDataReady,
    canShowSegmentation: isImportantDataReady,
    canShowPredictions: stage !== 'initial' && stage !== 'critical'
  };
};