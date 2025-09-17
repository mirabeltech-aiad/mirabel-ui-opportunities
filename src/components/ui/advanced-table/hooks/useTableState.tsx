import { useReducer, useEffect, useMemo, useCallback } from 'react'
import { 
  TableState, 
  TableAction, 
  ColumnDefinition, 
  SortConfig, 
  FilterConfig,
  ColumnState,
  RowDensity 
} from '../types'
import { 
  sortData, 
  filterData, 
  paginateData, 
  getRowId 
} from '../utils/tableHelpers'

// Initial state factory
function createInitialState<T>(
  data: T[], 
  columns: ColumnDefinition<T>[],
  initialPageSize: number = 25
): TableState<T> {
  const initialColumns: ColumnState[] = columns.map((col, index) => ({
    id: col.id,
    visible: true,
    width: col.width || 150,
    order: index,
    pinned: col.sticky || null
  }))

  return {
    // Data state
    data,
    filteredData: data,
    paginatedData: data.slice(0, initialPageSize),
    
    // UI state
    loading: false,
    error: null,
    
    // Selection state
    selectedRows: new Set<string>(),
    selectAll: false,
    
    // Sorting state
    sortConfig: [],
    
    // Filtering state
    filters: [],
    globalSearch: '',
    
    // Pagination state
    currentPage: 1,
    pageSize: initialPageSize,
    totalPages: Math.ceil(data.length / initialPageSize),
    totalItems: data.length,
    
    // Column state
    columns: initialColumns,
    columnOrder: columns.map(col => col.id),
    
    // View state
    currentView: null,
    savedViews: [],
    
    // UI preferences
    rowDensity: 'normal',
    showGrouping: false,
    groupBy: null
  }
}

// State reducer
function tableReducer<T>(state: TableState<T>, action: TableAction): TableState<T> {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        selectedRows: new Set(), // Clear selections when data changes
        currentPage: 1 // Reset to first page
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }

    case 'SET_SELECTED_ROWS':
      return {
        ...state,
        selectedRows: action.payload,
        selectAll: action.payload.size === state.filteredData.length && state.filteredData.length > 0
      }

    case 'TOGGLE_ROW_SELECTION': {
      const newSelectedRows = new Set(state.selectedRows)
      if (newSelectedRows.has(action.payload)) {
        newSelectedRows.delete(action.payload)
      } else {
        newSelectedRows.add(action.payload)
      }
      return {
        ...state,
        selectedRows: newSelectedRows,
        selectAll: newSelectedRows.size === state.filteredData.length && state.filteredData.length > 0
      }
    }

    case 'SELECT_ALL': {
      if (action.payload) {
        // Select all filtered rows
        const allRowIds = new Set(state.filteredData.map((row, index) => getRowId(row, 'id' as keyof T)))
        return {
          ...state,
          selectedRows: allRowIds,
          selectAll: true
        }
      } else {
        // Deselect all
        return {
          ...state,
          selectedRows: new Set(),
          selectAll: false
        }
      }
    }

    case 'SET_SORT_CONFIG':
      return {
        ...state,
        sortConfig: action.payload,
        currentPage: 1 // Reset to first page when sorting changes
      }

    case 'ADD_SORT': {
      const existingIndex = state.sortConfig.findIndex(s => s.columnId === action.payload.columnId)
      let newSortConfig: SortConfig[]

      if (existingIndex >= 0) {
        // Update existing sort
        const existing = state.sortConfig[existingIndex]
        if (existing.direction === 'asc') {
          // Change to desc
          newSortConfig = state.sortConfig.map(s => 
            s.columnId === action.payload.columnId 
              ? { ...s, direction: 'desc' as const }
              : s
          )
        } else {
          // Remove sort
          newSortConfig = state.sortConfig.filter(s => s.columnId !== action.payload.columnId)
        }
      } else {
        // Add new sort
        newSortConfig = [...state.sortConfig, action.payload]
      }

      return {
        ...state,
        sortConfig: newSortConfig,
        currentPage: 1
      }
    }

    case 'REMOVE_SORT':
      return {
        ...state,
        sortConfig: state.sortConfig.filter(s => s.columnId !== action.payload),
        currentPage: 1
      }

    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
        currentPage: 1,
        selectedRows: new Set() // Clear selections when filters change
      }

    case 'ADD_FILTER': {
      const existingIndex = state.filters.findIndex(f => f.columnId === action.payload.columnId)
      let newFilters: FilterConfig[]

      if (existingIndex >= 0) {
        // Update existing filter
        newFilters = state.filters.map(f => 
          f.columnId === action.payload.columnId ? action.payload : f
        )
      } else {
        // Add new filter
        newFilters = [...state.filters, action.payload]
      }

      return {
        ...state,
        filters: newFilters,
        currentPage: 1,
        selectedRows: new Set()
      }
    }

    case 'REMOVE_FILTER':
      return {
        ...state,
        filters: state.filters.filter(f => f.columnId !== action.payload),
        currentPage: 1,
        selectedRows: new Set()
      }

    case 'SET_GLOBAL_SEARCH':
      return {
        ...state,
        globalSearch: action.payload,
        currentPage: 1,
        selectedRows: new Set()
      }

    case 'SET_PAGE':
      return {
        ...state,
        currentPage: Math.max(1, Math.min(action.payload, state.totalPages))
      }

    case 'SET_PAGE_SIZE': {
      const newPageSize = action.payload
      const newTotalPages = Math.ceil(state.totalItems / newPageSize)
      const newCurrentPage = Math.min(state.currentPage, newTotalPages)

      return {
        ...state,
        pageSize: newPageSize,
        totalPages: newTotalPages,
        currentPage: newCurrentPage
      }
    }

    case 'SET_COLUMN_STATE':
      return {
        ...state,
        columns: action.payload
      }

    case 'UPDATE_COLUMN': {
      const { id, updates } = action.payload
      return {
        ...state,
        columns: state.columns.map(col => 
          col.id === id ? { ...col, ...updates } : col
        )
      }
    }

    case 'REORDER_COLUMNS':
      return {
        ...state,
        columnOrder: action.payload
      }

    case 'SET_ROW_DENSITY':
      return {
        ...state,
        rowDensity: action.payload
      }

    case 'SET_GROUP_BY':
      return {
        ...state,
        groupBy: action.payload,
        showGrouping: action.payload !== null,
        currentPage: 1
      }

    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        currentView: action.payload
      }

    case 'ADD_SAVED_VIEW':
      return {
        ...state,
        savedViews: [...state.savedViews, action.payload]
      }

    case 'UPDATE_SAVED_VIEW': {
      const updatedView = action.payload
      return {
        ...state,
        savedViews: state.savedViews.map(view => 
          view.id === updatedView.id ? updatedView : view
        )
      }
    }

    case 'DELETE_SAVED_VIEW':
      return {
        ...state,
        savedViews: state.savedViews.filter(view => view.id !== action.payload),
        currentView: state.currentView === action.payload ? null : state.currentView
      }

    case 'RESET_STATE':
      return createInitialState(state.data, [], state.pageSize)

    default:
      return state
  }
}

