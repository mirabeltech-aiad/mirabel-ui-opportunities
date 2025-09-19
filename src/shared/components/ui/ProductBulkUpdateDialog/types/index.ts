import { Product } from '@/shared/types/product'

/**
 * Field update configuration for bulk operations
 */
export interface FieldUpdate {
  field: string
  value: any
  enabled: boolean
  operation?: string
  findText?: string
  replaceText?: string
}

/**
 * Bulk update execution results
 */
export interface BulkUpdateResults {
  successful: number
  failed: number
  errors: string[]
}

/**
 * Props for the main ProductBulkUpdateDialog component
 */
export interface ProductBulkUpdateDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedItems: Product[]
  onSuccess?: (result: BulkUpdateResults & { updatedItems: Product[] }) => void
}

/**
 * Tab identifiers for the dialog
 */
export type DialogTab = 'fields' | 'preview' | 'progress'

/**
 * Bulk update execution state
 */
export interface BulkUpdateExecutionState {
  isProcessing: boolean
  progress: number
  currentOperation: string
  results: BulkUpdateResults
  showResults: boolean
}