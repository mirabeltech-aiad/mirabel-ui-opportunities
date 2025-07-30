/**
 * @fileoverview Test utilities for integration and unit testing
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Context Providers
import { ProductFilterProvider } from '@/contexts/ProductFilterContext';
import { BusinessModelProvider } from '@/contexts/BusinessModelContext';
import { ReportsProvider } from '@/features/reports/context/Context';

/**
 * Custom render function that includes all necessary providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  initialProductFilter?: {
    selectedProducts: string[];
    selectedBusinessUnits: string[];
  };
  initialBusinessModel?: string;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(
        BusinessModelProvider,
        { children: React.createElement(
          ProductFilterProvider,
          { children: React.createElement(
            ReportsProvider,
            { children }
          ) }
        ) }
      )
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Creates a test-optimized QueryClient instance
 */
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

/**
 * Mock factory for analytics service responses
 */
export const createMockAnalyticsData = () => ({
  overview: {
    totalSubscribers: 10000,
    activeSubscribers: 8500,
    averageLTV: 150.0,
    overallEngagementScore: 0.72,
    churnRisk: { low: 0.02, medium: 0.05, high: 0.08, critical: 0.15 },
    revenueGrowthRate: 0.15,
    conversionRate: 0.03,
    topPerformingSegments: ['Premium', 'Standard'],
    keyInsights: ['High engagement', 'Growing LTV']
  },
  demographics: [
    { ageGroup: '25-34', gender: 'M', count: 150 },
    { ageGroup: '35-44', gender: 'F', count: 200 }
  ],
  segments: [
    { segment: 'high-engagement', subscribers: 500 },
    { segment: 'casual-reader', subscribers: 300 }
  ],
  engagement: [
    { metric: 'page_views', value: 15000, trend: 'up' },
    { metric: 'session_duration', value: 480, trend: 'stable' }
  ],
  lifetime: [
    { segment: 'premium', avg_ltv: 1200, median_ltv: 1000 },
    { segment: 'standard', avg_ltv: 800, median_ltv: 750 }
  ],
  churn: [
    { subscriber_id: 'sub1', churn_probability: 0.15, risk_factors: ['low_engagement'] },
    { subscriber_id: 'sub2', churn_probability: 0.75, risk_factors: ['payment_issues'] }
  ]
});

/**
 * Mock factory for reports data
 */
export const createMockReportsData = () => ([
  {
    id: '1',
    name: 'Revenue Report',
    description: 'Monthly revenue analysis',
    category: 'Financial',
    type: 'dashboard',
    configuration: {},
    parameters: {},
    applicable_company_types: ['media'],
    status: 'active'
  },
  {
    id: '2',
    name: 'User Engagement Report',
    description: 'User behavior insights',
    category: 'Analytics',
    type: 'chart',
    configuration: {},
    parameters: {},
    applicable_company_types: ['media', 'ecommerce'],
    status: 'active'
  }
]);

/**
 * Mock factory for circulation data
 */
export const createMockCirculationData = () => ({
  summary: {
    totalDistribution: 25000,
    totalSold: 18500,
    returnRate: 0.26,
    netDistribution: 18500
  },
  distribution: [
    { channel: 'Newsstand', distributed: 12000, sold: 8800, returned: 3200 },
    { channel: 'Subscription', distributed: 10000, sold: 9500, returned: 500 },
    { channel: 'Digital', distributed: 3000, sold: 2200, returned: 800 }
  ],
  trends: [
    { period: '2024-01', distribution: 24000, sales: 17800 },
    { period: '2024-02', distribution: 25500, sales: 18200 },
    { period: '2024-03', distribution: 25000, sales: 18500 }
  ]
});

/**
 * Helper to create Supabase mock responses
 */
export const createSupabaseMock = (data: any, error: any = null) => ({
  data,
  error,
  count: data?.length || 0,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK'
});

/**
 * Mock implementation for Supabase client
 */
export const createMockSupabaseClient = (responses: Record<string, any> = {}) => {
  const defaultResponse = createSupabaseMock([]);
  
  return {
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          in: vi.fn(() => responses[table] || defaultResponse),
          contains: vi.fn(() => responses[table] || defaultResponse),
          data: responses[table]?.data || [],
          error: responses[table]?.error || null
        })),
        data: responses[table]?.data || [],
        error: responses[table]?.error || null
      })),
      insert: vi.fn(() => responses[`${table}_insert`] || defaultResponse),
      update: vi.fn(() => responses[`${table}_update`] || defaultResponse),
      delete: vi.fn(() => responses[`${table}_delete`] || defaultResponse)
    }))
  };
};

/**
 * Helper to wait for all async operations to complete
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Console spy utility for testing error handling
 */
export const createConsoleSpy = () => {
  const originalConsole = { ...console };
  const spies = {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  };

  return {
    ...spies,
    restore: () => {
      Object.assign(console, originalConsole);
      Object.values(spies).forEach(spy => spy.mockRestore());
    }
  };
};

// Re-export commonly used testing utilities
export * from '@testing-library/react';
export { vi } from 'vitest';