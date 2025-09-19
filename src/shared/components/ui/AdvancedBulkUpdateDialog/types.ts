export interface ScheduleBulkUpdateDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedItems: any[]
  onBulkUpdate?: (updates: any) => Promise<void>
  onSuccess?: (result?: any) => void
  title?: string
  description?: string
}

export interface FieldUpdate {
  field: string
  operation: 'set' | 'add' | 'subtract' | 'remove' | 'replace' | 'clear' | 'uppercase' | 'lowercase' | 'title-case' | 'trim' | 'round' | 'find-replace' | 'cascade' | 'copy-from' | 'shift' | 'percentage' | 'multiply' | 'divide' | 'prepend' | 'append'
  value: string | number | boolean | Date | null
  enabled: boolean
  unit?: string
  findText?: string
  replaceText?: string
  relatedField?: string
  offset?: number
  percentage?: number
  condition?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'between'
}

export interface FieldDefinition {
  key: string
  label: string
  type: 'text' | 'boolean' | 'select' | 'advanced-text' | 'advanced-date' | 'advanced-number'
  operations?: Array<{ value: string; label: string }>
  options?: Array<{ value: string; label: string }> | string[]
  units?: string[]
  relatedFields?: string[]
  defaultRelation?: { offset: number }
}

export interface AdvancedBulkUpdateState {
  activeTab: 'fields' | 'preview' | 'templates' | 'advanced'
  fieldUpdates: FieldUpdate[]
  preview: any[]
  isLoading?: boolean
  error?: string | null
  showPreview?: boolean
  templateName?: string
  templateDescription?: string
  showLargeDatasetWarning?: boolean
}