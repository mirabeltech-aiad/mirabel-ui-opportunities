
import { renderHook, act } from '@testing-library/react';
import { useTableSelection } from '../TableSelectionManager';

// Unit tests to ensure selection functionality is preserved
describe('useTableSelection', () => {
  const mockDisplayedItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  it('should initialize with empty selection', () => {
    const { result } = renderHook(() => useTableSelection(mockDisplayedItems));
    
    expect(result.current.selectedRows.size).toBe(0);
    expect(result.current.selectAll).toBe(false);
  });

  it('should handle select all correctly', () => {
    const { result } = renderHook(() => useTableSelection(mockDisplayedItems));
    
    act(() => {
      result.current.handleSelectAll(true);
    });
    
    expect(result.current.selectedRows.size).toBe(3);
    expect(result.current.selectAll).toBe(true);
    expect(result.current.selectedRows.has(1)).toBe(true);
    expect(result.current.selectedRows.has(2)).toBe(true);
    expect(result.current.selectedRows.has(3)).toBe(true);
  });

  it('should handle individual row selection correctly', () => {
    const { result } = renderHook(() => useTableSelection(mockDisplayedItems));
    
    act(() => {
      result.current.handleRowSelect(1, true);
    });
    
    expect(result.current.selectedRows.has(1)).toBe(true);
    expect(result.current.selectedRows.size).toBe(1);
    expect(result.current.selectAll).toBe(false);
  });

  it('should update selectAll when all items are individually selected', () => {
    const { result } = renderHook(() => useTableSelection(mockDisplayedItems));
    
    act(() => {
      result.current.handleRowSelect(1, true);
      result.current.handleRowSelect(2, true);
      result.current.handleRowSelect(3, true);
    });
    
    expect(result.current.selectAll).toBe(true);
    expect(result.current.selectedRows.size).toBe(3);
  });
});
