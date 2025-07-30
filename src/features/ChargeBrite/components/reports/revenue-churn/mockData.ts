
import {
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
} from './types';

export const mockRevenueChurnMetrics: RevenueChurnMetrics = {
  grossRevenueChurnRate: 8.2,
  netRevenueChurnRate: 3.1,
  mrrLost: 156800,
  averageRevenuePerLostCustomer: 285,
  monthlyChange: -0.3
};

export const mockRevenueChurnTrend: RevenueChurnTrend[] = [
  { month: 'Jul 2023', grossChurnRate: 7.8, netChurnRate: 2.9, mrrLost: 142000, expansionMrr: 68000 },
  { month: 'Aug 2023', grossChurnRate: 8.1, netChurnRate: 3.2, mrrLost: 148000, expansionMrr: 71000 },
  { month: 'Sep 2023', grossChurnRate: 7.5, netChurnRate: 2.1, mrrLost: 138000, expansionMrr: 79000 },
  { month: 'Oct 2023', grossChurnRate: 8.4, netChurnRate: 3.8, mrrLost: 152000, expansionMrr: 67000 },
  { month: 'Nov 2023', grossChurnRate: 7.9, netChurnRate: 2.7, mrrLost: 145000, expansionMrr: 75000 },
  { month: 'Dec 2023', grossChurnRate: 8.6, netChurnRate: 4.1, mrrLost: 159000, expansionMrr: 64000 },
  { month: 'Jan 2024', grossChurnRate: 8.0, netChurnRate: 3.0, mrrLost: 147000, expansionMrr: 73000 },
  { month: 'Feb 2024', grossChurnRate: 7.7, netChurnRate: 2.4, mrrLost: 141000, expansionMrr: 78000 },
  { month: 'Mar 2024', grossChurnRate: 8.3, netChurnRate: 3.5, mrrLost: 153000, expansionMrr: 70000 },
  { month: 'Apr 2024', grossChurnRate: 7.6, netChurnRate: 2.2, mrrLost: 139000, expansionMrr: 80000 },
  { month: 'May 2024', grossChurnRate: 8.5, netChurnRate: 3.4, mrrLost: 157000, expansionMrr: 72000 },
  { month: 'Jun 2024', grossChurnRate: 8.2, netChurnRate: 3.1, mrrLost: 156800, expansionMrr: 74500 }
];

export const mockRevenueWaterfall: RevenueWaterfall[] = [
  { category: 'Starting MRR', value: 1912000, type: 'neutral' },
  { category: 'Churned MRR', value: -156800, type: 'negative' },
  { category: 'Expansion MRR', value: 74500, type: 'positive' },
  { category: 'New MRR', value: 89200, type: 'positive' },
  { category: 'Ending MRR', value: 1918900, type: 'neutral' }
];

export const mockChurnBySegment: ChurnBySegment[] = [
  { segment: 'Enterprise ($500+)', churnRate: 4.1, mrrLost: 32500, customerCount: 18 },
  { segment: 'Mid-Market ($100-$500)', churnRate: 7.8, mrrLost: 78400, customerCount: 156 },
  { segment: 'Small Business (<$100)', churnRate: 12.3, mrrLost: 45900, customerCount: 387 }
];

export const mockChurnByProduct: ChurnByProduct[] = [
  { product: 'Professional Plan', churnRate: 6.8, mrrLost: 67200, percentage: 42.8 },
  { product: 'Business Plan', churnRate: 8.9, mrrLost: 54300, percentage: 34.6 },
  { product: 'Starter Plan', churnRate: 14.2, mrrLost: 35300, percentage: 22.6 }
];

export const mockGeographicChurn: GeographicChurn[] = [
  { region: 'North America', churnRate: 7.1, mrrLost: 78400, recoveryRate: 18.5 },
  { region: 'Europe', churnRate: 8.6, mrrLost: 47100, recoveryRate: 22.3 },
  { region: 'Asia Pacific', churnRate: 9.8, mrrLost: 23600, recoveryRate: 15.7 },
  { region: 'Latin America', churnRate: 11.2, mrrLost: 7700, recoveryRate: 12.4 }
];

