
import { renderHook, act } from '@testing-library/react';
import { useTableColumns } from '../TableColumnManager';

// Unit tests to ensure column management functionality is preserved
describe('useTableColumns', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default columns', () => {
    const { result } = renderHook(() => useTableColumns());
    
    expect(result.current.columnOrder).toHaveLength(14);
    expect(result.current.columnOrder[0].id).toBe('status');
    expect(result.current.draggedColumn).toBe(null);
    expect(result.current.columnWidths).toEqual({});
  });

  it('should handle column resize', () => {
    const { result } = renderHook(() => useTableColumns());
    
    act(() => {
      result.current.handleColumnResize('status', 150);
    });
    
    expect(result.current.columnWidths.status).toBe(150);
  });

  it('should save column widths to localStorage', () => {
    const { result } = renderHook(() => useTableColumns());
    
    act(() => {
      result.current.handleColumnResize('status', 150);
    });
    
    // Wait for useEffect to run
    setTimeout(() => {
      const saved = localStorage.getItem('tableColumnWidths');
      expect(JSON.parse(saved)).toEqual({ status: 150 });
    }, 0);
  });

  it('should handle drag start and end', () => {
    const { result } = renderHook(() => useTableColumns());
    
    const mockEvent = {
      dataTransfer: {
        effectAllowed: '',
        setData: jest.fn(),
        setDragImage: jest.fn()
      },
      target: {
        cloneNode: jest.fn(() => ({
          style: {}
        }))
      }
    };
    
    // Mock DOM methods
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    
    act(() => {
      result.current.handleDragStart(mockEvent, 'status');
    });
    
    expect(result.current.draggedColumn).toBe('status');
    
    act(() => {
      result.current.handleDragEnd();
    });
    
    expect(result.current.draggedColumn).toBe(null);
  });
});
