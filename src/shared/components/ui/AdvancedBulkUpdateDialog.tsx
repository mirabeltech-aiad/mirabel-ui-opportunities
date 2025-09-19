/**
 * Advanced Bulk Update Dialog - Legacy file maintained for backward compatibility
 * The actual implementation has been refactored into a modular structure.
 * 
 * Original file: 1,430 lines (26x over component limit)
 * Refactored to: Modular structure with focused components and hooks
 * 
 * @deprecated Use the modular version at ./AdvancedBulkUpdateDialog/index.tsx
 */

// Re-export the refactored component
export { 
  ScheduleBulkUpdateDialog, 
  AdvancedBulkUpdateDialog 
} from './AdvancedBulkUpdateDialog/index'

// Re-export types for backward compatibility
export type { 
  ScheduleBulkUpdateDialogProps,
  FieldUpdate,
  FieldDefinition,
  AdvancedBulkUpdateState
} from './AdvancedBulkUpdateDialog/types'