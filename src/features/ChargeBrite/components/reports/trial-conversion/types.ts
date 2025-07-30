
export interface TrialData {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  trialStartDate: string;
  trialEndDate: string;
  trialDuration: number;
  subscriptionType: string;
  acquisitionSource: string;
  trialStatus: string;
  conversionDate: string | null;
  conversionDays: number | null;
  paidStartDate: string | null;
  paidSubscriptionValue: number | null;
  retentionStatus90Days: string | null;
  currentStatus: string;
  totalRevenue: number;
  engagementScore: number;
}

export interface MonthlyTrend {
  month: string;
  trials: number;
  conversions: number;
  conversionRate: number;
  avgDaysToConvert: number;
}

export interface SourceData {
  source: string;
  trials: number;
  conversions: number;
  conversionRate: number;
  avgRevenue: number;
}

export interface RetentionData {
  period: string;
  retained: number;
  churned: number;
}

export interface TimeDistribution {
  days: string;
  count: number;
  percentage: number;
}

export interface ConversionSummary {
  totalTrials: number;
  convertedTrials: number;
  conversionRate: number;
  averageConversionTime: number;
  retentionRate90Days: number;
  totalConversionRevenue: number;
}

export interface InsightData {
  conversionRate: number;
  conversionTiming: string;
  retentionRate90Days: number;
  bestSource: {
    name: string;
    rate: number;
    revenue: number;
  };
}
