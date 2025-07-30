
export interface CohortChurnMetrics {
  totalCohorts: number;
  avgRetentionRate: number;
  bestCohortRetention: number;
  worstCohortRetention: number;
  avgChurnRate: number;
  cohortTrend: string;
}

export interface CohortRetentionData {
  cohort: string;
  acquisitionDate: string;
  initialSize: number;
  month1: number;
  month3: number;
  month6: number;
  month12: number;
  month24: number;
  ltv: number;
}

export interface CohortLifetimeTrend {
  cohort: string;
  month: number;
  retentionRate: number;
  churnRate: number;
  cumulativeChurn: number;
}

export interface CohortPrediction {
  cohort: string;
  currentRetention: number;
  predictedMonth12: number;
  predictedMonth24: number;
  confidenceScore: number;
  riskFactors: string[];
  recommendations: string[];
}

export interface CohortSegmentData {
  segment: string;
  cohortCount: number;
  avgRetention12m: number;
  churnVelocity: number;
  topPerformingCohort: string;
  bottomPerformingCohort: string;
}

export interface CohortRevenueImpactData {
  cohort: string;
  initialRevenue: number;
  currentRevenue: number;
  revenueRetention: number;
  lostRevenue: number;
  projectedLoss: number;
}

export interface CohortBehaviorData {
  cohort: string;
  avgSessionLength: number;
  featureAdoption: number;
  supportTickets: number;
  npsScore: number;
  engagementScore: number;
}

export interface CohortRiskData {
  cohort: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  churnProbability: number;
  daysToChurn: number;
  keyIndicators: string[];
  interventionSuggestions: string[];
}
