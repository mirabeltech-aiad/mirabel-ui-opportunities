
// Table-related type definitions
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface ColumnConfig {
  key: string;
  label: string;
  width: number;
  sortable: boolean;
  resizable: boolean;
  visible: boolean;
}

export interface TableSelectionState {
  selectedRows: Set<number>;
  selectAll: boolean;
}

export interface InfiniteScrollState {
  displayedItems: any[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
}

export interface TableProps<T = any> {
  data: T[];
  columns: ColumnConfig[];
  onRowSelect?: (id: number) => void;
  onSort?: (config: SortConfig) => void;
  className?: string;
}
