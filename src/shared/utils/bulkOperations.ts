/**
 * Bulk operations utilities for column selector
 * Handles multi-select, bulk actions, and operation history
 */

export interface BulkSelection {
  available: Set<string>
  selected: Set<string>
}

export interface BulkOperation {
  id: string
  type: 'add' | 'remove' | 'reorder' | 'clear' | 'selectAll'
  columnKeys: string[]
  fromState: string[]
  toState: string[]
  timestamp: Date
  metadata?: {
    category?: string
    filter?: string
    reason?: string
  }
}

export interface BulkOperationResult {
  success: boolean
  operation: BulkOperation
  affectedColumns: string[]
  skippedColumns: string[]
  errors: string[]
}

export interface BulkOperationConstraints {
  maxSelections?: number
  allowLockedColumns?: boolean
  allowRequiredColumns?: boolean
  respectFilters?: boolean
}

/**
 * Bulk selection manager
 */
export class BulkSelectionManager {
  private selection: BulkSelection
  private operationHistory: BulkOperation[]
  private maxHistorySize: number

  constructor(maxHistorySize = 50) {
    this.selection = {
      available: new Set(),
      selected: new Set()
    }
    this.operationHistory = []
    this.maxHistorySize = maxHistorySize
  }

  /**
   * Get current selection
   */
  getSelection(): BulkSelection {
    return {
      available: new Set(this.selection.available),
      selected: new Set(this.selection.selected)
    }
  }

  /**
   * Set selection for a pane
   */
  setSelection(pane: 'available' | 'selected', columnKeys: string[]): void {
    this.selection[pane] = new Set(columnKeys)
  }

  /**
   * Toggle column selection
   */
  toggleSelection(pane: 'available' | 'selected', columnKey: string): void {
    if (this.selection[pane].has(columnKey)) {
      this.selection[pane].delete(columnKey)
    } else {
      this.selection[pane].add(columnKey)
    }
  }

  /**
   * Add to selection
   */
  addToSelection(pane: 'available' | 'selected', columnKeys: string[]): void {
    columnKeys.forEach(key => this.selection[pane].add(key))
  }

  /**
   * Remove from selection
   */
  removeFromSelection(pane: 'available' | 'selected', columnKeys: string[]): void {
    columnKeys.forEach(key => this.selection[pane].delete(key))
  }

  /**
   * Clear selection
   */
  clearSelection(pane?: 'available' | 'selected'): void {
    if (pane) {
      this.selection[pane].clear()
    } else {
      this.selection.available.clear()
      this.selection.selected.clear()
    }
  }

  /**
   * Select all in pane
   */
  selectAll(pane: 'available' | 'selected', columnKeys: string[]): void {
    this.selection[pane] = new Set(columnKeys)
  }

  /**
   * Get selected count
   */
  getSelectedCount(pane?: 'available' | 'selected'): number {
    if (pane) {
      return this.selection[pane].size
    }
    return this.selection.available.size + this.selection.selected.size
  }

  /**
   * Check if column is selected
   */
  isSelected(pane: 'available' | 'selected', columnKey: string): boolean {
    return this.selection[pane].has(columnKey)
  }

  /**
   * Add operation to history
   */
  addToHistory(operation: BulkOperation): void {
    this.operationHistory.unshift(operation)
    
    // Limit history size
    if (this.operationHistory.length > this.maxHistorySize) {
      this.operationHistory = this.operationHistory.slice(0, this.maxHistorySize)
    }
  }

  /**
   * Get operation history
   */
  getHistory(): BulkOperation[] {
    return [...this.operationHistory]
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.operationHistory = []
  }
}

/**
 * Validate bulk operation
 */
