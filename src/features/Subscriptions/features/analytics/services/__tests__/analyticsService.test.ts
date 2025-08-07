/**
 * @fileoverview Tests for Analytics Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsService } from '../analyticsService';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          in: vi.fn(() => ({
            data: [],
            error: null
          })),
          data: [],
          error: null
        })),
        data: [],
        error: null
      }))
    }))
  }
}));

describe('Analytics Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSubscriberDemographics', () => {
    it('fetches demographics data successfully', async () => {
      const mockData = [
        { age_group: '25-34', gender: 'M', count: 150 },
        { age_group: '35-44', gender: 'F', count: 200 }
      ];
      
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({
              data: mockData,
              error: null
            }))
          }))
        }))
      });

      const result = await analyticsService.getDemographics(['product1'], ['unit1']);
      
      expect(result).toEqual(mockData);
      expect(mockSupabase.from).toHaveBeenCalledWith('subscriber_demographics');
    });

    it('handles API errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({
              data: null,
              error: mockError
            }))
          }))
        }))
      });

      await expect(
        analyticsService.getDemographics(['product1'], ['unit1'])
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('getBehavioralSegments', () => {
    it('fetches behavioral segments successfully', async () => {
      const mockData = [
        { segment: 'high-engagement', subscribers: 500, characteristics: ['daily_reader'] },
        { segment: 'casual-reader', subscribers: 300, characteristics: ['weekend_reader'] }
      ];
      
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({
              data: mockData,
              error: null
            }))
          }))
        }))
      });

      const result = await analyticsService.getBehavioralSegments(['product1'], ['unit1']);
      
      expect(result).toEqual(mockData);
    });
  });

  describe('getLifetimeValues', () => {
    it('calculates lifetime values correctly', async () => {
      const mockData = [
        { segment: 'premium', avg_ltv: 1200, median_ltv: 1000 },
        { segment: 'standard', avg_ltv: 800, median_ltv: 750 }
      ];
      
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({
              data: mockData,
              error: null
            }))
          }))
        }))
      });

      const result = await analyticsService.getLifetimeValues(['product1'], ['unit1']);
      
      expect(result).toEqual(mockData);
    });
  });

  describe('getEngagementMetrics', () => {
    it('fetches engagement metrics successfully', async () => {
      const mockData = [
        { metric: 'page_views', value: 15000, trend: 'up' },
        { metric: 'session_duration', value: 480, trend: 'stable' }
      ];
      
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({
              data: mockData,
              error: null
            }))
          }))
        }))
      });

      const result = await analyticsService.getEngagementMetrics(['product1'], ['unit1']);
      
      expect(result).toEqual(mockData);
    });
  });

  describe('getChurnPredictions', () => {
    it('fetches churn predictions successfully', async () => {
      const mockData = [
        { subscriber_id: 'sub1', churn_probability: 0.15, risk_factors: ['low_engagement'] },
        { subscriber_id: 'sub2', churn_probability: 0.75, risk_factors: ['payment_issues', 'no_recent_activity'] }
      ];
      
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({
              data: mockData,
              error: null
            }))
          }))
        }))
      });

      const result = await analyticsService.getChurnPredictions(['product1'], ['unit1']);
      
      expect(result).toEqual(mockData);
    });
  });

  describe('getAnalyticsOverview', () => {
    it('fetches overview data successfully', async () => {
      const mockData = {
        total_subscribers: 10000,
        active_subscribers: 8500,
        churn_rate: 0.05,
        avg_engagement: 0.72
      };
      
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({
              data: [mockData],
              error: null
            }))
          }))
        }))
      });

      const result = await analyticsService.getAnalyticsOverview(['product1'], ['unit1']);
      
      expect(result).toEqual(mockData);
    });

    it('returns null when no data available', async () => {
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({
              data: [],
              error: null
            }))
          }))
        }))
      });

      const result = await analyticsService.getAnalyticsOverview(['product1'], ['unit1']);
      
      expect(result).toBeNull();
    });
  });
});