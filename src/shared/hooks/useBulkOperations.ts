import { logger } from '../utils/logger'

import { useState, useCallback, useRef } from 'react'
import { Product, BulkOperationResult } from '@/shared/types/product'

export interface BulkOperationTemplate {
  id: string
  name: string
  description?: string
  operation: string
  fields: Record<string, any>
  createdAt: Date
  usageCount: number
}

export interface BulkOperationHistory {
  id: string
  operation: string
  itemCount: number
  successCount: number
  failureCount: number
  timestamp: Date
  canUndo: boolean
  undoData?: any
  template?: BulkOperationTemplate
}

export interface BulkFieldUpdate {
  field: string
  value: any
  condition?: (item: Product) => boolean
}

export interface BulkOperationProgress {
  isProcessing: boolean
  currentItem: number
  totalItems: number
  currentItemName?: string
  phase: 'preparing' | 'processing' | 'completing' | 'completed' | 'failed'
  message: string
  canCancel: boolean
  chunkInfo?: {
    currentChunk: number
    totalChunks: number
    chunkSize: number
  }
}

export interface BulkOperationError {
  itemId: string
  itemName: string
  field?: string
  error: string
  code: string
  canRetry: boolean
}

export interface BulkPreview {
  item: Product
  changes: Record<string, { from: any; to: any }>
  warnings: string[]
  conflicts: string[]
}

interface UseBulkOperationsReturn {
  // State
  progress: BulkOperationProgress
  errors: BulkOperationError[]
  history: BulkOperationHistory[]
  templates: BulkOperationTemplate[]
  
  // Operations
  bulkUpdateFields: (items: Product[], updates: BulkFieldUpdate[], options?: BulkOperationOptions) => Promise<BulkOperationResult>
  bulkUpdateStatus: (items: Product[], isActive: boolean, options?: BulkOperationOptions) => Promise<BulkOperationResult>
  retryFailedItems: (operationId: string) => Promise<BulkOperationResult>
  undoOperation: (operationId: string) => Promise<BulkOperationResult>
  
  // Preview
  generatePreview: (items: Product[], updates: BulkFieldUpdate[]) => Promise<BulkPreview[]>
  
  // Templates
  saveTemplate: (name: string, operation: string, fields: Record<string, any>, description?: string) => BulkOperationTemplate
  deleteTemplate: (templateId: string) => void
  applyTemplate: (templateId: string, items: Product[]) => Promise<BulkOperationResult>
  
  // Utilities
  cancelOperation: () => void
  clearErrors: () => void
  clearHistory: () => void
}

export interface BulkOperationOptions {
  chunkSize?: number
  validateBeforeUpdate?: boolean
  createUndoData?: boolean
  templateId?: string
  skipConflictCheck?: boolean
}

