
import { 
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
} from './types';

const mockNetMRRMetrics: NetMRRMetrics = {
  netMrrChurnRate: -2.1, // Negative churn (expansion > churn)
  grossMrrChurnRate: 5.8,
  expansionMrrRate: 7.9,
  mrrExpansionRatio: 1.36,
  netMrrGrowth: 48750,
  monthlyChange: -0.3
};

const mockNetMRRTrend: NetMRRTrend[] = [
  { month: 'Jan', netChurnRate: 1.2, grossChurnRate: 6.1, expansionRate: 4.9, netMrrGrowth: -28500 },
  { month: 'Feb', netChurnRate: 0.8, grossChurnRate: 5.9, expansionRate: 5.1, netMrrGrowth: -18200 },
  { month: 'Mar', netChurnRate: 0.3, grossChurnRate: 5.7, expansionRate: 5.4, netMrrGrowth: -7100 },
  { month: 'Apr', netChurnRate: -0.2, grossChurnRate: 5.6, expansionRate: 5.8, netMrrGrowth: 4800 },
  { month: 'May', netChurnRate: -0.8, grossChurnRate: 5.4, expansionRate: 6.2, netMrrGrowth: 18900 },
  { month: 'Jun', netChurnRate: -1.3, grossChurnRate: 5.2, expansionRate: 6.5, netMrrGrowth: 31200 },
  { month: 'Jul', netChurnRate: -1.7, grossChurnRate: 5.1, expansionRate: 6.8, netMrrGrowth: 40850 },
  { month: 'Aug', netChurnRate: -1.9, grossChurnRate: 5.0, expansionRate: 6.9, netMrrGrowth: 45600 },
  { month: 'Sep', netChurnRate: -2.1, grossChurnRate: 4.9, expansionRate: 7.0, netMrrGrowth: 50400 },
  { month: 'Oct', netChurnRate: -2.0, grossChurnRate: 5.0, expansionRate: 7.0, netMrrGrowth: 48000 },
  { month: 'Nov', netChurnRate: -2.2, grossChurnRate: 4.8, expansionRate: 7.0, netMrrGrowth: 52800 },
  { month: 'Dec', netChurnRate: -2.1, grossChurnRate: 5.8, expansionRate: 7.9, netMrrGrowth: 48750 }
];

const mockMRRBridge: MRRBridge[] = [
  { category: 'Starting MRR', value: 2400000, type: 'starting' },
  { category: 'Churned MRR', value: -139200, type: 'churn' },
  { category: 'Contraction MRR', value: -28800, type: 'churn' },
  { category: 'Expansion MRR', value: 189600, type: 'expansion' },
  { category: 'New MRR', value: 67200, type: 'expansion' },
  { category: 'Ending MRR', value: 2488800, type: 'ending' }
];

const mockSegmentNetMRR: SegmentNetMRR[] = [
  { segment: 'Enterprise', netChurnRate: -4.2, grossChurnRate: 2.1, expansionRate: 6.3, customerCount: 245, mrrBase: 980000 },
  { segment: 'Mid-Market', netChurnRate: -1.8, grossChurnRate: 4.5, expansionRate: 6.3, customerCount: 1250, mrrBase: 750000 },
  { segment: 'SMB', netChurnRate: 1.2, grossChurnRate: 8.7, expansionRate: 7.5, customerCount: 4580, mrrBase: 458000 },
  { segment: 'Startup', netChurnRate: 3.8, grossChurnRate: 12.5, expansionRate: 8.7, customerCount: 2890, mrrBase: 300800 }
];

const mockCohortNetRetention: CohortNetRetention[] = [
  { cohort: '2024 Q1', month1: 100, month3: 102, month6: 108, month12: 115, month24: 125, startingMrr: 120000 },
  { cohort: '2023 Q4', month1: 100, month3: 101, month6: 106, month12: 112, month24: 120, startingMrr: 108000 },
  { cohort: '2023 Q3', month1: 100, month3: 98, month6: 103, month12: 109, month24: 118, startingMrr: 95000 },
  { cohort: '2023 Q2', month1: 100, month3: 97, month6: 101, month12: 106, month24: 115, startingMrr: 88000 },
  { cohort: '2023 Q1', month1: 100, month3: 96, month6: 99, month12: 104, month24: 112, startingMrr: 82000 },
  { cohort: '2022 Q4', month1: 100, month3: 94, month6: 97, month12: 102, month24: 109, startingMrr: 76000 }
];

const mockProductMRRAnalysis: ProductMRRAnalysis[] = [
  { product: 'Professional Plan', grossChurnRate: 4.2, expansionRate: 8.9, netChurnRate: -4.7, mrrContribution: 45.2 },
  { product: 'Enterprise Plan', grossChurnRate: 2.1, expansionRate: 12.4, netChurnRate: -10.3, mrrContribution: 38.7 },
  { product: 'Basic Plan', grossChurnRate: 9.8, expansionRate: 4.2, netChurnRate: 5.6, mrrContribution: 16.1 }
];

