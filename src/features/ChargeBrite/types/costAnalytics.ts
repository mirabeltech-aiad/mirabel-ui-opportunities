
export interface CostMetrics {
  totalCosts: number;
  acquisitionCosts: number;
  deliveryCosts: number;
  operationalCosts: number;
  costPerSubscriber: number;
  profitMargin: number;
  roi: number;
}

export interface AcquisitionCosts {
  channel: string;
  cost: number;
  subscribers: number;
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  ltvCacRatio: number;
  trend: number; // percentage change
}

export interface DeliveryExpenses {
  type: 'print' | 'digital' | 'both';
  cost: number;
  volume: number;
  costPerUnit: number;
  subscribers: number;
  costPerSubscriber: number;
  trend: number;
}

export interface SubscriberProfitability {
  subscriberId: string;
  revenue: number;
  costs: number;
  profit: number;
  profitMargin: number;
  segment: string;
  acquisitionChannel: string;
  subscriptionType: 'print' | 'digital' | 'both';
  monthsActive: number;
}

export interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
  trend: number;
  subcategories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}
