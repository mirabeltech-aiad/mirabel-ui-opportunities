
export interface ExpansionDeal {
  customerId: string;
  customerName: string;
  expansionType: string;
  dealDate: string;
  investment: number;
  monthlyRevenue: number;
  paybackMonths: number;
  currentROI: number;
  status: string;
}

export interface PaybackDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface ROITrendData {
  month: string;
  roi: number;
  investment: number;
  revenue: number;
}

export interface ExpansionTypeData {
  type: string;
  avgPayback: number;
  avgROI: number;
  deals: number;
  totalInvestment: number;
  totalRevenue: number;
}

export interface InvestmentBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface ChannelPerformance {
  channel: string;
  deals: number;
  investment: number;
  revenue: number;
  avgPayback: number;
  roi: number;
}
