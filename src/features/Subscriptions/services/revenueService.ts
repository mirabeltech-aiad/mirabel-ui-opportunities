
import { USE_MOCK_DATA } from './apiClient';
import type { 
  RevenueMetrics, 
  AcquisitionChannelRevenue, 
  SubscriptionTypeRevenue, 
  GeographicRevenue, 
  RevenueAttribution 
} from '@/types/revenue';

// Mock data for revenue analytics
const mockRevenueMetrics: RevenueMetrics = {
  totalRevenue: 2847500,
  revenueGrowth: 8.4,
  monthlyRecurring: 1875000,
  mrrGrowth: 12.3,
  arpu: 22.65,
  arpuChange: 2.1,
  revenuePerMonth: 237292,
  growthRate: 8.4,
  customerLTV: 340,
};

const mockAcquisitionChannelRevenue: AcquisitionChannelRevenue[] = [
  { channel: 'Social Media', revenue: 854200, subscribers: 38450, arpu: 22.22, cac: 15.50, ltvCacRatio: 3.2, percentage: 30.0 },
  { channel: 'Search Engine', revenue: 712100, subscribers: 31200, arpu: 22.82, cac: 18.25, ltvCacRatio: 2.8, percentage: 25.0 },
  { channel: 'Email Marketing', revenue: 569400, subscribers: 25800, arpu: 22.07, cac: 8.75, ltvCacRatio: 4.6, percentage: 20.0 },
  { channel: 'Direct Traffic', revenue: 427050, subscribers: 18950, arpu: 22.53, cac: 12.00, ltvCacRatio: 3.5, percentage: 15.0 },
  { channel: 'Referral', revenue: 284700, subscribers: 12600, arpu: 22.59, cac: 22.50, ltvCacRatio: 2.1, percentage: 10.0 },
];

const mockSubscriptionTypeRevenue: SubscriptionTypeRevenue = {
  monthly: [
    { month: 'Jan', print: 950000, digital: 420000, both: 380000 },
    { month: 'Feb', print: 945000, digital: 445000, both: 395000 },
    { month: 'Mar', print: 940000, digital: 465000, both: 410000 },
    { month: 'Apr', print: 935000, digital: 485000, both: 425000 },
    { month: 'May', print: 930000, digital: 505000, both: 440000 },
    { month: 'Jun', print: 925000, digital: 525000, both: 455000 },
  ],
  summary: [
    { type: 'print', revenue: 925000, subscribers: 41200, arpu: 22.45, growth: -2.1 },
    { type: 'digital', revenue: 525000, subscribers: 23800, arpu: 22.06, growth: 8.7 },
    { type: 'both', revenue: 455000, subscribers: 19500, arpu: 23.33, growth: 12.3 },
  ],
};

const mockGeographicRevenue: GeographicRevenue = {
  regional: [
    { region: 'North America', revenue: 1423750, arpu: 23.25, growth: 7.2 },
    { region: 'Europe', revenue: 854250, arpu: 22.15, growth: 9.1 },
    { region: 'Asia Pacific', revenue: 427125, arpu: 21.95, growth: 15.8 },
    { region: 'Latin America', revenue: 142375, arpu: 20.85, growth: 12.4 },
  ],
  cities: [
    { city: 'New York', country: 'USA', revenue: 285000, subscribers: 12800 },
    { city: 'London', country: 'UK', revenue: 198500, subscribers: 8950 },
    { city: 'Los Angeles', country: 'USA', revenue: 187200, subscribers: 8100 },
    { city: 'Tokyo', country: 'Japan', revenue: 156800, subscribers: 7200 },
    { city: 'Chicago', country: 'USA', revenue: 142300, subscribers: 6150 },
    { city: 'Toronto', country: 'Canada', revenue: 128900, subscribers: 5800 },
    { city: 'Paris', country: 'France', revenue: 115600, subscribers: 5200 },
    { city: 'Sydney', country: 'Australia', revenue: 98400, subscribers: 4650 },
  ],
};

const mockRevenueAttribution: RevenueAttribution = {
  touchpoints: [
    { touchpoint: 'First Touch', attributedRevenue: 568700 },
    { touchpoint: 'Last Touch', attributedRevenue: 712100 },
    { touchpoint: 'Linear', attributedRevenue: 427050 },
    { touchpoint: 'Time Decay', attributedRevenue: 356200 },
    { touchpoint: 'Position Based', attributedRevenue: 498750 },
  ],
  channelTypeMatrix: [
    { channel: 'Social Media', type: 'Digital', revenue: 285000, subscribers: 12800, arpu: 22.27, percentage: 35.2 },
    { channel: 'Search Engine', type: 'Print', revenue: 198500, subscribers: 8950, arpu: 22.18, percentage: 24.5 },
    { channel: 'Email Marketing', type: 'Both', revenue: 156800, subscribers: 6720, arpu: 23.33, percentage: 19.4 },
    { channel: 'Direct Traffic', type: 'Digital', revenue: 142300, subscribers: 6150, arpu: 23.13, percentage: 17.6 },
    { channel: 'Referral', type: 'Print', revenue: 98400, subscribers: 4380, arpu: 22.47, percentage: 12.1 },
  ],
  geographic: [
    { region: 'North America', revenue: 1280000, percentage: 45.0, topChannels: ['Social Media', 'Search Engine'] },
    { region: 'Europe', revenue: 854000, percentage: 30.0, topChannels: ['Email Marketing', 'Direct Traffic'] },
    { region: 'Asia Pacific', revenue: 427000, percentage: 15.0, topChannels: ['Social Media', 'Referral'] },
    { region: 'Latin America', revenue: 285000, percentage: 10.0, topChannels: ['Search Engine', 'Email Marketing'] },
  ],
  summary: {
    totalAttributedRevenue: 2847500,
    attributionConfidence: 87.3,
    averageTouchpoints: 3.4,
  },
};

const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

export const revenueService = {
  async getRevenueMetrics(productIds?: string[], businessUnitIds?: string[]): Promise<RevenueMetrics> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockRevenueMetrics);
    }
    throw new Error('Real API not implemented yet');
  },

  async getAcquisitionChannelRevenue(productIds?: string[], businessUnitIds?: string[]): Promise<AcquisitionChannelRevenue[]> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockAcquisitionChannelRevenue);
    }
    throw new Error('Real API not implemented yet');
  },

  async getSubscriptionTypeRevenue(productIds?: string[], businessUnitIds?: string[]): Promise<SubscriptionTypeRevenue> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockSubscriptionTypeRevenue);
    }
    throw new Error('Real API not implemented yet');
  },

  async getGeographicRevenue(productIds?: string[], businessUnitIds?: string[]): Promise<GeographicRevenue> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockGeographicRevenue);
    }
    throw new Error('Real API not implemented yet');
  },

  async getRevenueAttribution(productIds?: string[], businessUnitIds?: string[]): Promise<RevenueAttribution> {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockRevenueAttribution);
    }
    throw new Error('Real API not implemented yet');
  },
};
