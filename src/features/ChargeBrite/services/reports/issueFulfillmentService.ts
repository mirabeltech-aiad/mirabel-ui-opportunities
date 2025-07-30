
import { USE_MOCK_DATA } from '../apiClient';

// Mock API functions
const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

const mockIssueFulfillmentData = {
  metrics: {
    totalIssuesDelivered: 2450000,
    onTimeDeliveryRate: 94.2,
    digitalAccessRate: 98.7,
    customerSatisfactionScore: 4.3
  },
  trends: [
    { month: 'Jan', delivered: 405000, onTime: 93.8, digital: 98.2, satisfaction: 4.2 },
    { month: 'Feb', delivered: 398000, onTime: 94.1, digital: 98.5, satisfaction: 4.3 },
    { month: 'Mar', delivered: 412000, onTime: 94.5, digital: 98.8, satisfaction: 4.4 },
    { month: 'Apr', delivered: 408000, onTime: 94.3, digital: 98.9, satisfaction: 4.3 },
    { month: 'May', delivered: 415000, onTime: 94.0, digital: 98.6, satisfaction: 4.2 },
    { month: 'Jun', delivered: 412000, onTime: 94.2, digital: 98.7, satisfaction: 4.3 }
  ]
};

export const issueFulfillmentService = {
  async getIssueFulfillmentData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    if (USE_MOCK_DATA) {
      console.log('Fetching issue fulfillment data with date range:', dateRange);
      return await mockApiCall(mockIssueFulfillmentData);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  }
};
