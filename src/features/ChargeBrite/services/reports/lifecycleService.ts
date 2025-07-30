
import { USE_MOCK_DATA } from '../apiClient';
import { LifecycleData } from '@/types/subscription';

// Mock API functions
const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

const mockLifecycleData: LifecycleData = {
  acquisitionFunnel: [
    { stage: 'Visitors', count: 50000, conversionRate: 100 },
    { stage: 'Trials', count: 5000, conversionRate: 10 },
    { stage: 'Paid', count: 1250, conversionRate: 25 },
    { stage: 'Retained (90d)', count: 1000, conversionRate: 80 }
  ],
  retentionCohorts: [
    { month: 'Jan 2024', month1: 100, month3: 85, month6: 72, month12: 65 },
    { month: 'Feb 2024', month1: 100, month3: 88, month6: 75, month12: 68 },
    { month: 'Mar 2024', month1: 100, month3: 82, month6: 70, month12: null },
    { month: 'Apr 2024', month1: 100, month3: 86, month6: null, month12: null }
  ],
  churnReasons: [
    { reason: 'Price too high', percentage: 35, count: 420 },
    { reason: 'Content not relevant', percentage: 28, count: 336 },
    { reason: 'Technical issues', percentage: 15, count: 180 },
    { reason: 'Competitor offer', percentage: 12, count: 144 },
    { reason: 'Other', percentage: 10, count: 120 }
  ]
};

export const lifecycleService = {
  async getLifecycleData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }): Promise<LifecycleData> {
    if (USE_MOCK_DATA) {
      console.log('Fetching lifecycle data with date range:', dateRange);
      return await mockApiCall(mockLifecycleData);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  }
};