// Main hook
export function useTableState<T>(
  initialData: T[],
  columns: ColumnDefinition<T>[],
  options: {
    initialPageSize?: number
    persistenceKey?: string
    enablePersistence?: boolean
  } = {}
) {
  const { 
    initialPageSize = 25, 
    persistenceKey,
    enablePersistence = false 
  } = options

  // Initialize state
  const [state, dispatch] = useReducer(
    tableReducer<T>,
    createInitialState(initialData, columns, initialPageSize)
  )

  // Update data when initialData changes
  useEffect(() => {
    dispatch({ type: 'SET_DATA', payload: initialData })
  }, [initialData])

  // Compute derived data
  const derivedData = useMemo(() => {
    // Apply sorting
    const sortedData = sortData(state.data, state.sortConfig, columns)
    
    // Apply filtering
    const filteredData = filterData(sortedData, state.filters, columns, state.globalSearch)
    
    // Apply pagination
    const paginationResult = paginateData(filteredData, state.currentPage, state.pageSize)
    
    return {
      sortedData,
      filteredData,
      paginatedData: paginationResult.data,
      totalPages: paginationResult.totalPages,
      totalItems: paginationResult.totalItems
    }
  }, [
    state.data,
    state.sortConfig,
    state.filters,
    state.globalSearch,
    state.currentPage,
    state.pageSize,
    columns
  ])

  // Update derived state when computed data changes
  useEffect(() => {
    if (
      state.filteredData !== derivedData.filteredData ||
      state.paginatedData !== derivedData.paginatedData ||
      state.totalPages !== derivedData.totalPages ||
      state.totalItems !== derivedData.totalItems
    ) {
      // Update state with derived data
      const newState = {
        ...state,
        filteredData: derivedData.filteredData,
        paginatedData: derivedData.paginatedData,
        totalPages: derivedData.totalPages,
        totalItems: derivedData.totalItems
      }
      
      // Note: We don't dispatch here to avoid infinite loops
      // Instead, we return the computed values from the hook
    }
  }, [derivedData, state])

  // Action creators
  const actions = useMemo(() => ({
    setData: (data: T[]) => dispatch({ type: 'SET_DATA', payload: data }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    
    // Selection actions
    setSelectedRows: (rows: Set<string>) => dispatch({ type: 'SET_SELECTED_ROWS', payload: rows }),
    toggleRowSelection: (rowId: string) => dispatch({ type: 'TOGGLE_ROW_SELECTION', payload: rowId }),
    selectAll: (select: boolean) => dispatch({ type: 'SELECT_ALL', payload: select }),
    
    // Sorting actions
    setSortConfig: (config: SortConfig[]) => dispatch({ type: 'SET_SORT_CONFIG', payload: config }),
    addSort: (config: SortConfig) => dispatch({ type: 'ADD_SORT', payload: config }),
    removeSort: (columnId: string) => dispatch({ type: 'REMOVE_SORT', payload: columnId }),
    
    // Filtering actions
    setFilters: (filters: FilterConfig[]) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    addFilter: (filter: FilterConfig) => dispatch({ type: 'ADD_FILTER', payload: filter }),
    removeFilter: (columnId: string) => dispatch({ type: 'REMOVE_FILTER', payload: columnId }),
    setGlobalSearch: (search: string) => dispatch({ type: 'SET_GLOBAL_SEARCH', payload: search }),
    
    // Pagination actions
    setPage: (page: number) => dispatch({ type: 'SET_PAGE', payload: page }),
    setPageSize: (size: number) => dispatch({ type: 'SET_PAGE_SIZE', payload: size }),
    
    // Column actions
    setColumnState: (columns: ColumnState[]) => dispatch({ type: 'SET_COLUMN_STATE', payload: columns }),
    updateColumn: (id: string, updates: Partial<ColumnState>) => 
      dispatch({ type: 'UPDATE_COLUMN', payload: { id, updates } }),
    reorderColumns: (order: string[]) => dispatch({ type: 'REORDER_COLUMNS', payload: order }),
    
    // UI actions
    setRowDensity: (density: RowDensity) => dispatch({ type: 'SET_ROW_DENSITY', payload: density }),
    setGroupBy: (columnId: string | null) => dispatch({ type: 'SET_GROUP_BY', payload: columnId }),
    
    // View actions
    setCurrentView: (viewId: string | null) => dispatch({ type: 'SET_CURRENT_VIEW', payload: viewId }),
    
    // Reset
    resetState: () => dispatch({ type: 'RESET_STATE' })
  }), [])

  // Computed selectors
  const selectors = useMemo(() => ({
    getSelectedRowData: () => {
      return derivedData.filteredData.filter((row, index) => 
        state.selectedRows.has(getRowId(row, 'id' as keyof T))
      )
    },
    
    getVisibleColumns: () => {
      return state.columns
        .filter(col => col.visible)
        .sort((a, b) => a.order - b.order)
        .map(colState => columns.find(col => col.id === colState.id))
        .filter(Boolean) as ColumnDefinition<T>[]
    },
    
    getColumnById: (id: string) => {
      return columns.find(col => col.id === id)
    },
    
    getColumnState: (id: string) => {
      return state.columns.find(col => col.id === id)
    },
    
    hasActiveFilters: () => {
      return state.filters.length > 0 || state.globalSearch.trim().length > 0
    },
    
    hasActiveSorting: () => {
      return state.sortConfig.length > 0
    },
    
    getSelectionCount: () => {
      return state.selectedRows.size
    },
    
    isAllSelected: () => {
      return state.selectAll && derivedData.filteredData.length > 0
    },
    
    isPartiallySelected: () => {
      return state.selectedRows.size > 0 && !state.selectAll
    }
  }), [state, derivedData, columns])

  // Return enhanced state with computed values and actions
  return {
    // State (with computed derived data)
    state: {
      ...state,
      filteredData: derivedData.filteredData,
      paginatedData: derivedData.paginatedData,
      totalPages: derivedData.totalPages,
      totalItems: derivedData.totalItems
    },
    
    // Actions
    actions,
    
    // Selectors
    selectors,
    
    // Raw dispatch for advanced usage
    dispatch
  }
}