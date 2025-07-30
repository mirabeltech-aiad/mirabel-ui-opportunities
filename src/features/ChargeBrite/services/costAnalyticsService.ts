
import { USE_MOCK_DATA } from './apiClient';
import { CostMetrics, AcquisitionCosts, DeliveryExpenses, SubscriberProfitability, CostBreakdown } from '@/types/costAnalytics';

// Mock data for cost analytics
const mockCostMetrics: CostMetrics = {
  totalCosts: 1847500,
  acquisitionCosts: 425000,
  deliveryCosts: 680000,
  operationalCosts: 742500,
  costPerSubscriber: 14.70,
  profitMargin: 35.1,
  roi: 154.2,
};

const mockAcquisitionCosts: AcquisitionCosts[] = [
  { channel: 'Social Media', cost: 127500, subscribers: 38450, cac: 3.32, ltv: 340, ltvCacRatio: 102.4, trend: -5.2 },
  { channel: 'Search Engine', cost: 106250, subscribers: 31200, cac: 3.41, ltv: 340, ltvCacRatio: 99.7, trend: 2.1 },
  { channel: 'Email Marketing', cost: 85000, subscribers: 25800, cac: 3.29, ltv: 340, ltvCacRatio: 103.3, trend: -12.5 },
  { channel: 'Direct Traffic', cost: 63750, subscribers: 18950, cac: 3.36, ltv: 340, ltvCacRatio: 101.2, trend: 8.7 },
  { channel: 'Referral', cost: 42500, subscribers: 12600, cac: 3.37, ltv: 340, ltvCacRatio: 100.9, trend: 15.3 },
];

const mockDeliveryExpenses: DeliveryExpenses[] = [
  { type: 'print', cost: 425000, volume: 78420, costPerUnit: 5.42, subscribers: 78420, costPerSubscriber: 5.42, trend: -2.1 },
  { type: 'digital', cost: 142000, volume: 47250, costPerUnit: 3.01, subscribers: 47250, costPerSubscriber: 3.01, trend: -8.5 },
  { type: 'both', cost: 113000, volume: 19500, costPerUnit: 5.79, subscribers: 19500, costPerSubscriber: 5.79, trend: 3.2 },
];

const mockSubscriberProfitability: SubscriberProfitability[] = [
  { subscriberId: 'sub_001', revenue: 149.99, costs: 52.30, profit: 97.69, profitMargin: 65.1, segment: 'Premium', acquisitionChannel: 'Social Media', subscriptionType: 'both', monthsActive: 8 },
  { subscriberId: 'sub_002', revenue: 89.99, costs: 38.20, profit: 51.79, profitMargin: 57.5, segment: 'Standard', acquisitionChannel: 'Search Engine', subscriptionType: 'print', monthsActive: 12 },
  { subscriberId: 'sub_003', revenue: 120.00, costs: 45.80, profit: 74.20, profitMargin: 61.8, segment: 'Business', acquisitionChannel: 'Email Marketing', subscriptionType: 'print', monthsActive: 15 },
  { subscriberId: 'sub_004', revenue: 600.00, costs: 180.50, profit: 419.50, profitMargin: 69.9, segment: 'Premium Tech', acquisitionChannel: 'Direct Traffic', subscriptionType: 'digital', monthsActive: 6 },
];

const mockCostBreakdown: CostBreakdown[] = [
  {
    category: 'Acquisition Costs',
    amount: 425000,
    percentage: 23.0,
    trend: -3.2,
    subcategories: [
      { name: 'Digital Advertising', amount: 255000, percentage: 60.0 },
      { name: 'Content Marketing', amount: 85000, percentage: 20.0 },
      { name: 'Referral Programs', amount: 42500, percentage: 10.0 },
      { name: 'Events & Partnerships', amount: 42500, percentage: 10.0 },
    ]
  },
  {
    category: 'Delivery Costs',
    amount: 680000,
    percentage: 36.8,
    trend: -5.8,
    subcategories: [
      { name: 'Print Production', amount: 340000, percentage: 50.0 },
      { name: 'Shipping & Logistics', amount: 204000, percentage: 30.0 },
      { name: 'Digital Infrastructure', amount: 95200, percentage: 14.0 },
      { name: 'Distribution Partners', amount: 40800, percentage: 6.0 },
    ]
  },
  {
    category: 'Operational Costs',
    amount: 742500,
    percentage: 40.2,
    trend: 1.5,
    subcategories: [
      { name: 'Personnel', amount: 371250, percentage: 50.0 },
      { name: 'Technology & Tools', amount: 148500, percentage: 20.0 },
      { name: 'Office & Facilities', amount: 111375, percentage: 15.0 },
      { name: 'Customer Support', amount: 74250, percentage: 10.0 },
      { name: 'Other', amount: 37125, percentage: 5.0 },
    ]
  }
];

const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

export const costAnalyticsService = {
  async getCostMetrics(productIds?: string[], businessUnitIds?: string[]): Promise<CostMetrics> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockCostMetrics);
    }
    throw new Error('Real API not implemented yet');
  },

  async getAcquisitionCosts(productIds?: string[], businessUnitIds?: string[]): Promise<AcquisitionCosts[]> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockAcquisitionCosts);
    }
    throw new Error('Real API not implemented yet');
  },

  async getDeliveryExpenses(productIds?: string[], businessUnitIds?: string[]): Promise<DeliveryExpenses[]> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockDeliveryExpenses);
    }
    throw new Error('Real API not implemented yet');
  },

  async getSubscriberProfitability(productIds?: string[], businessUnitIds?: string[]): Promise<SubscriberProfitability[]> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockSubscriberProfitability);
    }
    throw new Error('Real API not implemented yet');
  },

  async getCostBreakdown(productIds?: string[], businessUnitIds?: string[]): Promise<CostBreakdown[]> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockCostBreakdown);
    }
    throw new Error('Real API not implemented yet');
  },
};
