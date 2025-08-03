
export interface SubscriberDemographics {
  ageGroups: AgeGroup[];
  genderDistribution: GenderDistribution[];
  incomeRanges: IncomeRange[];
  geographicDistribution: GeographicSegment[];
}

export interface AgeGroup {
  range: string;
  count: number;
  percentage: number;
  averageLTV: number;
  churnRate: number;
}

export interface GenderDistribution {
  gender: string;
  count: number;
  percentage: number;
  averageLTV: number;
}

export interface IncomeRange {
  range: string;
  count: number;
  percentage: number;
  averageLTV: number;
  subscriptionPreference: string;
}

export interface GeographicSegment {
  region: string;
  city?: string;
  count: number;
  percentage: number;
  growthRate: number;
  topProducts: string[];
}

export interface BehavioralSegment {
  id: string;
  name: string;
  description: string;
  subscriberCount: number;
  percentage: number;
  characteristics: string[];
  averageLTV: number;
  churnRate: number;
  engagementScore: number;
  recommendedActions: string[];
}

export interface LifetimeValue {
  subscriberId: string;
  currentLTV: number;
  predictedLTV: number;
  totalRevenue: number;
  monthsActive: number;
  averageMonthlySpend: number;
  churnProbability: number;
  segment: string;
}

export interface EngagementMetrics {
  subscriberId: string;
  overallScore: number;
  contentEngagement: number;
  platformUsage: number;
  socialSharing: number;
  feedbackProvided: number;
  referrals: number;
  lastActivity: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface ChurnPrediction {
  subscriberId: string;
  churnProbability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  keyFactors: ChurnFactor[];
  recommendedActions: string[];
  timeToChurn: number; // days
  confidenceScore: number;
}

export interface ChurnFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface AnalyticsOverview {
  totalSubscribers: number;
  averageLTV: number;
  overallEngagementScore: number;
  churnRisk: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  topPerformingSegments: string[];
  keyInsights: string[];
}
