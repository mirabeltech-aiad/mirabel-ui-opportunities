
import { USE_MOCK_DATA } from '../apiClient';

// Mock API functions
const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

const mockDigitalEngagementData = {
  metrics: {
    totalDigitalSubscribers: 47250,
    avgMonthlyLogins: 12.4,
    avgTimeSpentMinutes: 18.7,
    contentEngagementRate: 67.3
  },
  trends: [
    { month: 'Jan', logins: 11.8, timeSpent: 17.2, engagement: 65.1 },
    { month: 'Feb', logins: 12.1, timeSpent: 18.0, engagement: 66.3 },
    { month: 'Mar', logins: 12.5, timeSpent: 18.8, engagement: 67.8 },
    { month: 'Apr', logins: 12.3, timeSpent: 18.5, engagement: 67.1 },
    { month: 'May', logins: 12.7, timeSpent: 19.1, engagement: 68.2 },
    { month: 'Jun', logins: 12.4, timeSpent: 18.7, engagement: 67.3 }
  ]
};

export const digitalEngagementService = {
  async getDigitalEngagementData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    if (USE_MOCK_DATA) {
      console.log('Fetching digital engagement data with date range:', dateRange);
      return await mockApiCall(mockDigitalEngagementData);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  }
};
