
import { USE_MOCK_DATA } from './apiClient';
import {
  SubscriberDemographics,
  BehavioralSegment,
  LifetimeValue,
  EngagementMetrics,
  ChurnPrediction,
  AnalyticsOverview
} from '@/types/analytics';

// Mock analytics data
const mockDemographics: SubscriberDemographics = {
  ageGroups: [
    { range: '18-24', count: 8420, percentage: 6.7, averageLTV: 180.50, churnRate: 8.2 },
    { range: '25-34', count: 32150, percentage: 25.6, averageLTV: 245.75, churnRate: 5.1 },
    { range: '35-44', count: 38920, percentage: 31.0, averageLTV: 310.20, churnRate: 3.8 },
    { range: '45-54', count: 28340, percentage: 22.5, averageLTV: 385.40, churnRate: 2.9 },
    { range: '55-64', count: 14180, percentage: 11.3, averageLTV: 420.80, churnRate: 2.1 },
    { range: '65+', count: 3660, percentage: 2.9, averageLTV: 390.60, churnRate: 1.8 }
  ],
  genderDistribution: [
    { gender: 'Male', count: 68420, percentage: 54.4, averageLTV: 295.30 },
    { gender: 'Female', count: 54180, percentage: 43.1, averageLTV: 312.50 },
    { gender: 'Other', count: 3070, percentage: 2.5, averageLTV: 280.90 }
  ],
  incomeRanges: [
    { range: '$25K-$40K', count: 15680, percentage: 12.5, averageLTV: 185.20, subscriptionPreference: 'Digital' },
    { range: '$40K-$60K', count: 28340, percentage: 22.6, averageLTV: 245.80, subscriptionPreference: 'Digital' },
    { range: '$60K-$80K', count: 35420, percentage: 28.2, averageLTV: 295.40, subscriptionPreference: 'Both' },
    { range: '$80K-$100K', count: 26150, percentage: 20.8, averageLTV: 345.60, subscriptionPreference: 'Both' },
    { range: '$100K+', count: 20080, percentage: 16.0, averageLTV: 425.90, subscriptionPreference: 'Print' }
  ],
  geographicDistribution: [
    { region: 'North America', count: 52340, percentage: 41.6, growthRate: 2.1, topProducts: ['Daily Herald', 'Business Weekly'] },
    { region: 'Europe', count: 38920, percentage: 31.0, growthRate: 1.8, topProducts: ['Business Weekly', 'Tech Digest'] },
    { region: 'Asia Pacific', count: 22180, percentage: 17.6, growthRate: 4.2, topProducts: ['Tech Digest', 'Lifestyle Magazine'] },
    { region: 'Latin America', count: 8430, percentage: 6.7, growthRate: 3.1, topProducts: ['Sports Tribune', 'Daily Herald'] },
    { region: 'Middle East & Africa', count: 3800, percentage: 3.0, growthRate: 2.8, topProducts: ['Business Weekly', 'Health Today'] }
  ]
};

const mockBehavioralSegments: BehavioralSegment[] = [
  {
    id: 'power-users',
    name: 'Power Users',
    description: 'Highly engaged subscribers with frequent content consumption',
    subscriberCount: 18920,
    percentage: 15.1,
    characteristics: ['Daily content consumption', 'High social sharing', 'Multi-platform usage'],
    averageLTV: 485.30,
    churnRate: 1.2,
    engagementScore: 92,
    recommendedActions: ['Exclusive content access', 'Beta feature testing', 'Referral programs']
  },
  {
    id: 'casual-readers',
    name: 'Casual Readers',
    description: 'Regular but moderate content engagement',
    subscriberCount: 45680,
    percentage: 36.4,
    characteristics: ['Weekly content consumption', 'Mobile preferred', 'Weekend reading peaks'],
    averageLTV: 295.80,
    churnRate: 3.8,
    engagementScore: 68,
    recommendedActions: ['Personalized recommendations', 'Mobile app improvements', 'Weekend specials']
  },
  {
    id: 'price-sensitive',
    name: 'Price Sensitive',
    description: 'Cost-conscious subscribers focused on value',
    subscriberCount: 28340,
    percentage: 22.6,
    characteristics: ['Digital-only preference', 'Promotion responsive', 'Price comparison behavior'],
    averageLTV: 185.40,
    churnRate: 6.2,
    engagementScore: 52,
    recommendedActions: ['Value highlighting', 'Flexible pricing', 'Cost-effective bundles']
  },
  {
    id: 'premium-seekers',
    name: 'Premium Seekers',
    description: 'High-value subscribers seeking exclusive content',
    subscriberCount: 12150,
    percentage: 9.7,
    characteristics: ['Premium content preference', 'Print + Digital', 'Industry professionals'],
    averageLTV: 625.90,
    churnRate: 1.8,
    engagementScore: 85,
    recommendedActions: ['Exclusive interviews', 'Industry reports', 'Networking events']
  },
  {
    id: 'at-risk',
    name: 'At Risk',
    description: 'Declining engagement with high churn probability',
    subscriberCount: 20580,
    percentage: 16.4,
    characteristics: ['Decreasing usage', 'Limited content interaction', 'Payment issues'],
    averageLTV: 145.20,
    churnRate: 15.3,
    engagementScore: 28,
    recommendedActions: ['Re-engagement campaigns', 'Support outreach', 'Win-back offers']
  }
];

