/**
 * @fileoverview Tests for Reports API Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reportsApiService } from '../api';

// Mock the Supabase client
vi.mock('../../../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        data: null,
        error: null
      }))
    }))
  }
}));

describe('ReportsApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getReports', () => {
    it('returns empty array when no data', async () => {
      const result = await reportsApiService.getReports();
      
      expect(result).toEqual([]);
    });
  });

  describe('getReportTemplates', () => {
    it('fetches report templates for given business model', async () => {
      const businessModel = 'media' as const;
      
      const result = await reportsApiService.getReportTemplates(businessModel);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles errors gracefully', async () => {
      // Mock error response
      const mockError = new Error('Database error');
      vi.mocked(require('../../../integrations/supabase/client').supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: null,
            error: mockError
          }))
        }))
      });

      await expect(reportsApiService.getReportTemplates('media' as const)).rejects.toThrow('Database error');
    });
  });

  describe('generateReport', () => {
    it('generates report with template and parameters', async () => {
      const templateId = 'template-123';
      const parameters = { dateRange: '30days' };
      
      const result = await reportsApiService.generateReport(templateId, parameters);
      
      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
    });
  });

  describe('getReportStatus', () => {
    it('fetches report status by ID', async () => {
      const reportId = 'report-123';
      
      const result = await reportsApiService.getReportStatus(reportId);
      
      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
    });
  });

  describe('scheduleReport', () => {
    it('schedules report with frequency and parameters', async () => {
      const templateId = 'template-123';
      const schedule = {
        frequency: 'weekly',
        nextRunDate: '2024-01-01',
        parameters: { dateRange: '7days' }
      };
      
      const result = await reportsApiService.scheduleReport(templateId, schedule);
      
      expect(result).toBeDefined();
      expect(result.scheduleId).toBeDefined();
    });
  });
});