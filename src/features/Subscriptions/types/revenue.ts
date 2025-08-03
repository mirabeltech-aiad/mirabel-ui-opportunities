
export interface RevenueMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  monthlyRecurring: number;
  mrrGrowth: number;
  arpu: number;
  arpuChange: number;
  revenuePerMonth: number;
  growthRate: number;
  customerLTV: number;
}

export interface AcquisitionChannelRevenue {
  channel: string;
  revenue: number;
  subscribers: number;
  arpu: number;
  cac: number;
  ltvCacRatio: number;
  percentage: number;
}

export interface SubscriptionTypeRevenue {
  monthly: Array<{
    month: string;
    print: number;
    digital: number;
    both: number;
  }>;
  summary: Array<{
    type: string;
    revenue: number;
    subscribers: number;
    arpu: number;
    growth: number;
  }>;
}

export interface GeographicRevenue {
  regional: Array<{
    region: string;
    revenue: number;
    arpu: number;
    growth: number;
  }>;
  cities: Array<{
    city: string;
    country: string;
    revenue: number;
    subscribers: number;
  }>;
}

export interface RevenueAttribution {
  touchpoints: Array<{
    touchpoint: string;
    attributedRevenue: number;
  }>;
  channelTypeMatrix: Array<{
    channel: string;
    type: string;
    revenue: number;
    subscribers: number;
    arpu: number;
    percentage: number;
  }>;
  geographic: Array<{
    region: string;
    revenue: number;
    percentage: number;
    topChannels: string[];
  }>;
  summary: {
    totalAttributedRevenue: number;
    attributionConfidence: number;
    averageTouchpoints: number;
  };
}
