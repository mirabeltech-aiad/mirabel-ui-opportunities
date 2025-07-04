
import { renderHook } from '@testing-library/react';
import { useLossTrends } from '../hooks/useLossTrends';

describe('useLossTrends', () => {
  test('should return trends data with correct structure', () => {
    const { result } = renderHook(() => useLossTrends());

    expect(result.current).toHaveLength(6);
    expect(result.current[0]).toHaveProperty('month');
    expect(result.current[0]).toHaveProperty('totalLosses');
    expect(result.current[0]).toHaveProperty('competitiveLosses');
    expect(result.current[0]).toHaveProperty('budgetLosses');
  });

  test('should return consistent data between renders', () => {
    const { result, rerender } = renderHook(() => useLossTrends());
    const firstResult = result.current;
    
    rerender();
    
    expect(result.current).toEqual(firstResult);
  });

  test('should have all required months', () => {
    const { result } = renderHook(() => useLossTrends());
    const months = result.current.map(item => item.month);
    
    expect(months).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
  });
});
