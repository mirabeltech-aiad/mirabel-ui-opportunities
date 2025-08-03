/**
 * @fileoverview Analytics Feature Type Definitions
 * 
 * Comprehensive TypeScript interfaces for analytics data structures,
 * providing type safety and documentation for all analytics-related data.
 * 
 * These types support both media and SaaS business models with flexible
 * data structures for various analytical use cases.
 * 
 * @author Analytics Team
 * @since 1.0.0
 */

/**
 * Complete demographic analysis data structure containing age, gender,
 * income, and geographic distribution information.
 * 
 * @interface SubscriberDemographics
 * @example
 * ```tsx
 * const demographics: SubscriberDemographics = {
 *   ageGroups: [{ range: '25-34', count: 1500, percentage: 30.0, averageLTV: 250.0, churnRate: 5.2 }],
 *   genderDistribution: [{ gender: 'Female', count: 2500, percentage: 50.0, averageLTV: 275.0 }],
 *   // ... other properties
 * };
 * ```
 */
export interface SubscriberDemographics {
  /** Age group analysis with engagement and value metrics */
  ageGroups: AgeGroup[];
  /** Gender distribution with lifetime value analysis */
  genderDistribution: GenderDistribution[];
  /** Income range segmentation with subscription preferences */
  incomeRanges: IncomeRange[];
  /** Geographic distribution with growth metrics */
  geographicDistribution: GeographicSegment[];
}

/**
 * Age group demographic segment with associated metrics.
 * 
 * @interface AgeGroup
 * @example
 * ```tsx
 * const ageGroup: AgeGroup = {
 *   range: '25-34',
 *   count: 15420,
 *   percentage: 30.8,
 *   averageLTV: 285.50,
 *   churnRate: 4.2
 * };
 * ```
 */
export interface AgeGroup {
  /** Age range (e.g., '25-34', '65+') */
  range: string;
  /** Total subscribers in this age group */
  count: number;
  /** Percentage of total subscriber base */
  percentage: number;
  /** Average lifetime value in currency units */
  averageLTV: number;
  /** Churn rate as percentage */
  churnRate: number;
}

/**
 * Gender-based demographic distribution with value metrics.
 * 
 * @interface GenderDistribution
 * @example
 * ```tsx
 * const genderData: GenderDistribution = {
 *   gender: 'Female',
 *   count: 25800,
 *   percentage: 51.6,
 *   averageLTV: 312.75
 * };
 * ```
 */
export interface GenderDistribution {
  /** Gender identification (Male, Female, Other, Non-binary) */
  gender: string;
  /** Total subscribers of this gender */
  count: number;
  /** Percentage of total subscriber base */
  percentage: number;
  /** Average lifetime value for this gender group */
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