/**
 * @fileoverview Tests for useErrorRecovery Hook
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useErrorRecovery } from '../useErrorRecovery';

// Mock the error handling utilities
vi.mock('@/utils/errorHandling', () => ({
  logError: vi.fn(() => 'mock-error-id'),
  showErrorNotification: vi.fn(),
}));

describe('useErrorRecovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with no error state', () => {
    const { result } = renderHook(() => useErrorRecovery());

    expect(result.current.errorState).toEqual({
      hasError: false,
      retryCount: 0,
      isRecovering: false,
      canRetry: true
    });
  });

  it('captures error and updates state', () => {
    const { result } = renderHook(() => useErrorRecovery({
      feature: 'test-feature'
    }));

    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError);
    });

    expect(result.current.errorState.hasError).toBe(true);
    expect(result.current.errorState.error).toBe(testError);
    expect(result.current.errorState.errorId).toBe('mock-error-id');
  });

  it('handles retry correctly', async () => {
    const mockOnRecovery = vi.fn();
    const { result } = renderHook(() => useErrorRecovery({
      retryDelay: 100,
      onRecovery: mockOnRecovery
    }));

    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError);
    });

    expect(result.current.errorState.retryCount).toBe(0);

    act(() => {
      result.current.retry();
    });

    expect(result.current.errorState.isRecovering).toBe(true);

    await waitFor(() => {
      expect(result.current.errorState.isRecovering).toBe(false);
    });

    expect(result.current.errorState.retryCount).toBe(1);
    expect(mockOnRecovery).toHaveBeenCalled();
  });

  it('respects maxRetries limit', () => {
    const { result } = renderHook(() => useErrorRecovery({
      maxRetries: 2
    }));

    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError);
    });

    // First retry
    act(() => {
      result.current.retry();
    });

    expect(result.current.errorState.canRetry).toBe(true);

    // Second retry (should reach limit)
    act(() => {
      result.current.retry();
    });

    expect(result.current.errorState.canRetry).toBe(false);
  });

  it('resets error state correctly', () => {
    const { result } = renderHook(() => useErrorRecovery());

    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError);
    });

    expect(result.current.errorState.hasError).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.errorState).toEqual({
      hasError: false,
      retryCount: 0,
      isRecovering: false,
      canRetry: true
    });
  });

  it('clears error while preserving retry count', () => {
    const { result } = renderHook(() => useErrorRecovery());

    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError);
    });

    act(() => {
      result.current.retry();
    });

    const retryCount = result.current.errorState.retryCount;

    act(() => {
      result.current.clearError();
    });

    expect(result.current.errorState.hasError).toBe(false);
    expect(result.current.errorState.error).toBeUndefined();
    expect(result.current.errorState.retryCount).toBe(retryCount);
  });

  it('calls onError callback when error is captured', () => {
    const mockOnError = vi.fn();
    const { result } = renderHook(() => useErrorRecovery({
      onError: mockOnError,
      feature: 'test-feature'
    }));

    const testError = new Error('Test error');
    const testContext = { action: 'test-action' };

    act(() => {
      result.current.captureError(testError, testContext);
    });

    expect(mockOnError).toHaveBeenCalledWith(testError, {
      feature: 'test-feature',
      component: 'useErrorRecovery',
      action: 'error_captured',
      ...testContext
    });
  });

  it('prevents retry when already recovering', async () => {
    const mockOnRecovery = vi.fn();
    const { result } = renderHook(() => useErrorRecovery({
      retryDelay: 100,
      onRecovery: mockOnRecovery
    }));

    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError);
    });

    // Start first retry
    act(() => {
      result.current.retry();
    });

    expect(result.current.errorState.isRecovering).toBe(true);

    // Try to start second retry while first is in progress
    act(() => {
      result.current.retry();
    });

    // Should still only be called once
    await waitFor(() => {
      expect(result.current.errorState.isRecovering).toBe(false);
    });

    expect(mockOnRecovery).toHaveBeenCalledTimes(1);
  });

  it('handles auto-recovery when enabled', async () => {
    const mockOnRecovery = vi.fn();
    const { result } = renderHook(() => useErrorRecovery({
      autoRecovery: true,
      retryDelay: 50,
      onRecovery: mockOnRecovery
    }));

    const testError = new Error('Test error');

    act(() => {
      result.current.captureError(testError);
    });

    // Wait for auto-recovery to trigger
    await waitFor(() => {
      expect(mockOnRecovery).toHaveBeenCalled();
    }, { timeout: 200 });

    expect(result.current.errorState.retryCount).toBe(1);
  });
});