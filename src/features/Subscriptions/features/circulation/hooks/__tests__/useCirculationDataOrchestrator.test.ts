/**
 * @fileoverview Tests for useCirculationDataOrchestrator hook
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCirculationDataOrchestrator } from '@/hooks/useCirculationDataOrchestrator';

// Mock the dependencies
vi.mock('@/hooks/useApiOrchestration', () => ({
  useApiOrchestration: vi.fn()
}));

vi.mock('@/hooks/useCirculationData', () => ({
  useSubscriptionMetrics: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useRevenueMetrics: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useSubscriptionGrowth: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useRetentionAnalysis: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useChurnAnalysis: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useGeographicDistribution: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  }))
}));

describe('useCirculationDataOrchestrator', () => {
  const mockApiOrchestration = {
    registerCall: vi.fn(),
    isCallEnabled: vi.fn(() => false),
    stage: 'initial',
    progress: 0,
    isStageComplete: vi.fn(() => false)
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(require('@/hooks/useApiOrchestration').useApiOrchestration).mockReturnValue(mockApiOrchestration);
  });

  it('registers circulation data calls with correct priorities', () => {
    const dateRange = { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') };
    renderHook(() => useCirculationDataOrchestrator(dateRange));
    
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('subscription-metrics', 'critical');
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('revenue-metrics', 'critical');
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('subscription-growth', 'important', ['subscription-metrics']);
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('retention-analysis', 'important', ['revenue-metrics']);
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('churn-analysis', 'secondary', ['retention-analysis']);
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('geographic-distribution', 'background', ['subscription-growth']);
  });

  it('provides initial loading state correctly', () => {
    const { result } = renderHook(() => useCirculationDataOrchestrator({ startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') }));
    
    expect(result.current.isInitialLoading).toBe(true);
    expect(result.current.isCriticalDataReady).toBe(false);
    expect(result.current.isImportantDataReady).toBe(false);
  });

  it('returns all data queries', () => {
    const { result } = renderHook(() => useCirculationDataOrchestrator({ startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') }));
    
    expect(result.current).toHaveProperty('metrics');
    expect(result.current).toHaveProperty('revenue');
    expect(result.current).toHaveProperty('growth');
    expect(result.current).toHaveProperty('retention');
    expect(result.current).toHaveProperty('churn');
    expect(result.current).toHaveProperty('geographic');
  });

  it('provides correct component readiness flags', () => {
    mockApiOrchestration.isStageComplete = vi.fn((stage) => {
      return stage === 'critical';
    });
    mockApiOrchestration.stage = 'important';

    const { result } = renderHook(() => useCirculationDataOrchestrator({ startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') }));
    
    expect(result.current.canShowOverview).toBe(true);
    expect(result.current.canShowCharts).toBe(false);
    expect(result.current.canShowDetails).toBe(true);
  });

  it('updates readiness flags when data stages complete', () => {
    mockApiOrchestration.isStageComplete = vi.fn((stage) => {
      return stage === 'critical' || stage === 'important';
    });

    const { result } = renderHook(() => useCirculationDataOrchestrator({ startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') }));
    
    expect(result.current.canShowOverview).toBe(true);
    expect(result.current.canShowCharts).toBe(true);
    expect(result.current.canShowDetails).toBe(true);
  });

  it('handles different date ranges correctly', () => {
    const { result: result7d } = renderHook(() => useCirculationDataOrchestrator({ startDate: new Date('2024-01-24'), endDate: new Date('2024-01-31') }));
    const { result: result90d } = renderHook(() => useCirculationDataOrchestrator({ startDate: new Date('2023-11-01'), endDate: new Date('2024-01-31') }));
    
    // Both should provide the same structure regardless of date range
    expect(result7d.current).toHaveProperty('metrics');
    expect(result90d.current).toHaveProperty('metrics');
  });
});