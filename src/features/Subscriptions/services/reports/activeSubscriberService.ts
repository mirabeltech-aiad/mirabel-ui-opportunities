
import { USE_MOCK_DATA } from '../apiClient';
import { Subscription, SubscriptionMetrics } from '@/types/subscription';

// Mock API functions
const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

const mockMetrics: SubscriptionMetrics = {
  total: 125670,
  print: 78420,
  digital: 47250,
  active: 123450,
  cancelled: 2220,
  newThisMonth: 4300,
  churnRate: 1.5
};

const mockSubscriptions: Subscription[] = [
  // Daily Herald subscriptions
  { id: 'sub_001', customerId: 'cust_001', productId: 'daily-herald', type: 'both', status: 'active', startDate: '2024-01-15', renewalDate: '2025-01-15', price: 149.99, billingCycle: 'annual', region: 'North America', city: 'New York', country: 'USA' },
  { id: 'sub_002', customerId: 'cust_002', productId: 'daily-herald', type: 'print', status: 'active', startDate: '2024-03-01', renewalDate: '2024-12-01', price: 89.99, billingCycle: 'annual', region: 'North America', city: 'Chicago', country: 'USA' },
  
  // Business Weekly subscriptions
  { id: 'sub_003', customerId: 'cust_003', productId: 'business-weekly', type: 'print', status: 'active', startDate: '2024-02-15', renewalDate: '2025-02-15', price: 120.00, billingCycle: 'annual', region: 'Europe', city: 'London', country: 'UK' },
  { id: 'sub_004', customerId: 'cust_004', productId: 'business-weekly', type: 'print', status: 'cancelled', startDate: '2023-08-01', endDate: '2024-05-01', renewalDate: '2024-08-01', price: 120.00, billingCycle: 'annual', region: 'Europe', city: 'Paris', country: 'France' },
  
  // Tech Digest subscriptions
  { id: 'sub_005', customerId: 'cust_005', productId: 'tech-digest', type: 'digital', status: 'active', startDate: '2024-04-01', renewalDate: '2024-10-01', price: 60.00, billingCycle: 'monthly', region: 'Asia Pacific', city: 'Tokyo', country: 'Japan' },
  { id: 'sub_006', customerId: 'cust_006', productId: 'tech-digest', type: 'digital', status: 'active', startDate: '2024-01-01', renewalDate: '2025-01-01', price: 600.00, billingCycle: 'annual', region: 'North America', city: 'San Francisco', country: 'USA' },
  
  // Add more mock data for other products...
  { id: 'sub_007', customerId: 'cust_007', productId: 'lifestyle-magazine', type: 'both', status: 'active', startDate: '2024-03-15', renewalDate: '2025-03-15', price: 180.00, billingCycle: 'annual', region: 'Europe', city: 'Berlin', country: 'Germany' },
  { id: 'sub_008', customerId: 'cust_008', productId: 'sports-tribune', type: 'print', status: 'active', startDate: '2024-05-01', renewalDate: '2024-11-01', price: 45.00, billingCycle: 'monthly', region: 'North America', city: 'Toronto', country: 'Canada' },
];

export const activeSubscriberService = {
  async getMetrics(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }): Promise<SubscriptionMetrics> {
    if (USE_MOCK_DATA) {
      console.log('Fetching metrics with date range:', dateRange);
      return await mockApiCall(mockMetrics);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  },

  async getSubscriptions(filters?: { productIds?: string[], businessUnitIds?: string[], status?: string, dateRange?: { startDate?: Date; endDate?: Date } }): Promise<Subscription[]> {
    if (USE_MOCK_DATA) {
      let filteredData = mockSubscriptions;
      
      if (filters?.productIds?.length) {
        filteredData = filteredData.filter(sub => filters.productIds!.includes(sub.productId));
      }
      
      if (filters?.status) {
        filteredData = filteredData.filter(sub => sub.status === filters.status);
      }
      
      console.log('Fetching subscriptions with filters:', filters);
      return await mockApiCall(filteredData);
    }
    
    // Real API call will go here
    throw new Error('Real API not implemented yet');
  }
};
