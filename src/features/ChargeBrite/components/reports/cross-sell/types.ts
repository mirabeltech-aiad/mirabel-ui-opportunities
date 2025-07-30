
export interface CrossSellCustomer {
  customerId: string;
  customerName: string;
  initialProduct: string;
  initialDate: string;
  crossSellProducts: string[];
  crossSellDates: string[];
  totalProducts: number;
  segment: string;
}

export interface TrendData {
  month: string;
  attachRate: number;
}

export interface ProductCombination {
  combination: string;
  count: number;
  rate: number;
}

export interface SegmentData {
  segment: string;
  attachRate: number;
  avgProducts: number;
  revenue: number;
}

export interface TimeToXSellData {
  range: string;
  count: number;
  percentage: number;
}

export interface AffinityMatrixItem {
  product: string;
  basicRate: number;
  proRate: number;
  enterpriseRate: number;
}
