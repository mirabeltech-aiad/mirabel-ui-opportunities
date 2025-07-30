
export interface NetMRRMetrics {
  netMrrChurnRate: number;
  grossMrrChurnRate: number;
  expansionMrrRate: number;
  mrrExpansionRatio: number;
  netMrrGrowth: number;
  monthlyChange: number;
}

export interface NetMRRTrend {
  month: string;
  netChurnRate: number;
  grossChurnRate: number;
  expansionRate: number;
  netMrrGrowth: number;
}

export interface MRRBridge {
  category: string;
  value: number;
  type: 'starting' | 'churn' | 'expansion' | 'ending';
}

export interface SegmentNetMRR {
  segment: string;
  netChurnRate: number;
  grossChurnRate: number;
  expansionRate: number;
  customerCount: number;
  mrrBase: number;
}

export interface CohortNetRetention {
  cohort: string;
  month1?: number;
  month3?: number;
  month6?: number;
  month12?: number;
  month24?: number;
  startingMrr?: number;
}

export interface ProductMRRAnalysis {
  product: string;
  grossChurnRate: number;
  expansionRate: number;
  netChurnRate: number;
  mrrContribution: number;
}

export interface GeographicNetMRR {
  region: string;
  netChurnRate: number;
  expansionRate: number;
  mrrBase: number;
  growthTrend: number;
}

export interface ExpansionOpportunity {
  customerId: string;
  customerName: string;
  currentMrr: number;
  expansionPotential: number;
  opportunityScore: number;
  timeToExpansion: number;
  recommendedAction: string;
  lastExpansion: string;
}

export interface RevenueBridge {
  period: string;
  startingMrr: number;
  newMrr: number;
  expansionMrr: number;
  contractionMrr: number;
  churnedMrr: number;
  endingMrr: number;
  netGrowth: number;
}

export interface PredictiveNetChurn {
  month: string;
  predictedNetChurn: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  keyDrivers: string[];
  recommendedActions: string[];
}
