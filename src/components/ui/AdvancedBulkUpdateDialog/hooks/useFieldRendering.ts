import { useCallback } from 'react'
import type { FieldUpdate } from '../types'
import { AVAILABLE_FIELDS } from '../config/availableFields'

/**
 * Hook for field rendering logic and operations
 */
export const useFieldRendering = () => {
  
  const getFieldDefinition = useCallback((fieldKey: string) => {
    return AVAILABLE_FIELDS.find(f => f.key === fieldKey)
  }, [])

  const needsValueInput = useCallback((field: FieldUpdate) => {
    const noValueOperations = ['clear', 'uppercase', 'lowercase', 'title-case', 'trim', 'round']
    return !noValueOperations.includes(field.operation || '')
  }, [])

  const getRelatedFields = useCallback((fieldKey: string) => {
    const fieldDef = getFieldDefinition(fieldKey)
    if (!fieldDef?.relatedFields) return []
    
    return fieldDef.relatedFields.map(relFieldKey => {
      const relFieldDef = getFieldDefinition(relFieldKey)
      return {
        key: relFieldKey,
        label: relFieldDef?.label || relFieldKey
      }
    })
  }, [getFieldDefinition])

  const getCopyFromFields = useCallback((fieldKey: string, fieldType: string) => {
    if (fieldType === 'advanced-number') {
      return AVAILABLE_FIELDS
        .filter(f => f.type === 'advanced-number' && f.key !== fieldKey)
        .map(f => ({ key: f.key, label: f.label }))
    }
    
    return AVAILABLE_FIELDS
      .filter(f => f.key !== fieldKey)
      .map(f => ({ key: f.key, label: f.label }))
  }, [])

  const getSelectOptions = useCallback((fieldKey: string) => {
    const fieldDef = getFieldDefinition(fieldKey)
    if (!fieldDef?.options) return []
    
    return fieldDef.options.map((option) => ({
      value: typeof option === 'object' ? option.value.toString() : option,
      label: typeof option === 'object' ? option.label : option
    }))
  }, [getFieldDefinition])

  return {
    getFieldDefinition,
    needsValueInput,
    getRelatedFields,
    getCopyFromFields,
    getSelectOptions
  }
}