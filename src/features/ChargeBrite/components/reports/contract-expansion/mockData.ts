
import { 
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
} from './types';

export const mockExpansionMetrics: ExpansionMetrics = {
  overallExpansionRate: 34.5,
  averageExpansionPercentage: 28.3,
  totalExpansionRevenue: 245000,
  expansionTrend: 5.2,
  netRevenueRetention: 115.8,
  expansionMRR: 45600,
  averageContractValueBefore: 18500,
  averageContractValueAfter: 23750,
  expansionRevenuePercentage: 18.2
};

export const mockContractRenewals: ContractRenewal[] = [
  {
    id: 'cr-001',
    customerId: 'cust-001',
    customerName: 'TechCorp Solutions',
    originalValue: 25000,
    renewalValue: 35000,
    expansionAmount: 10000,
    expansionPercentage: 40,
    renewalDate: '2024-06-15',
    accountManager: 'Sarah Johnson',
    contractSize: 'Medium',
    customerTenure: 24,
    outcome: 'expanded',
    segment: 'Mid-Market',
    region: 'North America',
    healthScore: 85
  },
  {
    id: 'cr-002',
    customerId: 'cust-002',
    customerName: 'Global Manufacturing Inc',
    originalValue: 75000,
    renewalValue: 95000,
    expansionAmount: 20000,
    expansionPercentage: 26.7,
    renewalDate: '2024-06-20',
    accountManager: 'Michael Chen',
    contractSize: 'Large',
    customerTenure: 36,
    outcome: 'expanded',
    segment: 'Enterprise',
    region: 'North America',
    healthScore: 92
  },
  {
    id: 'cr-003',
    customerId: 'cust-003',
    customerName: 'StartupCo Ltd',
    originalValue: 8000,
    renewalValue: 8000,
    expansionAmount: 0,
    expansionPercentage: 0,
    renewalDate: '2024-06-22',
    accountManager: 'Emma Davis',
    contractSize: 'Small',
    customerTenure: 12,
    outcome: 'flat',
    segment: 'SMB',
    region: 'Europe',
    healthScore: 68
  },
  {
    id: 'cr-004',
    customerId: 'cust-004',
    customerName: 'Innovation Labs',
    originalValue: 45000,
    renewalValue: 60000,
    expansionAmount: 15000,
    expansionPercentage: 33.3,
    renewalDate: '2024-06-25',
    accountManager: 'David Wilson',
    contractSize: 'Medium',
    customerTenure: 18,
    outcome: 'expanded',
    segment: 'Mid-Market',
    region: 'Asia Pacific',
    healthScore: 88
  },
  {
    id: 'cr-005',
    customerId: 'cust-005',
    customerName: 'Regional Services',
    originalValue: 12000,
    renewalValue: 9000,
    expansionAmount: -3000,
    expansionPercentage: -25,
    renewalDate: '2024-06-28',
    accountManager: 'Lisa Rodriguez',
    contractSize: 'Small',
    customerTenure: 8,
    outcome: 'downgraded',
    segment: 'SMB',
    region: 'North America',
    healthScore: 52
  }
];

export const mockExpansionTrendData: ExpansionTrendData[] = [
  { month: 'Jul 2023', expansionRate: 28.5, totalRenewals: 45, expandedContracts: 13 },
  { month: 'Aug 2023', expansionRate: 31.2, totalRenewals: 52, expandedContracts: 16 },
  { month: 'Sep 2023', expansionRate: 29.8, totalRenewals: 48, expandedContracts: 14 },
  { month: 'Oct 2023', expansionRate: 33.1, totalRenewals: 55, expandedContracts: 18 },
  { month: 'Nov 2023', expansionRate: 35.7, totalRenewals: 42, expandedContracts: 15 },
  { month: 'Dec 2023', expansionRate: 32.4, totalRenewals: 38, expandedContracts: 12 },
  { month: 'Jan 2024', expansionRate: 36.2, totalRenewals: 58, expandedContracts: 21 },
  { month: 'Feb 2024', expansionRate: 34.8, totalRenewals: 46, expandedContracts: 16 },
  { month: 'Mar 2024', expansionRate: 38.1, totalRenewals: 63, expandedContracts: 24 },
  { month: 'Apr 2024', expansionRate: 35.9, totalRenewals: 51, expandedContracts: 18 },
  { month: 'May 2024', expansionRate: 37.3, totalRenewals: 49, expandedContracts: 18 },
  { month: 'Jun 2024', expansionRate: 34.5, totalRenewals: 55, expandedContracts: 19 }
];

