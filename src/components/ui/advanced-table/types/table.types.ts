import { ColumnDefinition } from "./column.types"

export interface AdvancedDataTableProps<T = any> {
  data: T[]
  columns: ColumnDefinition<T>[]
  loading?: boolean
  error?: string | null
  // Optional page size prop used by callers
  pageSize?: number
  onRowClick?: (row: T) => void
  onRowDoubleClick?: (row: T) => void
  onRowSelect?: (selectedRows: T[]) => void
  onBulkAction?: (action: string, rows: T[]) => void
  onExport?: (format: ExportFormat, data: T[]) => void
  onImport?: (data: T[]) => void
  onSort?: (sortConfig: SortConfig[]) => void
  enableSelection?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  enableExport?: boolean
  enableImport?: boolean
  enableGrouping?: boolean
  enableColumnManagement?: boolean
  enablePagination?: boolean
  initialPageSize?: number
  // Optional editing state used by some pages
  editing?: any
  savedViews?: SavedView[]
  onSaveView?: (view: SavedView) => void
  rowDensity?: RowDensity
  className?: string
  id?: string
  bulkActionContext?: 'products' | 'schedules' // Add context for bulk actions
}

export interface TableState<T = any> {
  // Data state
  data: T[]
  filteredData: T[]
  paginatedData: T[]
  
  // UI state
  loading: boolean
  error: string | null
  
  // Selection state
  selectedRows: Set<string>
  selectAll: boolean
  
  // Sorting state
  sortConfig: SortConfig[]
  
  // Filtering state
  filters: FilterConfig[]
  globalSearch: string
  
  // Pagination state
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
  
  // Column state
  columns: ColumnState[]
  columnOrder: string[]
  
  // View state
  currentView: string | null
  savedViews: SavedView[]
  
  // UI preferences
  rowDensity: RowDensity
  showGrouping: boolean
  groupBy: string | null
}

export interface SortConfig {
  columnId: string
  direction: 'asc' | 'desc'
  priority: number
}

export interface FilterConfig {
  columnId: string
  type: FilterType
  value: any
  operator?: FilterOperator
}

export interface ColumnState {
  id: string
  visible: boolean
  width: number
  order: number
  pinned?: 'left' | 'right' | null
}

export interface SavedView {
  id: string
  name: string
  description?: string
  filters: FilterConfig[]
  sorting: SortConfig[]
  columns: ColumnState[]
  groupBy?: string
  isDefault?: boolean
  createdAt: string
  updatedAt: string
}

export interface ExportConfig {
  format: ExportFormat
  includeHeaders: boolean
  includeFilters: boolean
  selectedRowsOnly: boolean
  visibleColumnsOnly: boolean
  filename?: string
}

export interface ImportConfig {
  file: File
  hasHeaders: boolean
  delimiter?: string
  mapping: Record<string, string>
  validateData: boolean
  updateExisting: boolean
}

export interface BulkActionConfig {
  id: string
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline'
  requiresConfirmation?: boolean
  confirmationMessage?: string
}

export interface TableContextValue<T = any> {
  state: TableState<T>
  dispatch: React.Dispatch<TableAction>
  config: TableConfig
}

export interface TableConfig {
  enableVirtualScrolling: boolean
  virtualScrollItemHeight: number
  virtualScrollOverscan: number
  maxRowsBeforeVirtualization: number
  debounceMs: number
  persistenceKey?: string
}

// Type unions and enums
export type RowDensity = 'compact' | 'normal' | 'comfortable'
export type ExportFormat = 'csv' | 'excel' | 'pdf'
export type FilterType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect'
export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in' | 'notIn'

// Action types for reducer
export type TableAction = 
  | { type: 'SET_DATA'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SELECTED_ROWS'; payload: Set<string> }
  | { type: 'TOGGLE_ROW_SELECTION'; payload: string }
  | { type: 'SELECT_ALL'; payload: boolean }
  | { type: 'SET_SORT_CONFIG'; payload: SortConfig[] }
  | { type: 'ADD_SORT'; payload: SortConfig }
  | { type: 'REMOVE_SORT'; payload: string }
  | { type: 'SET_FILTERS'; payload: FilterConfig[] }
  | { type: 'ADD_FILTER'; payload: FilterConfig }
  | { type: 'REMOVE_FILTER'; payload: string }
  | { type: 'SET_GLOBAL_SEARCH'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_COLUMN_STATE'; payload: ColumnState[] }
  | { type: 'UPDATE_COLUMN'; payload: { id: string; updates: Partial<ColumnState> } }
  | { type: 'REORDER_COLUMNS'; payload: string[] }
  | { type: 'SET_ROW_DENSITY'; payload: RowDensity }
  | { type: 'SET_GROUP_BY'; payload: string | null }
  | { type: 'SET_CURRENT_VIEW'; payload: string | null }
  | { type: 'ADD_SAVED_VIEW'; payload: SavedView }
  | { type: 'UPDATE_SAVED_VIEW'; payload: SavedView }
  | { type: 'DELETE_SAVED_VIEW'; payload: string }
  | { type: 'RESET_STATE' }