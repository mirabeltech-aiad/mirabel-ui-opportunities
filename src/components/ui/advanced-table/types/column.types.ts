import React from 'react'

export interface ColumnDefinition<T = any> {
  id: string
  header: string | React.ReactNode
  accessor: keyof T | ((row: T) => any)
  sortable?: boolean
  filterable?: boolean
  resizable?: boolean
  width?: number
  minWidth?: number
  maxWidth?: number
  type?: ColumnType
  filterOptions?: FilterOption[]
  render?: (value: any, row: T, column: ColumnDefinition<T>) => React.ReactNode
  editable?: boolean
  validator?: (value: any) => boolean | string
  className?: string
  headerClassName?: string
  cellClassName?: string
  align?: 'left' | 'center' | 'right'
  sticky?: 'left' | 'right'
  priority?: number // For responsive hiding
  description?: string // For tooltips
  format?: (value: any) => string // For display formatting
}

export interface FilterOption {
  label: string
  value: any
  disabled?: boolean
  group?: string
}

export interface ColumnGroup {
  id: string
  header: string | React.ReactNode
  columns: string[] // Column IDs
  className?: string
  headerClassName?: string
}

export interface ColumnResizeState {
  columnId: string
  startX: number
  startWidth: number
  isResizing: boolean
}

export interface ColumnDragState {
  draggedColumnId: string | null
  dragOverColumnId: string | null
  dragDirection: 'left' | 'right' | null
}

export interface ColumnVisibilityState {
  [columnId: string]: boolean
}

export interface ColumnOrderState {
  order: string[]
}

export interface ColumnWidthState {
  [columnId: string]: number
}

export interface ColumnPinState {
  left: string[]
  right: string[]
}

// Column type definitions
export type ColumnType = 
  | 'text' 
  | 'number' 
  | 'currency'
  | 'percentage'
  | 'date' 
  | 'datetime'
  | 'time'
  | 'boolean' 
  | 'select' 
  | 'multiselect'
  | 'email'
  | 'url'
  | 'phone'
  | 'image'
  | 'badge'
  | 'progress'
  | 'rating'
  | 'custom'

// Column configuration for different types
export interface ColumnTypeConfig {
  text: {
    placeholder?: string
    maxLength?: number
    multiline?: boolean
  }
  number: {
    min?: number
    max?: number
    step?: number
    precision?: number
    format?: 'decimal' | 'integer' | 'scientific'
  }
  currency: {
    currency?: string
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
  percentage: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    showSymbol?: boolean
  }
  date: {
    format?: string
    locale?: string
    showTime?: boolean
    timeFormat?: '12h' | '24h'
  }
  datetime: {
    dateFormat?: string
    timeFormat?: string
    locale?: string
    timezone?: string
  }
  time: {
    format?: '12h' | '24h'
    showSeconds?: boolean
  }
  boolean: {
    trueLabel?: string
    falseLabel?: string
    variant?: 'checkbox' | 'switch' | 'badge'
  }
  select: {
    options: FilterOption[]
    placeholder?: string
    searchable?: boolean
  }
  multiselect: {
    options: FilterOption[]
    placeholder?: string
    searchable?: boolean
    maxSelections?: number
  }
  email: {
    validateEmail?: boolean
    showMailtoLink?: boolean
  }
  url: {
    validateUrl?: boolean
    openInNewTab?: boolean
    showProtocol?: boolean
  }
  phone: {
    format?: string
    showCallLink?: boolean
  }
  image: {
    width?: number
    height?: number
    alt?: string
    fallback?: string
    lazy?: boolean
  }
  badge: {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error'
    colorMap?: Record<string, string>
  }
  progress: {
    min?: number
    max?: number
    showValue?: boolean
    variant?: 'default' | 'success' | 'warning' | 'error'
  }
  rating: {
    max?: number
    allowHalf?: boolean
    readonly?: boolean
    icon?: React.ReactNode
  }
  custom: {
    [key: string]: any
  }
}

// Helper type to get config for specific column type
export type GetColumnConfig<T extends ColumnType> = T extends keyof ColumnTypeConfig 
  ? ColumnTypeConfig[T] 
  : never

// Extended column definition with type-specific config
export interface TypedColumnDefinition<T = any, CT extends ColumnType = ColumnType> 
  extends ColumnDefinition<T> {
  type: CT
  config?: GetColumnConfig<CT>
}

// Column factory helpers
export interface ColumnFactory {
  text: <T>(config: Omit<TypedColumnDefinition<T, 'text'>, 'type'>) => TypedColumnDefinition<T, 'text'>
  number: <T>(config: Omit<TypedColumnDefinition<T, 'number'>, 'type'>) => TypedColumnDefinition<T, 'number'>
  currency: <T>(config: Omit<TypedColumnDefinition<T, 'currency'>, 'type'>) => TypedColumnDefinition<T, 'currency'>
  date: <T>(config: Omit<TypedColumnDefinition<T, 'date'>, 'type'>) => TypedColumnDefinition<T, 'date'>
  boolean: <T>(config: Omit<TypedColumnDefinition<T, 'boolean'>, 'type'>) => TypedColumnDefinition<T, 'boolean'>
  select: <T>(config: Omit<TypedColumnDefinition<T, 'select'>, 'type'>) => TypedColumnDefinition<T, 'select'>
  badge: <T>(config: Omit<TypedColumnDefinition<T, 'badge'>, 'type'>) => TypedColumnDefinition<T, 'badge'>
  custom: <T>(config: Omit<TypedColumnDefinition<T, 'custom'>, 'type'>) => TypedColumnDefinition<T, 'custom'>
}