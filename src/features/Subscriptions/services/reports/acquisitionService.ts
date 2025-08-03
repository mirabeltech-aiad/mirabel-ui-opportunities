
import { USE_MOCK_DATA } from '../apiClient';
import { AcquisitionData } from '@/types/subscription';

// Mock API functions
const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

const mockAcquisitionData: AcquisitionData = {
  channels: [
    { channel: 'Organic Search', subscribers: 25340, cost: 12000, cac: 47.35, conversionRate: 3.2 },
    { channel: 'Social Media', subscribers: 18920, cost: 28000, cac: 147.99, conversionRate: 2.1 },
    { channel: 'Email Marketing', subscribers: 12450, cost: 8500, cac: 68.27, conversionRate: 4.8 },
    { channel: 'Direct Mail', subscribers: 8300, cost: 15600, cac: 187.95, conversionRate: 1.2 },
    { channel: 'Referrals', subscribers: 6800, cost: 3400, cac: 50.00, conversionRate: 8.5 }
  ],
  monthlyTrends: [
    { month: 'Jan', newSubscribers: 3800, totalCost: 14200, avgCAC: 89.47 },
    { month: 'Feb', newSubscribers: 4100, totalCost: 15800, avgCAC: 92.68 },
    { month: 'Mar', newSubscribers: 4300, totalCost: 16200, avgCAC: 94.12 },
    { month: 'Apr', newSubscribers: 4500, totalCost: 17100, avgCAC: 95.33 },
    { month: 'May', newSubscribers: 3900, totalCost: 15900, avgCAC: 102.56 },
    { month: 'Jun', newSubscribers: 4300, totalCost: 16800, avgCAC: 97.67 }
  ]
};

export const acquisitionService = {
  async getAcquisitionData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }): Promise<AcquisitionData> {
    if (USE_MOCK_DATA) {
      console.log('Fetching acquisition data with date range:', dateRange);
      return await mockApiCall(mockAcquisitionData);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  }
};
