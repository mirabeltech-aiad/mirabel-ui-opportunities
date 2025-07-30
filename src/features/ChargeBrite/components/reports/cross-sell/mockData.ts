
import { CrossSellCustomer, TrendData, ProductCombination, SegmentData, TimeToXSellData, AffinityMatrixItem } from './types';

export const mockCrossSellData: CrossSellCustomer[] = [
  { customerId: 'C001', customerName: 'Acme Corp', initialProduct: 'Basic Plan', initialDate: '2024-01-15', crossSellProducts: ['Analytics Module', 'Premium Support'], crossSellDates: ['2024-03-20', '2024-05-10'], totalProducts: 3, segment: 'SMB' },
  { customerId: 'C002', customerName: 'TechStart Inc', initialProduct: 'Professional Plan', initialDate: '2024-02-01', crossSellProducts: ['API Access'], crossSellDates: ['2024-02-28'], totalProducts: 2, segment: 'Startup' },
  { customerId: 'C003', customerName: 'Global Solutions', initialProduct: 'Enterprise Plan', initialDate: '2024-01-10', crossSellProducts: ['Custom Integration', 'Advanced Analytics', 'White Label'], crossSellDates: ['2024-02-15', '2024-03-20', '2024-04-25'], totalProducts: 4, segment: 'Enterprise' },
  { customerId: 'C004', customerName: 'Local Business', initialProduct: 'Basic Plan', initialDate: '2024-02-15', crossSellProducts: [], crossSellDates: [], totalProducts: 1, segment: 'SMB' },
  { customerId: 'C005', customerName: 'Innovation Labs', initialProduct: 'Professional Plan', initialDate: '2024-01-20', crossSellProducts: ['Analytics Module'], crossSellDates: ['2024-03-15'], totalProducts: 2, segment: 'Startup' },
  { customerId: 'C006', customerName: 'Enterprise Co', initialProduct: 'Enterprise Plan', initialDate: '2024-01-05', crossSellProducts: ['Premium Support', 'Custom Integration'], crossSellDates: ['2024-02-10', '2024-04-20'], totalProducts: 3, segment: 'Enterprise' },
  { customerId: 'C007', customerName: 'Quick Solutions', initialProduct: 'Basic Plan', initialDate: '2024-03-01', crossSellProducts: ['Premium Support'], crossSellDates: ['2024-04-15'], totalProducts: 2, segment: 'SMB' },
  { customerId: 'C008', customerName: 'Tech Pioneer', initialProduct: 'Professional Plan', initialDate: '2024-02-10', crossSellProducts: ['API Access', 'Analytics Module'], crossSellDates: ['2024-03-05', '2024-04-20'], totalProducts: 3, segment: 'Startup' }
];

export const trendData: TrendData[] = [
  { month: 'Jan', attachRate: 45 },
  { month: 'Feb', attachRate: 52 },
  { month: 'Mar', attachRate: 58 },
  { month: 'Apr', attachRate: 61 },
  { month: 'May', attachRate: 65 },
  { month: 'Jun', attachRate: 68 }
];

export const productCombinationData: ProductCombination[] = [
  { combination: 'Basic + Analytics', count: 12, rate: 75 },
  { combination: 'Pro + API Access', count: 8, rate: 68 },
  { combination: 'Enterprise + Custom', count: 15, rate: 85 },
  { combination: 'Basic + Support', count: 6, rate: 45 },
  { combination: 'Pro + Analytics', count: 10, rate: 72 }
];

export const segmentData: SegmentData[] = [
  { segment: 'Enterprise', attachRate: 85, avgProducts: 3.2, revenue: 125000 },
  { segment: 'SMB', attachRate: 52, avgProducts: 1.8, revenue: 45000 },
  { segment: 'Startup', attachRate: 68, avgProducts: 2.4, revenue: 78000 }
];

export const timeToXSellData: TimeToXSellData[] = [
  { range: '0-30 days', count: 4, percentage: 25 },
  { range: '31-60 days', count: 6, percentage: 37.5 },
  { range: '61-90 days', count: 3, percentage: 18.75 },
  { range: '91+ days', count: 3, percentage: 18.75 }
];

export const affinityMatrix: AffinityMatrixItem[] = [
  { product: 'Analytics Module', basicRate: 75, proRate: 72, enterpriseRate: 90 },
  { product: 'API Access', basicRate: 25, proRate: 68, enterpriseRate: 45 },
  { product: 'Premium Support', basicRate: 45, proRate: 35, enterpriseRate: 80 },
  { product: 'Custom Integration', basicRate: 5, proRate: 15, enterpriseRate: 85 },
  { product: 'White Label', basicRate: 2, proRate: 8, enterpriseRate: 60 }
];
