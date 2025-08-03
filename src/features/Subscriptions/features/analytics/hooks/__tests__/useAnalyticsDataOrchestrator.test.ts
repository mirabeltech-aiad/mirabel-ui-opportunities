/**
 * @fileoverview Tests for useAnalyticsDataOrchestrator hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAnalyticsDataOrchestrator } from '../useAnalyticsDataOrchestrator';

// Mock the dependencies
vi.mock('@/hooks/useApiOrchestration', () => ({
  useApiOrchestration: vi.fn(() => ({
    registerCall: vi.fn(),
    isCallEnabled: vi.fn(),
    stage: 'initial',
    progress: 0,
    isStageComplete: vi.fn()
  }))
}));

vi.mock('../useAnalyticsData', () => ({
  useAnalyticsOverview: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useSubscriberDemographics: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useBehavioralSegments: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useEngagementMetrics: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useLifetimeValues: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  })),
  useChurnPredictions: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  }))
}));

describe('useAnalyticsDataOrchestrator', () => {
  const mockApiOrchestration = {
    registerCall: vi.fn(),
    isCallEnabled: vi.fn(),
    stage: 'initial',
    progress: 0,
    isStageComplete: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the mock implementation
    vi.mocked(require('@/hooks/useApiOrchestration').useApiOrchestration).mockReturnValue(mockApiOrchestration);
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useAnalyticsDataOrchestrator());
    
    expect(result.current.isInitialLoading).toBe(true);
    expect(result.current.isCriticalDataReady).toBe(false);
    expect(result.current.isImportantDataReady).toBe(false);
    expect(result.current.loadingStage).toBe('initial');
    expect(result.current.overallProgress).toBe(0);
  });

  it('registers all analytics calls with correct priorities', () => {
    renderHook(() => useAnalyticsDataOrchestrator());
    
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('analytics-overview', 'critical');
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('subscriber-demographics', 'critical');
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('behavioral-segments', 'important', ['analytics-overview']);
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('engagement-metrics', 'important', ['subscriber-demographics']);
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('lifetime-values', 'secondary', ['behavioral-segments']);
    expect(mockApiOrchestration.registerCall).toHaveBeenCalledWith('churn-predictions', 'background', ['engagement-metrics']);
  });

  it('provides correct component readiness flags', () => {
    mockApiOrchestration.isStageComplete = vi.fn((stage) => {
      return stage === 'critical';
    });
    mockApiOrchestration.stage = 'important';

    const { result } = renderHook(() => useAnalyticsDataOrchestrator());
    
    expect(result.current.canShowOverview).toBe(true);
    expect(result.current.canShowSegmentation).toBe(false);
    expect(result.current.canShowPredictions).toBe(true);
  });

  it('returns all data queries', () => {
    const { result } = renderHook(() => useAnalyticsDataOrchestrator());
    
    expect(result.current).toHaveProperty('overview');
    expect(result.current).toHaveProperty('demographics');
    expect(result.current).toHaveProperty('segments');
    expect(result.current).toHaveProperty('engagement');
    expect(result.current).toHaveProperty('lifetime');
    expect(result.current).toHaveProperty('churn');
  });

  it('updates loading states correctly when stage changes', async () => {
    const { result, rerender } = renderHook(() => useAnalyticsDataOrchestrator());
    
    // Initial state
    expect(result.current.isInitialLoading).toBe(true);
    
    // Simulate stage change
    mockApiOrchestration.stage = 'critical';
    mockApiOrchestration.isCallEnabled = vi.fn((call) => call === 'analytics-overview');
    
    rerender();
    
    expect(result.current.loadingStage).toBe('critical');
  });
});