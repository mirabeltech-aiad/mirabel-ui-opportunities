
import { ExpansionDeal, PaybackDistribution, ROITrendData, ExpansionTypeData, InvestmentBreakdown, ChannelPerformance } from './types';

export const mockExpansionDeals: ExpansionDeal[] = [
  { customerId: 'C001', customerName: 'Acme Corp', expansionType: 'Upsell', dealDate: '2024-01-15', investment: 5000, monthlyRevenue: 2500, paybackMonths: 2.0, currentROI: 150, status: 'Paid Back' },
  { customerId: 'C002', customerName: 'TechStart Inc', expansionType: 'Cross-sell', dealDate: '2024-02-01', investment: 3000, monthlyRevenue: 1200, paybackMonths: 2.5, currentROI: 120, status: 'Paid Back' },
  { customerId: 'C003', customerName: 'Global Solutions', expansionType: 'Add-on', dealDate: '2024-02-15', investment: 8000, monthlyRevenue: 3200, paybackMonths: 2.5, currentROI: 80, status: 'In Progress' },
  { customerId: 'C004', customerName: 'Local Business', expansionType: 'Upsell', dealDate: '2024-03-01', investment: 2000, monthlyRevenue: 800, paybackMonths: 2.5, currentROI: 60, status: 'In Progress' },
  { customerId: 'C005', customerName: 'Innovation Labs', expansionType: 'Cross-sell', dealDate: '2024-03-10', investment: 4500, monthlyRevenue: 1800, paybackMonths: 2.5, currentROI: 40, status: 'In Progress' },
  { customerId: 'C006', customerName: 'Enterprise Co', expansionType: 'Upsell', dealDate: '2024-01-20', investment: 12000, monthlyRevenue: 4800, paybackMonths: 2.5, currentROI: 200, status: 'Paid Back' },
  { customerId: 'C007', customerName: 'Quick Solutions', expansionType: 'Add-on', dealDate: '2024-04-01', investment: 1500, monthlyRevenue: 600, paybackMonths: 2.5, currentROI: 20, status: 'In Progress' },
  { customerId: 'C008', customerName: 'Tech Pioneer', expansionType: 'Cross-sell', dealDate: '2024-02-20', investment: 6000, monthlyRevenue: 2400, paybackMonths: 2.5, currentROI: 160, status: 'Paid Back' }
];

export const paybackDistribution: PaybackDistribution[] = [
  { range: '0-2 months', count: 2, percentage: 25 },
  { range: '2-3 months', count: 5, percentage: 62.5 },
  { range: '3-4 months', count: 1, percentage: 12.5 },
  { range: '4+ months', count: 0, percentage: 0 }
];

export const roiTrendData: ROITrendData[] = [
  { month: 'Jan', roi: 145, investment: 17000, revenue: 24650 },
  { month: 'Feb', roi: 158, investment: 13500, revenue: 21330 },
  { month: 'Mar', roi: 142, investment: 7000, revenue: 9940 },
  { month: 'Apr', roi: 120, investment: 1500, revenue: 1800 },
  { month: 'May', roi: 135, investment: 0, revenue: 0 },
  { month: 'Jun', roi: 148, investment: 0, revenue: 0 }
];

export const expansionTypeData: ExpansionTypeData[] = [
  { type: 'Upsell', avgPayback: 2.3, avgROI: 137, deals: 3, totalInvestment: 19000, totalRevenue: 26040 },
  { type: 'Cross-sell', avgPayback: 2.5, avgROI: 140, deals: 3, totalInvestment: 13500, totalRevenue: 18900 },
  { type: 'Add-on', avgPayback: 2.5, avgROI: 50, deals: 2, totalInvestment: 9500, totalRevenue: 4750 }
];

export const investmentBreakdown: InvestmentBreakdown[] = [
  { category: 'Sales Effort', amount: 15000, percentage: 35.7 },
  { category: 'Marketing Campaigns', amount: 12000, percentage: 28.6 },
  { category: 'Implementation', amount: 8000, percentage: 19.0 },
  { category: 'Customer Success', amount: 7000, percentage: 16.7 }
];

export const channelPerformance: ChannelPerformance[] = [
  { channel: 'Direct Sales', deals: 4, investment: 22000, revenue: 31200, avgPayback: 2.2, roi: 142 },
  { channel: 'Self-Service', deals: 2, investment: 3000, revenue: 4800, avgPayback: 1.9, roi: 160 },
  { channel: 'Marketing Campaign', deals: 2, investment: 17000, revenue: 13400, avgPayback: 3.8, roi: 79 }
];
