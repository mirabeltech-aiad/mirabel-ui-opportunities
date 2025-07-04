
import { renderHook, act } from '@testing-library/react';
import { useTableSort } from '../TableSortManager';

// Unit tests to ensure sorting functionality is preserved
describe('useTableSort', () => {
  const mockOpportunities = [
    { id: 1, name: 'Charlie', amount: '1000', status: 'Open' },
    { id: 2, name: 'Alpha', amount: '3000', status: 'Closed' },
    { id: 3, name: 'Beta', amount: '2000', status: 'Open' }
  ];

  it('should initialize with no sort', () => {
    const { result } = renderHook(() => useTableSort(mockOpportunities));
    
    expect(result.current.sortConfig.key).toBe(null);
    expect(result.current.sortConfig.direction).toBe('ascending');
    expect(result.current.sortedOpportunities).toEqual(mockOpportunities);
  });

  it('should sort by name ascending', () => {
    const { result } = renderHook(() => useTableSort(mockOpportunities));
    
    act(() => {
      result.current.requestSort('name');
    });
    
    expect(result.current.sortConfig.key).toBe('name');
    expect(result.current.sortConfig.direction).toBe('ascending');
    expect(result.current.sortedOpportunities[0].name).toBe('Alpha');
    expect(result.current.sortedOpportunities[1].name).toBe('Beta');
    expect(result.current.sortedOpportunities[2].name).toBe('Charlie');
  });

  it('should sort by name descending when clicked twice', () => {
    const { result } = renderHook(() => useTableSort(mockOpportunities));
    
    act(() => {
      result.current.requestSort('name');
    });
    
    act(() => {
      result.current.requestSort('name');
    });
    
    expect(result.current.sortConfig.direction).toBe('descending');
    expect(result.current.sortedOpportunities[0].name).toBe('Charlie');
    expect(result.current.sortedOpportunities[1].name).toBe('Beta');
    expect(result.current.sortedOpportunities[2].name).toBe('Alpha');
  });

  it('should sort numeric amounts correctly', () => {
    const { result } = renderHook(() => useTableSort(mockOpportunities));
    
    act(() => {
      result.current.requestSort('amount');
    });
    
    expect(result.current.sortedOpportunities[0].amount).toBe('1000');
    expect(result.current.sortedOpportunities[1].amount).toBe('2000');
    expect(result.current.sortedOpportunities[2].amount).toBe('3000');
  });
});
