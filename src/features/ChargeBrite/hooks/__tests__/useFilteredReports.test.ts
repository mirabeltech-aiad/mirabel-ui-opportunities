/**
 * @fileoverview Tests for useFilteredReports hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFilteredReports } from '../useFilteredReports';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          contains: vi.fn(() => ({
            data: [],
            error: null
          }))
        }))
      }))
    }))
  }
}));

// Mock business model context
vi.mock('@/contexts/BusinessModelContext', () => ({
  useBusinessModel: () => ({
    businessModel: 'media'
  })
}));

describe('useFilteredReports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default state', async () => {
    const { result } = renderHook(() => useFilteredReports());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.reports).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.businessModel).toBe('media');
  });

  it('fetches reports on mount', async () => {
    const mockReports = [
      {
        id: '1',
        name: 'Test Report 1',
        description: 'A test report',
        type: 'dashboard',
        configuration: {},
        parameters: {},
        applicable_company_types: ['media'],
        status: 'active'
      }
    ];
    
    const mockSupabase = require('@/integrations/supabase/client').supabase;
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          contains: vi.fn(() => ({
            data: mockReports,
            error: null
          }))
        }))
      }))
    });
    
    const { result } = renderHook(() => useFilteredReports());
    
    await waitFor(() => {
      expect(result.current.reports).toEqual(mockReports);
    });
  });

  it('filters reports by business model', async () => {
    const mockReports = [
      {
        id: '1',
        name: 'Media Report',
        applicable_company_types: ['media'],
        status: 'active'
      },
      {
        id: '2',
        name: 'E-commerce Report',
        applicable_company_types: ['ecommerce'],
        status: 'active'
      }
    ];
    
    const mockSupabase = require('@/integrations/supabase/client').supabase;
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          contains: vi.fn((field, value) => ({
            data: field === 'applicable_company_types' && value.includes('media') 
              ? [mockReports[0]] 
              : mockReports,
            error: null
          }))
        }))
      }))
    });
    
    const { result } = renderHook(() => useFilteredReports());
    
    await waitFor(() => {
      // Should only include the media report
      expect(result.current.reports).toHaveLength(1);
      expect(result.current.reports[0].name).toBe('Media Report');
    });
  });

  it('handles API errors gracefully', async () => {
    const mockError = new Error('Database error');
    const mockSupabase = require('@/integrations/supabase/client').supabase;
    
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          contains: vi.fn(() => ({
            data: null,
            error: mockError
          }))
        }))
      }))
    });
    
    const { result } = renderHook(() => useFilteredReports());
    
    await waitFor(() => {
      expect(result.current.error).toBe('Database error');
      expect(result.current.reports).toEqual([]);
    });
  });

  it('provides refresh functionality', async () => {
    const mockSupabase = require('@/integrations/supabase/client').supabase;
    const selectMock = vi.fn(() => ({
      eq: vi.fn(() => ({
        contains: vi.fn(() => ({
          data: [],
          error: null
        }))
      }))
    }));
    
    mockSupabase.from.mockReturnValue({
      select: selectMock
    });
    
    const { result } = renderHook(() => useFilteredReports());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Call refresh
    await result.current.refreshReports();
    
    // Should have called the API twice (initial + refresh)
    expect(selectMock).toHaveBeenCalledTimes(2);
  });

  it('sets loading state correctly during fetch', async () => {
    const { result } = renderHook(() => useFilteredReports());
    
    // Should start as loading
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('filters only active reports', async () => {
    const mockReports = [
      { id: '1', status: 'active', applicable_company_types: ['media'] },
      { id: '2', status: 'inactive', applicable_company_types: ['media'] }
    ];
    
    const mockSupabase = require('@/integrations/supabase/client').supabase;
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn((field, value) => ({
          contains: vi.fn(() => ({
            data: field === 'status' && value === 'active' 
              ? [mockReports[0]] 
              : mockReports,
            error: null
          }))
        }))
      }))
    });
    
    const { result } = renderHook(() => useFilteredReports());
    
    await waitFor(() => {
      expect(result.current.reports).toHaveLength(1);
      expect(result.current.reports[0].id).toBe('1');
    });
  });
});