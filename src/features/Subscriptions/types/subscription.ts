
export interface Subscription {
  id: string;
  customerId: string;
  productId: string;
  type: 'print' | 'digital' | 'both';
  status: 'active' | 'cancelled' | 'paused' | 'expired';
  startDate: string;
  endDate?: string;
  renewalDate: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  region: string;
  city: string;
  country: string;
}

export interface SubscriptionMetrics {
  total: number;
  print: number;
  digital: number;
  active: number;
  cancelled: number;
  newThisMonth: number;
  churnRate: number;
}

export interface GrowthData {
  month: string;
  total: number;
  print: number;
  digital: number;
  newSubscriptions: number;
  churnedSubscriptions: number;
}

export interface ChurnData {
  month: string;
  churnRate: number;
  newSubs: number;
  cancelations: number;
}

export interface GeographicData {
  region: string;
  country?: string;
  city?: string;
  subscribers: number;
  percentage: number;
  growth: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface LifecycleData {
  acquisitionFunnel: FunnelStep[];
  retentionCohorts: RetentionData[];
  churnReasons: ChurnReason[];
}

export interface FunnelStep {
  stage: string;
  count: number;
  conversionRate: number;
}

export interface RetentionData {
  month: string;
  month1: number;
  month3: number;
  month6: number;
  month12: number | null;
}

export interface ChurnReason {
  reason: string;
  percentage: number;
  count: number;
}

export interface ConversionRates {
  trialToSubscription: number;
  retention: number;
  churn: number;
  renewal: number;
}

export interface AcquisitionData {
  channels: AcquisitionChannel[];
  monthlyTrends: MonthlyTrend[];
}

export interface AcquisitionChannel {
  channel: string;
  subscribers: number;
  cost: number;
  cac: number;
  conversionRate: number;
}

export interface MonthlyTrend {
  month: string;
  newSubscribers: number;
  totalCost: number;
  avgCAC: number;
}
