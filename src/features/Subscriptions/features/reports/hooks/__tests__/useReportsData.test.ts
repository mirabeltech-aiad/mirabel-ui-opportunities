/**
 * @fileoverview Tests for useReportsData hook
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReportsData } from '../useReportsData';

// Mock the context
const mockDispatch = vi.fn();
const mockState = {
  reports: [],
  filteredReports: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  activeCategory: 'All',
  favoriteReports: new Set(),
  pagination: { page: 1, limit: 12, total: 0, hasNext: false, hasPrevious: false },
  categories: [],
  categoryReportCounts: {},
  reportsByCategory: {},
  lastUpdated: null
};

vi.mock('../context', () => ({
  useReportsContext: () => ({
    state: mockState,
    dispatch: mockDispatch
  })
}));

// Mock the API service
vi.mock('../services/api', () => ({
  reportsApiService: {
    getReports: vi.fn(() => Promise.resolve([
      { id: '1', name: 'Test Report 1', category: 'Analytics' },
      { id: '2', name: 'Test Report 2', category: 'Performance' }
    ]))
  }
}));

describe('useReportsData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides loading state and dispatch function', () => {
    const { result } = renderHook(() => useReportsData());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.loadReports).toBeInstanceOf(Function);
    expect(result.current.refreshReports).toBeInstanceOf(Function);
  });

  it('calls loadReports and updates state', async () => {
    const { result } = renderHook(() => useReportsData());
    
    await act(async () => {
      await result.current.loadReports();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SET_LOADING',
        payload: true
      })
    );
  });

  it('handles errors during data loading', async () => {
    // Mock API error
    vi.mocked(require('../services/api').reportsApiService.getReports).mockRejectedValue(
      new Error('API Error')
    );
    
    const { result } = renderHook(() => useReportsData());
    
    await act(async () => {
      await result.current.loadReports();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SET_ERROR',
        payload: expect.any(Error)
      })
    );
  });
});