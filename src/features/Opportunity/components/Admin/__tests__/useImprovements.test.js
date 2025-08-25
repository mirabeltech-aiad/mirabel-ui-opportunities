
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImprovements } from '../hooks/useImprovements';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock toast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  toast: mockToast,
}));

describe('useImprovements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('initializes with empty improvements array', () => {
    const { result } = renderHook(() => useImprovements());
    
    expect(result.current.improvements).toEqual([]);
  });

  it('loads improvements from localStorage on mount', () => {
    const mockImprovements = [{ id: 1, title: 'Test' }];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockImprovements));
    
    const { result } = renderHook(() => useImprovements());
    
    expect(result.current.improvements).toEqual(mockImprovements);
  });

  it('adds improvement successfully with valid data', () => {
    const { result } = renderHook(() => useImprovements());
    
    act(() => {
      const success = result.current.addImprovement({
        title: 'Test Improvement',
        description: 'Test Description',
        priority: 'high'
      });
      expect(success).toBe(true);
    });
    
    expect(result.current.improvements).toHaveLength(1);
    expect(result.current.improvements[0].title).toBe('Test Improvement');
    expect(mockToast).toHaveBeenCalledWith({
      title: "Success",
      description: "Improvement has been added",
    });
  });

  it('rejects improvement with empty title', () => {
    const { result } = renderHook(() => useImprovements());
    
    act(() => {
      const success = result.current.addImprovement({
        title: '',
        description: 'Test Description',
        priority: 'high'
      });
      expect(success).toBe(false);
    });
    
    expect(result.current.improvements).toHaveLength(0);
    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Please enter a title for the improvement",
      variant: "destructive",
    });
  });

  it('deletes improvement successfully', () => {
    const { result } = renderHook(() => useImprovements());
    
    // Add an improvement first
    act(() => {
      result.current.addImprovement({
        title: 'Test Improvement',
        description: 'Test Description',
        priority: 'high'
      });
    });
    
    const improvementId = result.current.improvements[0].id;
    
    // Delete the improvement
    act(() => {
      result.current.deleteImprovement(improvementId);
    });
    
    expect(result.current.improvements).toHaveLength(0);
    expect(mockToast).toHaveBeenCalledWith({
      title: "Success",
      description: "Improvement has been deleted",
    });
  });
});
