import { useState, useEffect, useCallback, useMemo } from 'react'
import { FieldUpdate, DialogTab, BulkUpdateExecutionState } from '../types'
import { PRODUCT_FIELDS } from '../constants/productFields'

/**
 * Custom hook for managing bulk update dialog state
 */
export const useBulkUpdateState = (isOpen: boolean) => {
  const [activeTab, setActiveTab] = useState<DialogTab>('fields')
  const [fieldUpdates, setFieldUpdates] = useState<FieldUpdate[]>([])
  const [executionState, setExecutionState] = useState<BulkUpdateExecutionState>({
    isProcessing: false,
    progress: 0,
    currentOperation: '',
    results: { successful: 0, failed: 0, errors: [] },
    showResults: false
  })

  // Initialize field updates when dialog opens
  useEffect(() => {
    if (isOpen && fieldUpdates.length === 0) {
      setFieldUpdates(PRODUCT_FIELDS.map(field => ({
        field: field.key,
        value: '',
        enabled: false,
        operation: field.operations?.[0]?.value || 'set'
      })))
    }
  }, [isOpen, fieldUpdates.length])

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('fields')
      setFieldUpdates([])
      setExecutionState({
        isProcessing: false,
        progress: 0,
        currentOperation: '',
        results: { successful: 0, failed: 0, errors: [] },
        showResults: false
      })
    }
  }, [isOpen])

  // Computed values
  const enabledUpdates = useMemo(() => 
    fieldUpdates.filter(update => update.enabled), 
    [fieldUpdates]
  )
  
  const hasEnabledUpdates = useMemo(() => 
    enabledUpdates.length > 0, 
    [enabledUpdates]
  )

  // Field update handlers
  const handleFieldToggle = useCallback((fieldKey: string, enabled: boolean) => {
    setFieldUpdates(prev => prev.map(update => 
      update.field === fieldKey ? { ...update, enabled } : update
    ))
  }, [])

  const handleFieldValueChange = useCallback((fieldKey: string, value: any) => {
    setFieldUpdates(prev => prev.map(update => 
      update.field === fieldKey ? { ...update, value } : update
    ))
  }, [])

  const handleOperationChange = useCallback((fieldKey: string, operation: string) => {
    setFieldUpdates(prev => prev.map(update => 
      update.field === fieldKey ? { ...update, operation } : update
    ))
  }, [])

  const handleFindReplaceChange = useCallback((fieldKey: string, findText: string, replaceText: string) => {
    setFieldUpdates(prev => prev.map(update => 
      update.field === fieldKey ? { ...update, findText, replaceText } : update
    ))
  }, [])

  // Execution state handlers
  const updateExecutionState = useCallback((updates: Partial<BulkUpdateExecutionState>) => {
    setExecutionState(prev => ({ ...prev, ...updates }))
  }, [])

  const setProgress = useCallback((progress: number) => {
    setExecutionState(prev => ({ ...prev, progress }))
  }, [])

  const setCurrentOperation = useCallback((currentOperation: string) => {
    setExecutionState(prev => ({ ...prev, currentOperation }))
  }, [])

  return {
    // State
    activeTab,
    fieldUpdates,
    executionState,
    enabledUpdates,
    hasEnabledUpdates,
    
    // Actions
    setActiveTab,
    handleFieldToggle,
    handleFieldValueChange,
    handleOperationChange,
    handleFindReplaceChange,
    updateExecutionState,
    setProgress,
    setCurrentOperation
  }
}