export const mockHighValueChurn: HighValueChurn[] = [
  {
    customerId: 'CUST-5647',
    customerName: 'TechCorp Solutions',
    mrrLost: 2850,
    churnDate: '2024-06-15',
    reason: 'Budget constraints',
    tenure: 28,
    recoveryOpportunity: 'High',
    lastEngagement: '2024-05-20'
  },
  {
    customerId: 'CUST-3821',
    customerName: 'Innovation Labs Inc',
    mrrLost: 1950,
    churnDate: '2024-06-12',
    reason: 'Feature limitations',
    tenure: 14,
    recoveryOpportunity: 'Medium',
    lastEngagement: '2024-06-01'
  },
  {
    customerId: 'CUST-9156',
    customerName: 'Global Dynamics',
    mrrLost: 1750,
    churnDate: '2024-06-08',
    reason: 'Competitor switch',
    tenure: 22,
    recoveryOpportunity: 'Low',
    lastEngagement: '2024-05-15'
  },
  {
    customerId: 'CUST-7423',
    customerName: 'StartupX',
    mrrLost: 1250,
    churnDate: '2024-06-05',
    reason: 'Company closure',
    tenure: 8,
    recoveryOpportunity: 'Low',
    lastEngagement: '2024-05-28'
  },
  {
    customerId: 'CUST-2891',
    customerName: 'Enterprise Plus LLC',
    mrrLost: 3200,
    churnDate: '2024-06-03',
    reason: 'Internal solution',
    tenure: 35,
    recoveryOpportunity: 'Medium',
    lastEngagement: '2024-05-25'
  }
];

export const mockRevenueRecovery: RevenueRecovery[] = [
  { metric: 'Win-back Campaign Success Rate', value: 23.4, trend: 2.1, description: 'Percentage of churned customers who returned' },
  { metric: 'Average Recovery Time (days)', value: 45, trend: -3, description: 'Time from churn to successful win-back' },
  { metric: 'Revenue Recovered (MTD)', value: 28500, trend: 15.8, description: 'MRR recovered from win-back efforts' },
  { metric: 'Recovery Investment ROI', value: 340, trend: 12.5, description: 'Return on investment for recovery campaigns' }
];

export const mockCohortRetention: CohortRetention[] = [
  { cohort: 'Jan 2024', month1: 95.2, month3: 87.6, month6: 78.9, month12: 0, averageMrr: 285 },
  { cohort: 'Oct 2023', month1: 94.8, month3: 86.1, month6: 77.3, month12: 68.4, averageMrr: 267 },
  { cohort: 'Jul 2023', month1: 93.5, month3: 84.7, month6: 75.8, month12: 66.2, averageMrr: 245 },
  { cohort: 'Apr 2023', month1: 92.1, month3: 83.2, month6: 74.1, month12: 64.8, averageMrr: 238 },
  { cohort: 'Jan 2023', month1: 91.8, month3: 82.5, month6: 72.9, month12: 63.1, averageMrr: 221 }
];

export const mockPredictiveRisk: PredictiveRisk[] = [
  {
    customerId: 'CUST-8574',
    customerName: 'AlphaTech Industries',
    currentMrr: 1850,
    riskScore: 87,
    riskLevel: 'High',
    primaryRiskFactor: 'Declining usage (-45%)',
    daysToChurn: 14,
    recommendations: 'Immediate CSM outreach, usage review'
  },
  {
    customerId: 'CUST-6239',
    customerName: 'BetaCorp Ltd',
    currentMrr: 950,
    riskScore: 74,
    riskLevel: 'High',
    primaryRiskFactor: 'Payment failures (3)',
    daysToChurn: 21,
    recommendations: 'Update billing info, payment plan options'
  },
  {
    customerId: 'CUST-4157',
    customerName: 'GammaSoft Solutions',
    currentMrr: 1200,
    riskScore: 68,
    riskLevel: 'Medium',
    primaryRiskFactor: 'Low feature adoption',
    daysToChurn: 35,
    recommendations: 'Product training, feature demos'
  },
  {
    customerId: 'CUST-9823',
    customerName: 'DeltaVentures Inc',
    currentMrr: 650,
    riskScore: 61,
    riskLevel: 'Medium',
    primaryRiskFactor: 'Support ticket increase',
    daysToChurn: 42,
    recommendations: 'Enhanced support, check-in call'
  },
  {
    customerId: 'CUST-5741',
    customerName: 'EpsilonWorks',
    currentMrr: 2100,
    riskScore: 55,
    riskLevel: 'Medium',
    primaryRiskFactor: 'Contract near renewal',
    daysToChurn: 28,
    recommendations: 'Renewal discussion, value demonstration'
  }
];
