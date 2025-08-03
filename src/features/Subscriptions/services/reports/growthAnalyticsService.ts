
import { USE_MOCK_DATA } from '../apiClient';
import { GrowthData, ChurnData, GeographicData } from '@/types/subscription';

// Mock API functions
const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

const mockGrowthData: GrowthData[] = [
  { month: 'Jan', total: 118500, print: 82000, digital: 36500, newSubscriptions: 3800, churnedSubscriptions: 2500 },
  { month: 'Feb', total: 120200, print: 81500, digital: 38700, newSubscriptions: 4100, churnedSubscriptions: 2200 },
  { month: 'Mar', total: 121800, print: 80800, digital: 41000, newSubscriptions: 4300, churnedSubscriptions: 2800 },
  { month: 'Apr', total: 123400, print: 79900, digital: 43500, newSubscriptions: 4500, churnedSubscriptions: 2300 },
  { month: 'May', total: 124600, print: 79200, digital: 45400, newSubscriptions: 3900, churnedSubscriptions: 2100 },
  { month: 'Jun', total: 125670, print: 78420, digital: 47250, newSubscriptions: 4300, churnedSubscriptions: 1900 },
];

const mockChurnData: ChurnData[] = [
  { month: 'Jan', churnRate: 2.1, newSubs: 4200, cancelations: 2500 },
  { month: 'Feb', churnRate: 1.8, newSubs: 3800, cancelations: 2200 },
  { month: 'Mar', churnRate: 2.3, newSubs: 4100, cancelations: 2800 },
  { month: 'Apr', churnRate: 1.9, newSubs: 4500, cancelations: 2300 },
  { month: 'May', churnRate: 1.7, newSubs: 3900, cancelations: 2100 },
  { month: 'Jun', churnRate: 1.5, newSubs: 4300, cancelations: 1900 },
];

const mockGeographicData: GeographicData[] = [
  { region: 'North America', subscribers: 52340, percentage: 41.6, growth: '+2.1%' },
  { region: 'Europe', subscribers: 38920, percentage: 31.0, growth: '+1.8%' },
  { region: 'Asia Pacific', subscribers: 22180, percentage: 17.6, growth: '+4.2%' },
  { region: 'Latin America', subscribers: 8430, percentage: 6.7, growth: '+3.1%' },
  { region: 'Middle East & Africa', subscribers: 3800, percentage: 3.0, growth: '+2.8%' },
];

export const growthAnalyticsService = {
  async getGrowthData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }): Promise<GrowthData[]> {
    if (USE_MOCK_DATA) {
      console.log('Fetching growth data with date range:', dateRange);
      // In a real implementation, we would filter the mock data based on dateRange
      return await mockApiCall(mockGrowthData);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  },

  async getChurnData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }): Promise<ChurnData[]> {
    if (USE_MOCK_DATA) {
      console.log('Fetching churn data with date range:', dateRange);
      // In a real implementation, we would filter the mock data based on dateRange
      return await mockApiCall(mockChurnData);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  },

  async getGeographicData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }): Promise<GeographicData[]> {
    if (USE_MOCK_DATA) {
      console.log('Fetching geographic data with date range:', dateRange);
      // In a real implementation, we would filter the mock data based on dateRange
      return await mockApiCall(mockGeographicData);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  }
};
