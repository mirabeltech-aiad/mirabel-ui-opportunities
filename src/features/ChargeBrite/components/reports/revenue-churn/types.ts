
export interface RevenueChurnMetrics {
  grossRevenueChurnRate: number;
  netRevenueChurnRate: number;
  mrrLost: number;
  averageRevenuePerLostCustomer: number;
  monthlyChange: number;
}

export interface RevenueChurnTrend {
  month: string;
  grossChurnRate: number;
  netChurnRate: number;
  mrrLost: number;
  expansionMrr: number;
}

export interface RevenueWaterfall {
  category: string;
  value: number;
  type: 'positive' | 'negative' | 'neutral';
}

export interface ChurnBySegment {
  segment: string;
  churnRate: number;
  mrrLost: number;
  customerCount: number;
}

export interface ChurnByProduct {
  product: string;
  churnRate: number;
  mrrLost: number;
  percentage: number;
}

export interface GeographicChurn {
  region: string;
  churnRate: number;
  mrrLost: number;
  recoveryRate: number;
}

export interface HighValueChurn {
  customerId: string;
  customerName: string;
  mrrLost: number;
  churnDate: string;
  reason: string;
  tenure: number;
  recoveryOpportunity: 'High' | 'Medium' | 'Low';
  lastEngagement: string;
}

export interface RevenueRecovery {
  metric: string;
  value: number;
  trend: number;
  description: string;
}

export interface CohortRetention {
  cohort: string;
  month1: number;
  month3: number;
  month6: number;
  month12: number;
  averageMrr: number;
}

export interface PredictiveRisk {
  customerId: string;
  customerName: string;
  currentMrr: number;
  riskScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  primaryRiskFactor: string;
  daysToChurn: number;
  recommendations: string;
}
