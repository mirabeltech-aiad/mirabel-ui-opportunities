
import {
  CohortChurnMetrics,
  CohortRetentionData,
  CohortLifetimeTrend,
  CohortPrediction,
  CohortSegmentData,
  CohortRevenueImpactData,
  CohortBehaviorData,
  CohortRiskData
} from './types';

const mockMetrics: CohortChurnMetrics = {
  totalCohorts: 24,
  avgRetentionRate: 72.5,
  bestCohortRetention: 89.2,
  worstCohortRetention: 58.1,
  avgChurnRate: 27.5,
  cohortTrend: 'improving'
};

const mockHeatmapData: CohortRetentionData[] = [
  {
    cohort: 'Jan 2024',
    acquisitionDate: '2024-01-01',
    initialSize: 1250,
    month1: 92.4,
    month3: 84.8,
    month6: 78.2,
    month12: 0,
    month24: 0,
    ltv: 1850
  },
  {
    cohort: 'Dec 2023',
    acquisitionDate: '2023-12-01',
    initialSize: 1180,
    month1: 91.2,
    month3: 83.5,
    month6: 76.8,
    month12: 68.4,
    month24: 0,
    ltv: 1920
  },
  {
    cohort: 'Nov 2023',
    acquisitionDate: '2023-11-01',
    initialSize: 1320,
    month1: 89.8,
    month3: 81.2,
    month6: 74.6,
    month12: 66.8,
    month24: 0,
    ltv: 1780
  },
  {
    cohort: 'Oct 2023',
    acquisitionDate: '2023-10-01',
    initialSize: 1150,
    month1: 88.5,
    month3: 79.8,
    month6: 72.1,
    month12: 64.2,
    month24: 0,
    ltv: 1650
  },
  {
    cohort: 'Sep 2023',
    acquisitionDate: '2023-09-01',
    initialSize: 1280,
    month1: 90.2,
    month3: 82.4,
    month6: 75.8,
    month12: 67.9,
    month24: 0,
    ltv: 1820
  },
  {
    cohort: 'Aug 2023',
    acquisitionDate: '2023-08-01',
    initialSize: 1090,
    month1: 87.3,
    month3: 78.1,
    month6: 70.5,
    month12: 62.8,
    month24: 0,
    ltv: 1590
  }
];

const mockLifetimeTrends: CohortLifetimeTrend[] = [
  { cohort: 'Jan 2024', month: 1, retentionRate: 92.4, churnRate: 7.6, cumulativeChurn: 7.6 },
  { cohort: 'Jan 2024', month: 3, retentionRate: 84.8, churnRate: 8.2, cumulativeChurn: 15.2 },
  { cohort: 'Jan 2024', month: 6, retentionRate: 78.2, churnRate: 7.8, cumulativeChurn: 21.8 },
  { cohort: 'Dec 2023', month: 1, retentionRate: 91.2, churnRate: 8.8, cumulativeChurn: 8.8 },
  { cohort: 'Dec 2023', month: 3, retentionRate: 83.5, churnRate: 8.4, cumulativeChurn: 16.5 },
  { cohort: 'Dec 2023', month: 6, retentionRate: 76.8, churnRate: 8.0, cumulativeChurn: 23.2 },
  { cohort: 'Dec 2023', month: 12, retentionRate: 68.4, churnRate: 10.9, cumulativeChurn: 31.6 }
];

const mockPredictions: CohortPrediction[] = [
  {
    cohort: 'Jan 2024',
    currentRetention: 78.2,
    predictedMonth12: 69.5,
    predictedMonth24: 58.2,
    confidenceScore: 87.3,
    riskFactors: ['Seasonal pattern', 'Feature usage decline'],
    recommendations: ['Enhanced onboarding', 'Feature adoption campaign']
  },
  {
    cohort: 'Dec 2023',
    currentRetention: 68.4,
    predictedMonth12: 68.4,
    predictedMonth24: 55.8,
    confidenceScore: 92.1,
    riskFactors: ['Support ticket increase', 'Low engagement'],
    recommendations: ['Proactive support', 'Re-engagement campaign']
  }
];

const mockSegmentData: CohortSegmentData[] = [
  {
    segment: 'Enterprise',
    cohortCount: 8,
    avgRetention12m: 78.5,
    churnVelocity: 0.12,
    topPerformingCohort: 'Sep 2023',
    bottomPerformingCohort: 'Nov 2023'
  },
  {
    segment: 'Mid-Market',
    cohortCount: 10,
    avgRetention12m: 71.2,
    churnVelocity: 0.18,
    topPerformingCohort: 'Jan 2024',
    bottomPerformingCohort: 'Aug 2023'
  },
  {
    segment: 'SMB',
    cohortCount: 6,
    avgRetention12m: 64.8,
    churnVelocity: 0.25,
    topPerformingCohort: 'Dec 2023',
    bottomPerformingCohort: 'Oct 2023'
  }
];

const mockRevenueImpact: CohortRevenueImpactData[] = [
  {
    cohort: 'Jan 2024',
    initialRevenue: 187500,
    currentRevenue: 146625,
    revenueRetention: 78.2,
    lostRevenue: 40875,
    projectedLoss: 62500
  },
  {
    cohort: 'Dec 2023',
    initialRevenue: 177000,
    currentRevenue: 121068,
    revenueRetention: 68.4,
    lostRevenue: 55932,
    projectedLoss: 78320
  }
];

const mockBehaviorData: CohortBehaviorData[] = [
  {
    cohort: 'Jan 2024',
    avgSessionLength: 24.5,
    featureAdoption: 78.2,
    supportTickets: 1.2,
    npsScore: 8.1,
    engagementScore: 85.3
  },
  {
    cohort: 'Dec 2023',
    avgSessionLength: 22.8,
    featureAdoption: 72.5,
    supportTickets: 1.8,
    npsScore: 7.4,
    engagementScore: 78.9
  }
];

const mockRiskAnalysis: CohortRiskData[] = [
  {
    cohort: 'Aug 2023',
    riskLevel: 'Critical',
    churnProbability: 85.2,
    daysToChurn: 45,
    keyIndicators: ['Low engagement', 'No feature adoption'],
    interventionSuggestions: ['Immediate outreach', 'Success manager assignment']
  },
  {
    cohort: 'Oct 2023',
    riskLevel: 'High',
    churnProbability: 72.8,
    daysToChurn: 78,
    keyIndicators: ['Declining usage', 'Support tickets'],
    interventionSuggestions: ['Health check call', 'Training session']
  }
];

export const mockCohortChurnData = {
  metrics: mockMetrics,
  heatmapData: mockHeatmapData,
  lifetimeTrends: mockLifetimeTrends,
  predictions: mockPredictions,
  segmentData: mockSegmentData,
  revenueImpact: mockRevenueImpact,
  behaviorData: mockBehaviorData,
  riskAnalysis: mockRiskAnalysis
};
