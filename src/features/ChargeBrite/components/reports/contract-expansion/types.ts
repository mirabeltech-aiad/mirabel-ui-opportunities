
export interface ContractRenewal {
  id: string;
  customerId: string;
  customerName: string;
  originalValue: number;
  renewalValue: number;
  expansionAmount: number;
  expansionPercentage: number;
  renewalDate: string;
  accountManager: string;
  contractSize: 'Small' | 'Medium' | 'Large';
  customerTenure: number;
  outcome: 'expanded' | 'flat' | 'downgraded' | 'churned';
  segment: 'SMB' | 'Mid-Market' | 'Enterprise';
  region: string;
  healthScore: number;
}

export interface ExpansionDriver {
  driver: string;
  impact: number;
  frequency: number;
  averageIncrease: number;
}

export interface ExpansionMetrics {
  overallExpansionRate: number;
  averageExpansionPercentage: number;
  totalExpansionRevenue: number;
  expansionTrend: number;
  netRevenueRetention: number;
  expansionMRR: number;
  averageContractValueBefore: number;
  averageContractValueAfter: number;
  expansionRevenuePercentage: number;
}

export interface ExpansionTrendData {
  month: string;
  expansionRate: number;
  totalRenewals: number;
  expandedContracts: number;
}

export interface ExpansionDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface ContractSizeBucket {
  size: string;
  expansionRate: number;
  totalContracts: number;
  expandedContracts: number;
  averageExpansion: number;
}

export interface RenewalOutcome {
  outcome: string;
  count: number;
  percentage: number;
  revenueImpact: number;
}

export interface GeographicExpansion {
  region: string;
  expansionRate: number;
  totalRenewals: number;
  averageExpansion: number;
}

export interface CustomerSegmentExpansion {
  segment: string;
  expansionRate: number;
  averageExpansion: number;
  totalRenewals: number;
}

export interface TenureExpansion {
  tenureRange: string;
  expansionRate: number;
  averageExpansion: number;
  sampleSize: number;
}

export interface PredictiveIndicator {
  indicator: string;
  correlation: number;
  description: string;
  threshold: string;
}
