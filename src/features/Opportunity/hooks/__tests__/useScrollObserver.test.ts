
import { renderHook } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useScrollObserver } from '../useScrollObserver';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let mockCallback: ((entries: any[]) => void) | null = null;

const mockIntersectionObserver = vi.fn().mockImplementation((callback) => {
  mockCallback = callback;
  return {
    observe: mockObserve,
    disconnect: mockDisconnect,
  };
});

// @ts-ignore
global.IntersectionObserver = mockIntersectionObserver;

describe('useScrollObserver', () => {
  beforeEach(() => {
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    mockIntersectionObserver.mockClear();
    mockCallback = null;
  });

  // Warning: Tests ensure refactoring doesn't break existing functionality
  test('creates observer with correct options', () => {
    const mockCallbackFn = vi.fn();
    renderHook(() => useScrollObserver(mockCallbackFn, true, false));
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '50px',
        root: null
      }
    );
  });

  test('calls callback when intersecting and conditions are met', () => {
    const mockCallbackFn = vi.fn();
    const { result } = renderHook(() => useScrollObserver(mockCallbackFn, true, false));
    
    // Simulate intersection
    const mockEntry = { isIntersecting: true, intersectionRatio: 0.5 };
    mockCallback!([mockEntry]);
    
    expect(mockCallbackFn).toHaveBeenCalledTimes(1);
  });

  test('does not call callback when not intersecting', () => {
    const mockCallbackFn = vi.fn();
    renderHook(() => useScrollObserver(mockCallbackFn, true, false));
    
    const mockEntry = { isIntersecting: false, intersectionRatio: 0 };
    mockCallback!([mockEntry]);
    
    expect(mockCallbackFn).not.toHaveBeenCalled();
  });

  test('does not call callback when no more items', () => {
    const mockCallbackFn = vi.fn();
    renderHook(() => useScrollObserver(mockCallbackFn, false, false));
    
    const mockEntry = { isIntersecting: true, intersectionRatio: 0.5 };
    mockCallback!([mockEntry]);
    
    expect(mockCallbackFn).not.toHaveBeenCalled();
  });

  test('does not call callback when loading', () => {
    const mockCallbackFn = vi.fn();
    renderHook(() => useScrollObserver(mockCallbackFn, true, true));
    
    const mockEntry = { isIntersecting: true, intersectionRatio: 0.5 };
    mockCallback!([mockEntry]);
    
    expect(mockCallbackFn).not.toHaveBeenCalled();
  });

  test('disconnects observer on cleanup', () => {
    const mockCallbackFn = vi.fn();
    const { unmount } = renderHook(() => useScrollObserver(mockCallbackFn, true, false));
    
    unmount();
    
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