export const mockExpansionDistribution: ExpansionDistribution[] = [
  { range: '10-25%', count: 28, percentage: 35.4 },
  { range: '25-50%', count: 32, percentage: 40.5 },
  { range: '50-75%', count: 15, percentage: 19.0 },
  { range: '75%+', count: 4, percentage: 5.1 }
];

export const mockContractSizeBuckets: ContractSizeBucket[] = [
  { size: '<$10K', expansionRate: 22.8, totalContracts: 89, expandedContracts: 20, averageExpansion: 18.5 },
  { size: '$10K-$50K', expansionRate: 38.2, totalContracts: 76, expandedContracts: 29, averageExpansion: 32.1 },
  { size: '$50K+', expansionRate: 45.7, totalContracts: 35, expandedContracts: 16, averageExpansion: 28.9 }
];

export const mockRenewalOutcomes: RenewalOutcome[] = [
  { outcome: 'Expanded', count: 65, percentage: 34.5, revenueImpact: 245000 },
  { outcome: 'Flat Renewal', count: 98, percentage: 52.1, revenueImpact: 0 },
  { outcome: 'Downgraded', count: 18, percentage: 9.6, revenueImpact: -45000 },
  { outcome: 'Churned', count: 7, percentage: 3.7, revenueImpact: -89000 }
];

export const mockGeographicExpansion: GeographicExpansion[] = [
  { region: 'North America', expansionRate: 38.2, totalRenewals: 110, averageExpansion: 31.5 },
  { region: 'Europe', expansionRate: 32.1, totalRenewals: 48, averageExpansion: 26.8 },
  { region: 'Asia Pacific', expansionRate: 28.9, totalRenewals: 30, averageExpansion: 24.2 }
];

export const mockExpansionDrivers: ExpansionDriver[] = [
  { driver: 'Additional Users', impact: 45.2, frequency: 68, averageIncrease: 32.1 },
  { driver: 'Premium Features', impact: 38.7, frequency: 42, averageIncrease: 28.5 },
  { driver: 'Higher Tier Plans', impact: 52.3, frequency: 35, averageIncrease: 41.2 },
  { driver: 'Additional Products', impact: 41.8, frequency: 28, averageIncrease: 36.7 },
  { driver: 'Extended Support', impact: 23.5, frequency: 22, averageIncrease: 15.8 }
];

export const mockCustomerSegmentExpansion: CustomerSegmentExpansion[] = [
  { segment: 'SMB', expansionRate: 26.4, averageExpansion: 22.1, totalRenewals: 95 },
  { segment: 'Mid-Market', expansionRate: 42.8, averageExpansion: 31.5, totalRenewals: 68 },
  { segment: 'Enterprise', expansionRate: 51.2, averageExpansion: 35.8, totalRenewals: 25 }
];

export const mockTenureExpansion: TenureExpansion[] = [
  { tenureRange: '0-12 months', expansionRate: 18.5, averageExpansion: 19.2, sampleSize: 65 },
  { tenureRange: '12-24 months', expansionRate: 35.8, averageExpansion: 28.7, sampleSize: 78 },
  { tenureRange: '24+ months', expansionRate: 48.3, averageExpansion: 34.1, sampleSize: 45 }
];

export const mockPredictiveIndicators: PredictiveIndicator[] = [
  { indicator: 'Usage Growth', correlation: 0.78, description: 'Increasing platform usage', threshold: '>25% increase' },
  { indicator: 'Feature Adoption', correlation: 0.72, description: 'Adoption of premium features', threshold: '>3 new features' },
  { indicator: 'Support Engagement', correlation: 0.65, description: 'Proactive support interactions', threshold: '>5 interactions/month' },
  { indicator: 'Health Score', correlation: 0.83, description: 'Overall customer health', threshold: '>80 score' },
  { indicator: 'Team Growth', correlation: 0.71, description: 'Customer team size growth', threshold: '>20% team growth' }
];
