
import { USE_MOCK_DATA } from '../apiClient';

// Mock API functions
const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

const mockChurnCancellationData = {
  summary: {
    totalCancellations: 2220,
    avgDaysToCancel: 45,
    totalRefunds: 85000,
    refundRate: 12.5,
    earlyCancellations: 445
  },
  cancellations: [
    { id: '1', customerId: 'CUST001', productName: 'Premium Plan', cancellationDate: '2024-06-15', reason: 'Price too high', daysActive: 32, autoRenewEnabled: true, firstIssueReceived: true, refundAmount: 89.99 },
    { id: '2', customerId: 'CUST002', productName: 'Basic Plan', cancellationDate: '2024-06-14', reason: 'Not using service', daysActive: 67, autoRenewEnabled: false, firstIssueReceived: true, refundAmount: 0 },
    { id: '3', customerId: 'CUST003', productName: 'Pro Plan', cancellationDate: '2024-06-13', reason: 'Technical issues', daysActive: 12, autoRenewEnabled: true, firstIssueReceived: false, refundAmount: 149.99 }
  ],
  reasonBreakdown: [
    { name: 'Price too high', count: 420 },
    { name: 'Not using service', count: 336 },
    { name: 'Technical issues', count: 180 },
    { name: 'Found alternative', count: 144 },
    { name: 'Other', count: 120 }
  ],
  monthlyTrend: [
    { month: 'Jan', cancellations: 2500 },
    { month: 'Feb', cancellations: 2200 },
    { month: 'Mar', cancellations: 2800 },
    { month: 'Apr', cancellations: 2300 },
    { month: 'May', cancellations: 2100 },
    { month: 'Jun', cancellations: 1900 }
  ]
};

export const churnCancellationService = {
  async getChurnCancellationData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    if (USE_MOCK_DATA) {
      console.log('Fetching churn cancellation data with date range:', dateRange);
      return await mockApiCall(mockChurnCancellationData);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  }
};