export const useBulkOperations = (): UseBulkOperationsReturn => {
  const [progress, setProgress] = useState<BulkOperationProgress>({
    isProcessing: false,
    currentItem: 0,
    totalItems: 0,
    phase: 'preparing',
    message: '',
    canCancel: false
  })
  
  const [errors, setErrors] = useState<BulkOperationError[]>([])
  const [history, setHistory] = useState<BulkOperationHistory[]>([])
  const [templates, setTemplates] = useState<BulkOperationTemplate[]>([])
  
  const abortController = useRef<AbortController | null>(null)
  const operationCache = useRef<Map<string, any>>(new Map())

  // Load templates from localStorage on mount
  const loadTemplates = useCallback(() => {
    try {
      const saved = localStorage.getItem('bulk-operation-templates')
      if (saved) {
        setTemplates(JSON.parse(saved))
      }
    } catch (error) {
      logger.warn('Failed to load bulk operation templates:', error)
    }
  }, [])

  // Save templates to localStorage
  const saveTemplatesToStorage = useCallback((newTemplates: BulkOperationTemplate[]) => {
    try {
      localStorage.setItem('bulk-operation-templates', JSON.stringify(newTemplates))
    } catch (error) {
      logger.warn('Failed to save bulk operation templates:', error)
    }
  }, [])

  // Generate preview of changes
  const generatePreview = useCallback(async (items: Product[], updates: BulkFieldUpdate[]): Promise<BulkPreview[]> => {
    return items.map(item => {
      const changes: Record<string, { from: any; to: any }> = {}
      const warnings: string[] = []
      const conflicts: string[] = []

      updates.forEach(update => {
        if (!update.condition || update.condition(item)) {
          const currentValue = (item as any)[update.field]
          const newValue = update.value

          changes[update.field] = {
            from: currentValue,
            to: newValue
          }

          // Check for potential issues
          if (update.field === 'isActive' && item.isFeatured && !newValue) {
            warnings.push('Featured products should remain active')
          }

          if (update.field === 'basePrice' && newValue < 0) {
            warnings.push('Negative prices may cause issues')
          }

          // Check for conflicts (simulated - in real app, check against server)
          if (Math.random() < 0.1) { // 10% chance of conflict for demo
            conflicts.push(`Item may have been modified by another user`)
          }
        }
      })

      return { item, changes, warnings, conflicts }
    })
  }, [])

  // Enhanced bulk field updates with chunking and progress
  const bulkUpdateFields = useCallback(async (
    items: Product[], 
    updates: BulkFieldUpdate[], 
    options: BulkOperationOptions = {}
  ): Promise<BulkOperationResult> => {
    const {
      chunkSize = 100,
      validateBeforeUpdate = true,
      createUndoData = true,
      templateId,
      skipConflictCheck = false
    } = options

    // Setup abort controller
    abortController.current = new AbortController()
    const signal = abortController.current.signal

    // Initialize progress
    const totalItems = items.length
    const totalChunks = Math.ceil(totalItems / chunkSize)
    
    setProgress({
      isProcessing: true,
      currentItem: 0,
      totalItems,
      phase: 'preparing',
      message: 'Preparing bulk update...',
      canCancel: true,
      chunkInfo: {
        currentChunk: 0,
        totalChunks,
        chunkSize
      }
    })

    setErrors([])

    try {
      // Validation phase
      if (validateBeforeUpdate) {
        setProgress(prev => ({
          ...prev,
          phase: 'preparing',
          message: 'Validating items...'
        }))

        // Simulate validation
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (signal.aborted) throw new Error('Operation cancelled')
      }

      // Conflict detection phase
      if (!skipConflictCheck) {
        setProgress(prev => ({
          ...prev,
          message: 'Checking for conflicts...'
        }))

        // Simulate conflict check
        await new Promise(resolve => setTimeout(resolve, 300))
        
        if (signal.aborted) throw new Error('Operation cancelled')
      }

      // Processing phase
      setProgress(prev => ({
        ...prev,
        phase: 'processing',
        message: 'Processing updates...'
      }))

      const results: BulkOperationResult = {
        success: true,
        successCount: 0,
        failureCount: 0,
        successfulIds: [],
        errors: []
      }

      const undoData: any[] = []
      const newErrors: BulkOperationError[] = []

      // Process in chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        if (signal.aborted) throw new Error('Operation cancelled')

        const startIndex = chunkIndex * chunkSize
        const endIndex = Math.min(startIndex + chunkSize, totalItems)
        const chunk = items.slice(startIndex, endIndex)

        setProgress(prev => ({
          ...prev,
          currentItem: startIndex,
          message: `Processing chunk ${chunkIndex + 1} of ${totalChunks}...`,
          chunkInfo: {
            ...prev.chunkInfo!,
            currentChunk: chunkIndex + 1
          }
        }))

        // Process each item in chunk
        for (let i = 0; i < chunk.length; i++) {
          if (signal.aborted) throw new Error('Operation cancelled')

          const item = chunk[i]
          const itemIndex = startIndex + i

          setProgress(prev => ({
            ...prev,
            currentItem: itemIndex + 1,
            currentItemName: item.name,
            message: `Updating "${item.name}" (${itemIndex + 1}/${totalItems})`
          }))

          try {
            // Store undo data
            if (createUndoData) {
              const originalData: any = {}
              updates.forEach(update => {
                originalData[update.field] = (item as any)[update.field]
              })
              undoData.push({ id: item.id, originalData })
            }

            // Apply updates (simulated)
            const updatedItem = { ...item }
            updates.forEach(update => {
              if (!update.condition || update.condition(item)) {
                (updatedItem as any)[update.field] = update.value
              }
            })

            // Simulate API call with potential failure
            await new Promise(resolve => setTimeout(resolve, 50))
            
            if (Math.random() < 0.05) { // 5% failure rate for demo
              throw new Error('Validation failed: Invalid field value')
            }

            results.successCount++

          } catch (error) {
            results.failureCount++
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            
            results.errors.push({
              productId: item.id,
              error: errorMessage
            })

            newErrors.push({
              itemId: item.id,
              itemName: item.name,
              error: errorMessage,
              code: 'UPDATE_FAILED',
              canRetry: true
            })
          }

          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 10))
        }
      }

      // Completion phase
      setProgress(prev => ({
        ...prev,
        phase: 'completing',
        message: 'Finalizing updates...'
      }))

      await new Promise(resolve => setTimeout(resolve, 500))

      // Update state
      setErrors(newErrors)
      
      // Add to history
      const historyEntry: BulkOperationHistory = {
        id: Date.now().toString(),
        operation: 'bulk-field-update',
        itemCount: totalItems,
        successCount: results.successCount,
        failureCount: results.failureCount,
        timestamp: new Date(),
        canUndo: createUndoData && results.successCount > 0,
        undoData: createUndoData ? undoData : undefined,
        template: templateId ? templates.find(t => t.id === templateId) : undefined
      }

      setHistory(prev => [historyEntry, ...prev.slice(0, 9)]) // Keep last 10

      // Update template usage
      if (templateId) {
        setTemplates(prev => prev.map(t => 
          t.id === templateId 
            ? { ...t, usageCount: t.usageCount + 1 }
            : t
        ))
      }

      setProgress({
        isProcessing: false,
        currentItem: totalItems,
        totalItems,
        phase: 'completed',
        message: `Completed: ${results.successCount} successful, ${results.failureCount} failed`,
        canCancel: false
      })

      return results

    } catch (error) {
      setProgress({
        isProcessing: false,
        currentItem: 0,
        totalItems,
        phase: 'failed',
        message: error instanceof Error ? error.message : 'Operation failed',
        canCancel: false
      })

      throw error
    } finally {
      abortController.current = null
    }
  }, [templates])

  // Simplified status update using the enhanced field update
  const bulkUpdateStatus = useCallback(async (
    items: Product[], 
    isActive: boolean, 
    options: BulkOperationOptions = {}
  ): Promise<BulkOperationResult> => {
    const updates: BulkFieldUpdate[] = [
      { field: 'isActive', value: isActive }
    ]
    
    return bulkUpdateFields(items, updates, options)
  }, [bulkUpdateFields])

  // Retry failed items from previous operation
  const retryFailedItems = useCallback(async (operationId: string): Promise<BulkOperationResult> => {
    const failedItems = errors.filter(e => e.canRetry)
    
    if (failedItems.length === 0) {
      throw new Error('No failed items to retry')
    }

    // Get original operation details from cache
    const originalOperation = operationCache.current.get(operationId)
    if (!originalOperation) {
      throw new Error('Original operation data not found')
    }

    // Retry with same parameters
    return bulkUpdateFields(
      originalOperation.items.filter((item: Product) => 
        failedItems.some(e => e.itemId === item.id)
      ),
      originalOperation.updates,
      { ...originalOperation.options, skipConflictCheck: true }
    )
  }, [errors, bulkUpdateFields])

  // Undo previous operation
  const undoOperation = useCallback(async (operationId: string): Promise<BulkOperationResult> => {
    const operation = history.find(h => h.id === operationId)
    
    if (!operation || !operation.canUndo || !operation.undoData) {
      throw new Error('Operation cannot be undone')
    }

    // Create reverse updates
    const undoUpdates: BulkFieldUpdate[] = []
    const itemsToUndo: Product[] = []

    operation.undoData.forEach((undoItem: any) => {
      Object.entries(undoItem.originalData).forEach(([field, value]) => {
        undoUpdates.push({
          field,
          value,
          condition: (item: Product) => item.id === undoItem.id
        })
      })
    })

    // Execute undo
    return bulkUpdateFields(itemsToUndo, undoUpdates, {
      chunkSize: 50,
      validateBeforeUpdate: false,
      createUndoData: false,
      skipConflictCheck: true
    })
  }, [history, bulkUpdateFields])

  // Template management
  const saveTemplate = useCallback((
    name: string, 
    operation: string, 
    fields: Record<string, any>, 
    description?: string
  ): BulkOperationTemplate => {
    const template: BulkOperationTemplate = {
      id: Date.now().toString(),
      name,
      description,
      operation,
      fields,
      createdAt: new Date(),
      usageCount: 0
    }

    const newTemplates = [...templates, template]
    setTemplates(newTemplates)
    saveTemplatesToStorage(newTemplates)

    return template
  }, [templates, saveTemplatesToStorage])

  const deleteTemplate = useCallback((templateId: string) => {
    const newTemplates = templates.filter(t => t.id !== templateId)
    setTemplates(newTemplates)
    saveTemplatesToStorage(newTemplates)
  }, [templates, saveTemplatesToStorage])

  const applyTemplate = useCallback(async (
    templateId: string, 
    items: Product[]
  ): Promise<BulkOperationResult> => {
    const template = templates.find(t => t.id === templateId)
    if (!template) {
      throw new Error('Template not found')
    }

    const updates: BulkFieldUpdate[] = Object.entries(template.fields).map(([field, value]) => ({
      field,
      value
    }))

    return bulkUpdateFields(items, updates, { templateId })
  }, [templates, bulkUpdateFields])

  // Utility functions
  const cancelOperation = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort()
    }
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return {
    // State
    progress,
    errors,
    history,
    templates,
    
    // Operations
    bulkUpdateFields,
    bulkUpdateStatus,
    retryFailedItems,
    undoOperation,
    
    // Preview
    generatePreview,
    
    // Templates
    saveTemplate,
    deleteTemplate,
    applyTemplate,
    
    // Utilities
    cancelOperation,
    clearErrors,
    clearHistory
  }
}