/**
 * @fileoverview API Service Integration Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyticsService } from '../../analytics/services/analyticsService';
import { reportsApiService } from '../../reports/services/api';

// Simple mock implementation
const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        in: vi.fn(() => ({ data: [], error: null })),
        contains: vi.fn(() => ({ data: [], error: null }))
      }))
    })),
    insert: vi.fn(() => ({ data: null, error: null })),
    update: vi.fn(() => ({ data: null, error: null })),
    delete: vi.fn(() => ({ data: null, error: null }))
  }))
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient
}));

describe('API Service Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Analytics Service Integration', () => {
    it('integrates with Supabase for demographics data', async () => {
      const mockData = [
        { age_group: '25-34', gender: 'M', count: 150 }
      ];

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({ data: mockData, error: null })),
            contains: vi.fn(() => ({ data: mockData, error: null }))
          }))
        })),
        insert: vi.fn(() => ({ data: null, error: null })),
        update: vi.fn(() => ({ data: null, error: null })),
        delete: vi.fn(() => ({ data: null, error: null }))
      });

      const result = await analyticsService.getDemographics(['prod1'], ['unit1']);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('subscriber_demographics');
      expect(result).toEqual(mockData);
    });

    it('handles connection errors gracefully', async () => {
      const error = new Error('Connection timeout');

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({ data: null, error })),
            contains: vi.fn(() => ({ data: null, error }))
          }))
        })),
        insert: vi.fn(() => ({ data: null, error: null })),
        update: vi.fn(() => ({ data: null, error: null })),
        delete: vi.fn(() => ({ data: null, error: null }))
      });

      await expect(
        analyticsService.getDemographics(['prod1'], ['unit1'])
      ).rejects.toThrow('Connection timeout');
    });

    it('performs batch queries', async () => {
      const mockData = [{ id: 1, value: 0.75 }];

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({ data: mockData, error: null })),
            contains: vi.fn(() => ({ data: mockData, error: null }))
          }))
        })),
        insert: vi.fn(() => ({ data: null, error: null })),
        update: vi.fn(() => ({ data: null, error: null })),
        delete: vi.fn(() => ({ data: null, error: null }))
      });

      await Promise.all([
        analyticsService.getEngagementMetrics(['prod1'], ['unit1']),
        analyticsService.getBehavioralSegments(['prod1'], ['unit1'])
      ]);

      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(2);
    });
  });

  describe('Reports Service Integration', () => {
    it('integrates with Supabase for report templates', async () => {
      const mockTemplates = [
        { id: '1', name: 'Revenue Analysis', type: 'dashboard' }
      ];

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({ data: mockTemplates, error: null })),
            contains: vi.fn(() => ({ data: mockTemplates, error: null }))
          }))
        })),
        insert: vi.fn(() => ({ data: null, error: null })),
        update: vi.fn(() => ({ data: null, error: null })),
        delete: vi.fn(() => ({ data: null, error: null }))
      });

      const result = await reportsApiService.getReportTemplates('media');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('report_templates');
      expect(result).toEqual(mockTemplates);
    });

    it('handles report generation workflow', async () => {
      const mockReport = { id: 'report-123', status: 'pending' };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({ data: [], error: null })),
            contains: vi.fn(() => ({ data: [], error: null }))
          }))
        })),
        insert: vi.fn(() => ({ data: [mockReport], error: null })),
        update: vi.fn(() => ({ data: null, error: null })),
        delete: vi.fn(() => ({ data: null, error: null }))
      });

      const result = await reportsApiService.generateReport(
        'template-123',
        { dateRange: '30days' }
      );

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('reportId');
    });
  });

  describe('Cross-Service Integration', () => {
    it('maintains consistency across service calls', async () => {
      const mockData = [{ id: 'test', updated_at: new Date().toISOString() }];

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({ data: mockData, error: null })),
            contains: vi.fn(() => ({ data: mockData, error: null }))
          }))
        })),
        insert: vi.fn(() => ({ data: null, error: null })),
        update: vi.fn(() => ({ data: null, error: null })),
        delete: vi.fn(() => ({ data: null, error: null }))
      });

      await Promise.all([
        analyticsService.getAnalyticsOverview(['prod1'], ['unit1']),
        reportsApiService.getReports()
      ]);

      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(2);
    });

    it('handles authentication errors', async () => {
      const authError = new Error('Unauthorized');

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({ data: null, error: authError })),
            contains: vi.fn(() => ({ data: null, error: authError }))
          }))
        })),
        insert: vi.fn(() => ({ data: null, error: null })),
        update: vi.fn(() => ({ data: null, error: null })),
        delete: vi.fn(() => ({ data: null, error: null }))
      });

      await expect(
        analyticsService.getDemographics(['prod1'], ['unit1'])
      ).rejects.toThrow('Unauthorized');
    });
  });
});