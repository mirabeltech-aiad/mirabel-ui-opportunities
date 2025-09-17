import { renderHook, act } from '@testing-library/react'
import { useSorting } from '../hooks/useSorting'
import { ColumnDefinition, SortConfig } from '../types'

// Mock data for testing
const mockData = [
  { id: 1, name: 'Alice', age: 30, salary: 50000, active: true, joinDate: '2020-01-15' },
  { id: 2, name: 'Bob', age: 25, salary: 45000, active: false, joinDate: '2021-03-20' },
  { id: 3, name: 'Charlie', age: 35, salary: 60000, active: true, joinDate: '2019-07-10' },
  { id: 4, name: 'Diana', age: 28, salary: 55000, active: true, joinDate: '2020-11-05' }
]

const mockColumns: ColumnDefinition<typeof mockData[0]>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true, type: 'text' },
  { id: 'age', header: 'Age', accessor: 'age', sortable: true, type: 'number' },
  { id: 'salary', header: 'Salary', accessor: 'salary', sortable: true, type: 'currency' },
  { id: 'active', header: 'Active', accessor: 'active', sortable: true, type: 'boolean' },
  { id: 'joinDate', header: 'Join Date', accessor: 'joinDate', sortable: true, type: 'date' },
  { id: 'actions', header: 'Actions', accessor: () => '', sortable: false }
]

describe('useSorting', () => {
  let mockOnSortChange: jest.Mock

  beforeEach(() => {
    mockOnSortChange = jest.fn()
  })

  it('should initialize with empty sort config', () => {
    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig: [],
        onSortChange: mockOnSortChange
      })
    )

    expect(result.current.sortedData).toEqual(mockData)
    expect(result.current.hasMultipleSorts).toBe(false)
    expect(result.current.getSortDirection('name')).toBeNull()
    expect(result.current.isSorted('name')).toBe(false)
  })

  it('should sort data in ascending order', () => {
    const sortConfig: SortConfig[] = [
      { columnId: 'name', direction: 'asc', priority: 0 }
    ]

    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig,
        onSortChange: mockOnSortChange
      })
    )

    const sortedNames = result.current.sortedData.map(item => item.name)
    expect(sortedNames).toEqual(['Alice', 'Bob', 'Charlie', 'Diana'])
    expect(result.current.getSortDirection('name')).toBe('asc')
    expect(result.current.isSorted('name')).toBe(true)
  })

  it('should sort data in descending order', () => {
    const sortConfig: SortConfig[] = [
      { columnId: 'age', direction: 'desc', priority: 0 }
    ]

    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig,
        onSortChange: mockOnSortChange
      })
    )

    const sortedAges = result.current.sortedData.map(item => item.age)
    expect(sortedAges).toEqual([35, 30, 28, 25])
    expect(result.current.getSortDirection('age')).toBe('desc')
  })

  it('should handle multi-column sorting', () => {
    const sortConfig: SortConfig[] = [
      { columnId: 'active', direction: 'desc', priority: 0 },
      { columnId: 'age', direction: 'asc', priority: 1 }
    ]

    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig,
        onSortChange: mockOnSortChange
      })
    )

    expect(result.current.hasMultipleSorts).toBe(true)
    
    // Should sort by active (true first), then by age (ascending)
    const sortedData = result.current.sortedData
    const activeTrue = sortedData.filter(item => item.active)
    const activeFalse = sortedData.filter(item => !item.active)
    
    expect(activeTrue.map(item => item.age)).toEqual([28, 30, 35])
    expect(activeFalse.map(item => item.age)).toEqual([25])
  })

  it('should add sort correctly', () => {
    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig: [],
        onSortChange: mockOnSortChange
      })
    )

    act(() => {
      result.current.addSort('name', 'asc')
    })

    expect(mockOnSortChange).toHaveBeenCalledWith([
      { columnId: 'name', direction: 'asc', priority: 0 }
    ])
  })

  it('should toggle sort correctly', () => {
    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig: [],
        onSortChange: mockOnSortChange
      })
    )

    // First toggle: add ascending sort
    act(() => {
      result.current.toggleSort('name')
    })

    expect(mockOnSortChange).toHaveBeenCalledWith([
      { columnId: 'name', direction: 'asc', priority: 0 }
    ])

    // Update hook with new sort config
    const { result: result2 } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig: [{ columnId: 'name', direction: 'asc', priority: 0 }],
        onSortChange: mockOnSortChange
      })
    )

    // Second toggle: change to descending
    act(() => {
      result2.current.toggleSort('name')
    })

    expect(mockOnSortChange).toHaveBeenCalledWith([
      { columnId: 'name', direction: 'desc', priority: 0 }
    ])
  })

  it('should remove sort correctly', () => {
    const sortConfig: SortConfig[] = [
      { columnId: 'name', direction: 'asc', priority: 0 },
      { columnId: 'age', direction: 'desc', priority: 1 }
    ]

    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig,
        onSortChange: mockOnSortChange
      })
    )

    act(() => {
      result.current.removeSort('name')
    })

    expect(mockOnSortChange).toHaveBeenCalledWith([
      { columnId: 'age', direction: 'desc', priority: 0 }
    ])
  })

  it('should clear all sorts', () => {
    const sortConfig: SortConfig[] = [
      { columnId: 'name', direction: 'asc', priority: 0 },
      { columnId: 'age', direction: 'desc', priority: 1 }
    ]

    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig,
        onSortChange: mockOnSortChange
      })
    )

    act(() => {
      result.current.clearSort()
    })

    expect(mockOnSortChange).toHaveBeenCalledWith([])
  })

  it('should respect sortable property', () => {
    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig: [],
        onSortChange: mockOnSortChange
      })
    )

    expect(result.current.canSort('name')).toBe(true)
    expect(result.current.canSort('actions')).toBe(false)

    // Should not add sort for non-sortable column
    act(() => {
      result.current.addSort('actions', 'asc')
    })

    expect(mockOnSortChange).not.toHaveBeenCalled()
  })

  it('should handle date sorting correctly', () => {
    const sortConfig: SortConfig[] = [
      { columnId: 'joinDate', direction: 'asc', priority: 0 }
    ]

    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig,
        onSortChange: mockOnSortChange
      })
    )

    const sortedDates = result.current.sortedData.map(item => item.joinDate)
    expect(sortedDates).toEqual(['2019-07-10', '2020-01-15', '2020-11-05', '2021-03-20'])
  })

  it('should get sort priority correctly', () => {
    const sortConfig: SortConfig[] = [
      { columnId: 'name', direction: 'asc', priority: 0 },
      { columnId: 'age', direction: 'desc', priority: 1 }
    ]

    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig,
        onSortChange: mockOnSortChange
      })
    )

    expect(result.current.getSortPriority('name')).toBe(0)
    expect(result.current.getSortPriority('age')).toBe(1)
    expect(result.current.getSortPriority('salary')).toBeNull()
  })

  it('should set sort config correctly', () => {
    const { result } = renderHook(() =>
      useSorting({
        data: mockData,
        columns: mockColumns,
        sortConfig: [],
        onSortChange: mockOnSortChange
      })
    )

    const newSortConfig: SortConfig[] = [
      { columnId: 'name', direction: 'asc', priority: 1 },
      { columnId: 'age', direction: 'desc', priority: 0 }
    ]

    act(() => {
      result.current.setSortConfig(newSortConfig)
    })

    // Should normalize priorities
    expect(mockOnSortChange).toHaveBeenCalledWith([
      { columnId: 'name', direction: 'asc', priority: 0 },
      { columnId: 'age', direction: 'desc', priority: 1 }
    ])
  })
})