const mockGeographicNetMRR: GeographicNetMRR[] = [
  { region: 'North America', netChurnRate: -2.8, expansionRate: 8.4, mrrBase: 1200000, growthTrend: 0.3 },
  { region: 'Europe', netChurnRate: -1.2, expansionRate: 6.8, mrrBase: 720000, growthTrend: 0.1 },
  { region: 'Asia Pacific', netChurnRate: 0.5, expansionRate: 9.2, mrrBase: 360000, growthTrend: -0.2 },
  { region: 'Latin America', netChurnRate: 2.1, expansionRate: 5.4, mrrBase: 208800, growthTrend: -0.4 }
];

const mockExpansionOpportunities: ExpansionOpportunity[] = [
  { customerId: 'CUST-001', customerName: 'TechCorp Solutions', currentMrr: 12500, expansionPotential: 25000, opportunityScore: 92, timeToExpansion: 30, recommendedAction: 'Upsell to Enterprise', lastExpansion: '2024-08-15' },
  { customerId: 'CUST-002', customerName: 'Global Industries', currentMrr: 8900, expansionPotential: 15000, opportunityScore: 87, timeToExpansion: 45, recommendedAction: 'Add premium modules', lastExpansion: '2024-07-22' },
  { customerId: 'CUST-003', customerName: 'StartupXYZ', currentMrr: 2400, expansionPotential: 7200, opportunityScore: 83, timeToExpansion: 60, recommendedAction: 'Upgrade plan tier', lastExpansion: '2024-09-03' },
  { customerId: 'CUST-004', customerName: 'MidSize Corp', currentMrr: 5600, expansionPotential: 11200, opportunityScore: 79, timeToExpansion: 75, recommendedAction: 'Cross-sell add-ons', lastExpansion: '2024-06-18' },
  { customerId: 'CUST-005', customerName: 'Enterprise Ltd', currentMrr: 18900, expansionPotential: 28350, opportunityScore: 75, timeToExpansion: 90, recommendedAction: 'Multi-year contract', lastExpansion: '2024-05-10' }
];

const mockRevenueBridge: RevenueBridge[] = [
  { period: 'Jan 2024', startingMrr: 2250000, newMrr: 45000, expansionMrr: 67500, contractionMrr: -22500, churnedMrr: -112500, endingMrr: 2227500, netGrowth: -22500 },
  { period: 'Feb 2024', startingMrr: 2227500, newMrr: 52000, expansionMrr: 71200, contractionMrr: -18900, churnedMrr: -98400, endingMrr: 2233400, netGrowth: 5900 },
  { period: 'Mar 2024', startingMrr: 2233400, newMrr: 48500, expansionMrr: 89600, contractionMrr: -24100, churnedMrr: -87300, endingMrr: 2260100, netGrowth: 26700 },
  { period: 'Apr 2024', startingMrr: 2260100, newMrr: 56700, expansionMrr: 94800, contractionMrr: -19800, churnedMrr: -92100, endingMrr: 2299700, netGrowth: 39600 },
  { period: 'May 2024', startingMrr: 2299700, newMrr: 61200, expansionMrr: 102400, contractionMrr: -21500, churnedMrr: -89200, endingMrr: 2352600, netGrowth: 52900 },
  { period: 'Jun 2024', startingMrr: 2352600, newMrr: 58900, expansionMrr: 108700, contractionMrr: -23400, churnedMrr: -95800, endingMrr: 2401000, netGrowth: 48400 }
];

const mockPredictiveNetChurn: PredictiveNetChurn[] = [
  { 
    month: 'Jan 2025', 
    predictedNetChurn: -2.4, 
    confidenceInterval: { lower: -3.1, upper: -1.7 },
    keyDrivers: ['Strong product adoption', 'Expansion program success'],
    recommendedActions: ['Continue expansion focus', 'Monitor usage metrics']
  },
  { 
    month: 'Feb 2025', 
    predictedNetChurn: -2.2, 
    confidenceInterval: { lower: -2.9, upper: -1.5 },
    keyDrivers: ['Seasonal factors', 'Contract renewals'],
    recommendedActions: ['Prepare renewal campaigns', 'Focus on at-risk accounts']
  },
  { 
    month: 'Mar 2025', 
    predictedNetChurn: -2.0, 
    confidenceInterval: { lower: -2.7, upper: -1.3 },
    keyDrivers: ['Market conditions', 'Competitive pressure'],
    recommendedActions: ['Enhance value proposition', 'Accelerate feature releases']
  }
];

export const mockNetMRRData = {
  metrics: mockNetMRRMetrics,
  trendData: mockNetMRRTrend,
  bridgeData: mockMRRBridge,
  segmentData: mockSegmentNetMRR,
  cohortData: mockCohortNetRetention,
  productData: mockProductMRRAnalysis,
  geographicData: mockGeographicNetMRR,
  expansionOpportunities: mockExpansionOpportunities,
  revenueBridge: mockRevenueBridge,
  predictiveData: mockPredictiveNetChurn
};