const mockLifetimeValues: LifetimeValue[] = [
  { subscriberId: 'sub_001', currentLTV: 485.30, predictedLTV: 650.40, totalRevenue: 1245.80, monthsActive: 18, averageMonthlySpend: 69.21, churnProbability: 0.12, segment: 'power-users' },
  { subscriberId: 'sub_002', currentLTV: 295.80, predictedLTV: 380.20, totalRevenue: 885.60, monthsActive: 12, averageMonthlySpend: 73.80, churnProbability: 0.38, segment: 'casual-readers' },
  { subscriberId: 'sub_003', currentLTV: 625.90, predictedLTV: 890.50, totalRevenue: 1560.30, monthsActive: 24, averageMonthlySpend: 65.01, churnProbability: 0.08, segment: 'premium-seekers' }
];

const mockEngagementMetrics: EngagementMetrics[] = [
  { subscriberId: 'sub_001', overallScore: 92, contentEngagement: 95, platformUsage: 88, socialSharing: 85, feedbackProvided: 90, referrals: 95, lastActivity: '2024-06-01', trend: 'increasing' },
  { subscriberId: 'sub_002', overallScore: 68, contentEngagement: 70, platformUsage: 65, socialSharing: 45, feedbackProvided: 55, referrals: 30, lastActivity: '2024-05-28', trend: 'stable' },
  { subscriberId: 'sub_003', overallScore: 85, contentEngagement: 90, platformUsage: 80, socialSharing: 75, feedbackProvided: 85, referrals: 95, lastActivity: '2024-06-02', trend: 'increasing' }
];

const mockChurnPredictions: ChurnPrediction[] = [
  {
    subscriberId: 'sub_004',
    churnProbability: 0.85,
    riskLevel: 'critical',
    keyFactors: [
      { factor: 'Declining engagement', impact: 0.35, description: 'Content consumption down 60% in last 30 days' },
      { factor: 'Payment issues', impact: 0.25, description: 'Failed payment attempts in last billing cycle' },
      { factor: 'No recent activity', impact: 0.25, description: 'No login activity in 14 days' }
    ],
    recommendedActions: ['Immediate customer support contact', 'Payment assistance offer', 'Personalized re-engagement content'],
    timeToChurn: 7,
    confidenceScore: 0.92
  }
];

const mockAnalyticsOverview: AnalyticsOverview = {
  totalSubscribers: 125670,
  averageLTV: 315.40,
  overallEngagementScore: 72,
  churnRisk: {
    low: 78450,
    medium: 28340,
    high: 12680,
    critical: 6200
  },
  topPerformingSegments: ['Power Users', 'Premium Seekers', 'Casual Readers'],
  keyInsights: [
    'Power Users segment shows highest LTV and lowest churn',
    'Mobile engagement is increasing across all demographics',
    'Price-sensitive segment requires targeted retention strategies',
    'Geographic expansion in Asia Pacific showing strong growth'
  ]
};

const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

export const analyticsService = {
  async getDemographics(productIds?: string[], businessUnitIds?: string[]): Promise<SubscriberDemographics> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockDemographics);
    }
    throw new Error('Real API not implemented yet');
  },

  async getBehavioralSegments(productIds?: string[], businessUnitIds?: string[]): Promise<BehavioralSegment[]> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockBehavioralSegments);
    }
    throw new Error('Real API not implemented yet');
  },

  async getLifetimeValues(productIds?: string[], businessUnitIds?: string[]): Promise<LifetimeValue[]> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockLifetimeValues);
    }
    throw new Error('Real API not implemented yet');
  },

  async getEngagementMetrics(productIds?: string[], businessUnitIds?: string[]): Promise<EngagementMetrics[]> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockEngagementMetrics);
    }
    throw new Error('Real API not implemented yet');
  },

  async getChurnPredictions(productIds?: string[], businessUnitIds?: string[]): Promise<ChurnPrediction[]> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockChurnPredictions);
    }
    throw new Error('Real API not implemented yet');
  },

  async getAnalyticsOverview(productIds?: string[], businessUnitIds?: string[]): Promise<AnalyticsOverview> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockAnalyticsOverview);
    }
    throw new Error('Real API not implemented yet');
  }
};
