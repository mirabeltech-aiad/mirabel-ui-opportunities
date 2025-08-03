/**
 * @fileoverview Tests for useApiOrchestration hook
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useApiOrchestration } from '../useApiOrchestration';

// Mock timers
vi.useFakeTimers();

describe('useApiOrchestration', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useApiOrchestration());
    
    expect(result.current.stage).toBe('initial');
    expect(result.current.progress).toBe(0);
    expect(result.current.isCallEnabled('any-call')).toBe(false);
    expect(result.current.isStageComplete('critical')).toBe(false);
  });

  it('registers API calls correctly', () => {
    const { result } = renderHook(() => useApiOrchestration());
    
    act(() => {
      result.current.registerCall('test-call', 'critical');
    });
    
    // Call should not be enabled immediately
    expect(result.current.isCallEnabled('test-call')).toBe(false);
  });

  it('enables calls based on priority and timing', async () => {
    const { result } = renderHook(() => useApiOrchestration());
    
    act(() => {
      result.current.registerCall('critical-call', 'critical');
      result.current.registerCall('important-call', 'important');
    });
    
    // Fast-forward timers to enable critical calls
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    await waitFor(() => {
      expect(result.current.isCallEnabled('critical-call')).toBe(true);
    });
    
    // Important calls should still be disabled
    expect(result.current.isCallEnabled('important-call')).toBe(false);
  });

  it('progresses through stages correctly', async () => {
    const { result } = renderHook(() => useApiOrchestration());
    
    act(() => {
      result.current.registerCall('critical-call', 'critical');
    });
    
    // Should start in initial stage
    expect(result.current.stage).toBe('initial');
    
    // Progress to critical stage
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(result.current.stage).toBe('critical');
    });
  });

  it('calculates stage progress correctly', () => {
    const { result } = renderHook(() => useApiOrchestration());
    
    act(() => {
      result.current.registerCall('call1', 'critical');
      result.current.registerCall('call2', 'critical');
    });
    
    // Initially no progress
    expect(result.current.getStageProgress('critical')).toBe(0);
    
    // Enable one call
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Should show partial progress
    expect(result.current.getStageProgress('critical')).toBeGreaterThan(0);
  });

  it('handles dependencies correctly', async () => {
    const { result } = renderHook(() => useApiOrchestration());
    
    act(() => {
      result.current.registerCall('parent-call', 'critical');
      result.current.registerCall('child-call', 'important', ['parent-call']);
    });
    
    // Enable critical calls
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    await waitFor(() => {
      expect(result.current.isCallEnabled('parent-call')).toBe(true);
    });
    
    // Child call should still be disabled until parent is ready and timing allows
    expect(result.current.isCallEnabled('child-call')).toBe(false);
    
    // Progress to important stage
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(result.current.isCallEnabled('child-call')).toBe(true);
    });
  });

  it('completes stages when all calls are enabled', async () => {
    const { result } = renderHook(() => useApiOrchestration());
    
    act(() => {
      result.current.registerCall('critical-call', 'critical');
    });
    
    // Enable critical calls
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    await waitFor(() => {
      expect(result.current.isStageComplete('critical')).toBe(true);
    });
  });

  it('calculates overall progress correctly', async () => {
    const { result } = renderHook(() => useApiOrchestration());
    
    act(() => {
      result.current.registerCall('critical-call', 'critical');
      result.current.registerCall('important-call', 'important');
    });
    
    expect(result.current.progress).toBe(0);
    
    // Enable critical call
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    await waitFor(() => {
      expect(result.current.progress).toBeGreaterThan(0);
      expect(result.current.progress).toBeLessThan(100);
    });
  });

  it('reaches complete stage eventually', async () => {
    const { result } = renderHook(() => useApiOrchestration());
    
    act(() => {
      result.current.registerCall('call1', 'critical');
    });
    
    // Fast-forward through all stages
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    await waitFor(() => {
      expect(result.current.stage).toBe('complete');
      expect(result.current.progress).toBe(100);
    });
  });
});