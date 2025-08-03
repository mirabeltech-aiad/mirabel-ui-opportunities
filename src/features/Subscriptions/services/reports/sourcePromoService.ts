
import { USE_MOCK_DATA } from '../apiClient';

// Mock API functions
const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

const mockSourcePromoData = {
  summary: {
    activeCodes: 45,
    newCodesThisMonth: 8,
    totalConversions: 12450,
    avgConversionRate: 6.2,
    totalRevenue: 1890000,
    avgOrderValue: 152,
    avgRetentionRate: 78
  },
  topPerformers: [
    { code: 'SPRING50', revenue: 245000 },
    { code: 'SAVE30', revenue: 189000 },
    { code: 'WELCOME25', revenue: 156000 },
    { code: 'LOYALTY', revenue: 134000 }
  ],
  typeDistribution: [
    { name: 'Discount', revenue: 580000 },
    { name: 'Free Trial', revenue: 450000 },
    { name: 'Bundle', revenue: 380000 },
    { name: 'Loyalty', revenue: 280000 }
  ],
  monthlyTrend: [
    { month: 'Jan', conversionRate: 5.8, revenue: 145000 },
    { month: 'Feb', conversionRate: 6.1, revenue: 156000 },
    { month: 'Mar', conversionRate: 6.5, revenue: 178000 },
    { month: 'Apr', conversionRate: 6.2, revenue: 165000 },
    { month: 'May', conversionRate: 6.8, revenue: 189000 },
    { month: 'Jun', conversionRate: 6.2, revenue: 172000 }
  ],
  detailedPerformance: [
    { id: '1', code: 'SPRING50', type: 'discount', impressions: 15000, conversions: 980, conversionRate: 6.5, revenue: 245000, averageOrderValue: 250, retentionRate: 82, status: 'active' },
    { id: '2', code: 'SAVE30', type: 'discount', impressions: 12000, conversions: 720, conversionRate: 6.0, revenue: 189000, averageOrderValue: 263, retentionRate: 78, status: 'active' },
    { id: '3', code: 'WELCOME25', type: 'trial', impressions: 8500, conversions: 510, conversionRate: 6.0, revenue: 156000, averageOrderValue: 306, retentionRate: 85, status: 'active' }
  ],
  channelPerformance: [
    { channel: 'Email', activeCodes: 12, conversionRate: 7.2, revenue: 456000, averageOrderValue: 189, retentionRate: 84 },
    { channel: 'Social Media', activeCodes: 8, conversionRate: 5.8, revenue: 234000, averageOrderValue: 156, retentionRate: 72 },
    { channel: 'Direct Mail', activeCodes: 15, conversionRate: 4.9, revenue: 389000, averageOrderValue: 198, retentionRate: 76 },
    { channel: 'Website', activeCodes: 10, conversionRate: 8.1, revenue: 567000, averageOrderValue: 213, retentionRate: 89 }
  ]
};

export const sourcePromoService = {
  async getSourcePromoData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    if (USE_MOCK_DATA) {
      console.log('Fetching source/promo data with date range:', dateRange);
      return await mockApiCall(mockSourcePromoData);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  }
};