export function validateBulkOperation(
  operation: 'add' | 'remove' | 'reorder',
  columnKeys: string[],
  columns: any[],
  constraints: BulkOperationConstraints = {}
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Check max selections
  if (constraints.maxSelections && columnKeys.length > constraints.maxSelections) {
    errors.push(`Cannot select more than ${constraints.maxSelections} columns at once`)
  }

  // Check locked columns
  if (!constraints.allowLockedColumns) {
    const lockedColumns = columnKeys.filter(key => {
      const column = columns.find(col => col.key === key)
      return column?.locked
    })
    
    if (lockedColumns.length > 0) {
      if (operation === 'remove') {
        errors.push(`Cannot remove locked columns: ${lockedColumns.join(', ')}`)
      } else if (operation === 'reorder') {
        warnings.push(`Locked columns have limited movement: ${lockedColumns.join(', ')}`)
      }
    }
  }

  // Check required columns
  if (!constraints.allowRequiredColumns && operation === 'remove') {
    const requiredColumns = columnKeys.filter(key => {
      const column = columns.find(col => col.key === key)
      return column?.required
    })
    
    if (requiredColumns.length > 0) {
      errors.push(`Cannot remove required columns: ${requiredColumns.join(', ')}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Execute bulk add operation
 */
export function executeBulkAdd(
  columnKeys: string[],
  currentVisible: string[],
  columns: any[],
  constraints: BulkOperationConstraints = {}
): BulkOperationResult {
  const validation = validateBulkOperation('add', columnKeys, columns, constraints)
  const affectedColumns: string[] = []
  const skippedColumns: string[] = []
  const errors: string[] = [...validation.errors]

  if (!validation.valid) {
    return {
      success: false,
      operation: createOperation('add', columnKeys, currentVisible, currentVisible),
      affectedColumns,
      skippedColumns: columnKeys,
      errors
    }
  }

  // Filter out columns that are already visible
  const columnsToAdd = columnKeys.filter(key => {
    if (currentVisible.includes(key)) {
      skippedColumns.push(key)
      return false
    }
    return true
  })

  const newVisible = [...currentVisible, ...columnsToAdd]
  affectedColumns.push(...columnsToAdd)

  return {
    success: true,
    operation: createOperation('add', columnKeys, currentVisible, newVisible),
    affectedColumns,
    skippedColumns,
    errors: validation.warnings
  }
}

/**
 * Execute bulk remove operation
 */
export function executeBulkRemove(
  columnKeys: string[],
  currentVisible: string[],
  columns: any[],
  constraints: BulkOperationConstraints = {}
): BulkOperationResult {
  const validation = validateBulkOperation('remove', columnKeys, columns, constraints)
  const affectedColumns: string[] = []
  const skippedColumns: string[] = []
  const errors: string[] = [...validation.errors]

  // Filter out locked and required columns
  const columnsToRemove = columnKeys.filter(key => {
    const column = columns.find(col => col.key === key)
    
    if (column?.locked && !constraints.allowLockedColumns) {
      skippedColumns.push(key)
      errors.push(`Skipped locked column: ${column.title}`)
      return false
    }
    
    if (column?.required && !constraints.allowRequiredColumns) {
      skippedColumns.push(key)
      errors.push(`Skipped required column: ${column.title}`)
      return false
    }
    
    if (!currentVisible.includes(key)) {
      skippedColumns.push(key)
      return false
    }
    
    return true
  })

  const newVisible = currentVisible.filter(key => !columnsToRemove.includes(key))
  affectedColumns.push(...columnsToRemove)

  return {
    success: columnsToRemove.length > 0,
    operation: createOperation('remove', columnKeys, currentVisible, newVisible),
    affectedColumns,
    skippedColumns,
    errors
  }
}

/**
 * Execute select all operation
 */
export function executeSelectAll(
  availableColumns: string[],
  currentVisible: string[],
  columns: any[],
  constraints: BulkOperationConstraints = {}
): BulkOperationResult {
  const columnsToAdd = availableColumns.filter(key => {
    const column = columns.find(col => col.key === key)
    return !column?.locked || constraints.allowLockedColumns
  })

  return executeBulkAdd(columnsToAdd, currentVisible, columns, constraints)
}

/**
 * Execute clear all operation
 */
export function executeClearAll(
  currentVisible: string[],
  columns: any[],
  constraints: BulkOperationConstraints = {}
): BulkOperationResult {
  const columnsToRemove = currentVisible.filter(key => {
    const column = columns.find(col => col.key === key)
    return (!column?.locked && !column?.required) || 
           (constraints.allowLockedColumns && constraints.allowRequiredColumns)
  })

  return executeBulkRemove(columnsToRemove, currentVisible, columns, constraints)
}

/**
 * Execute category-based selection
 */
export function executeCategorySelect(
  category: string,
  availableColumns: string[],
  currentVisible: string[],
  columns: any[],
  constraints: BulkOperationConstraints = {}
): BulkOperationResult {
  const categoryColumns = availableColumns.filter(key => {
    const column = columns.find(col => col.key === key)
    return column?.category === category
  })

  return executeBulkAdd(categoryColumns, currentVisible, columns, {
    ...constraints,
    // metadata: { category } // Remove this property as it's not in the interface
  })
}

/**
 * Create operation record
 */
function createOperation(
  type: BulkOperation['type'],
  columnKeys: string[],
  fromState: string[],
  toState: string[],
  metadata?: BulkOperation['metadata']
): BulkOperation {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    columnKeys,
    fromState: [...fromState],
    toState: [...toState],
    timestamp: new Date(),
    metadata
  }
}

/**
 * Get operation summary
 */
export function getOperationSummary(operation: BulkOperation): string {
  const count = operation.columnKeys.length
  const columnText = count === 1 ? 'column' : 'columns'
  
  switch (operation.type) {
    case 'add':
      return `Added ${count} ${columnText}`
    case 'remove':
      return `Removed ${count} ${columnText}`
    case 'selectAll':
      return 'Selected all available columns'
    case 'clear':
      return 'Cleared all selections'
    case 'reorder':
      return `Reordered ${count} ${columnText}`
    default:
      return `Bulk operation: ${operation.type}`
  }
}

/**
 * Format operation for display
 */
export function formatOperationForDisplay(operation: BulkOperation): {
  title: string
  description: string
  timestamp: string
} {
  return {
    title: getOperationSummary(operation),
    description: operation.columnKeys.length <= 3 
      ? operation.columnKeys.join(', ')
      : `${operation.columnKeys.slice(0, 3).join(', ')} and ${operation.columnKeys.length - 3} more`,
    timestamp: operation.timestamp.toLocaleTimeString()
  }
}