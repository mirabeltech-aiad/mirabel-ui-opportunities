import { renderHook, act } from '@testing-library/react'
import { useSelection } from '../hooks/useSelection'

// Mock data for testing
const mockData = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 35 },
  { id: 4, name: 'Diana', age: 28 }
]

describe('useSelection', () => {
  let mockOnSelectionChange: jest.Mock

  beforeEach(() => {
    mockOnSelectionChange = jest.fn()
  })

  it('should initialize with empty selection', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(),
        onSelectionChange: mockOnSelectionChange
      })
    )

    expect(result.current.selectedRows.size).toBe(0)
    expect(result.current.selectedRowData).toEqual([])
    expect(result.current.isAllSelected).toBe(false)
    expect(result.current.isPartiallySelected).toBe(false)
    expect(result.current.selectionCount).toBe(0)
  })

  it('should select a single row', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(),
        onSelectionChange: mockOnSelectionChange
      })
    )

    act(() => {
      result.current.selectRow(mockData[0])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['1']))
  })

  it('should deselect a row', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(['1', '2']),
        onSelectionChange: mockOnSelectionChange
      })
    )

    act(() => {
      result.current.deselectRow(mockData[0])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['2']))
  })

  it('should toggle row selection', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(['1']),
        onSelectionChange: mockOnSelectionChange
      })
    )

    // Toggle selected row (should deselect)
    act(() => {
      result.current.toggleRowSelection(mockData[0])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set())

    // Reset mock
    mockOnSelectionChange.mockClear()

    // Toggle unselected row (should select)
    act(() => {
      result.current.toggleRowSelection(mockData[1])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['1', '2']))
  })

  it('should select all rows', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(),
        onSelectionChange: mockOnSelectionChange
      })
    )

    act(() => {
      result.current.selectAll()
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['1', '2', '3', '4']))
  })

  it('should deselect all rows', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(['1', '2', '3']),
        onSelectionChange: mockOnSelectionChange
      })
    )

    act(() => {
      result.current.deselectAll()
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set())
  })

  it('should toggle select all', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(['1', '2', '3', '4']),
        onSelectionChange: mockOnSelectionChange
      })
    )

    // All selected, should deselect all
    act(() => {
      result.current.toggleSelectAll()
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set())

    // Update hook with empty selection
    const { result: result2 } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(),
        onSelectionChange: mockOnSelectionChange
      })
    )

    // None selected, should select all
    act(() => {
      result2.current.toggleSelectAll()
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['1', '2', '3', '4']))
  })

  it('should select range of rows', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(),
        onSelectionChange: mockOnSelectionChange
      })
    )

    act(() => {
      result.current.selectRange(mockData[1], mockData[3])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['2', '3', '4']))
  })

  it('should select multiple rows', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(['1']),
        onSelectionChange: mockOnSelectionChange
      })
    )

    act(() => {
      result.current.selectMultiple([mockData[1], mockData[2]])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['1', '2', '3']))
  })

  it('should deselect multiple rows', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(['1', '2', '3', '4']),
        onSelectionChange: mockOnSelectionChange
      })
    )

    act(() => {
      result.current.deselectMultiple([mockData[1], mockData[2]])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['1', '4']))
  })

  it('should invert selection', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(['1', '3']),
        onSelectionChange: mockOnSelectionChange
      })
    )

    act(() => {
      result.current.invertSelection()
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['2', '4']))
  })

  it('should check if row is selected', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(['1', '3']),
        onSelectionChange: mockOnSelectionChange
      })
    )

    expect(result.current.isRowSelected(mockData[0])).toBe(true)
    expect(result.current.isRowSelected(mockData[1])).toBe(false)
    expect(result.current.isRowSelected(mockData[2])).toBe(true)
    expect(result.current.isRowSelected(mockData[3])).toBe(false)
  })

  it('should calculate selection statistics', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(['1', '2']),
        onSelectionChange: mockOnSelectionChange
      })
    )

    const stats = result.current.getSelectionStats()
    
    expect(stats.total).toBe(4)
    expect(stats.selected).toBe(2)
    expect(stats.percentage).toBe(50)
    expect(stats.isAllSelected).toBe(false)
    expect(stats.isPartiallySelected).toBe(true)
    expect(stats.isNoneSelected).toBe(false)
  })

  it('should return selected row data', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(['1', '3']),
        onSelectionChange: mockOnSelectionChange
      })
    )

    expect(result.current.selectedRowData).toEqual([
      { id: 1, name: 'Alice', age: 30 },
      { id: 3, name: 'Charlie', age: 35 }
    ])
  })

  it('should handle single select mode', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(),
        onSelectionChange: mockOnSelectionChange,
        enableMultiSelect: false
      })
    )

    // Select first row
    act(() => {
      result.current.selectRow(mockData[0])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['1']))

    // Select second row (should clear first)
    act(() => {
      result.current.selectRow(mockData[1])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['2']))
  })

  it('should respect enableSelectAll setting', () => {
    const { result } = renderHook(() =>
      useSelection({
        data: mockData,
        selectedRows: new Set(),
        onSelectionChange: mockOnSelectionChange,
        enableSelectAll: false
      })
    )

    act(() => {
      result.current.selectAll()
    })

    // Should not call onSelectionChange when selectAll is disabled
    expect(mockOnSelectionChange).not.toHaveBeenCalled()
  })

  it('should use custom id field', () => {
    const customData = [
      { customId: 'a', name: 'Alice' },
      { customId: 'b', name: 'Bob' }
    ]

    const { result } = renderHook(() =>
      useSelection({
        data: customData,
        selectedRows: new Set(),
        onSelectionChange: mockOnSelectionChange,
        idField: 'customId'
      })
    )

    act(() => {
      result.current.selectRow(customData[0])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith(new Set(['a']))
  })
})