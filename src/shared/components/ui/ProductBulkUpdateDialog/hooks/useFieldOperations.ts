import { useCallback } from 'react'

/**
 * Custom hook for handling field operations in bulk updates
 */
export const useFieldOperations = () => {
  /**
   * Apply text operation to a string value
   */
  const applyTextOperation = useCallback((
    originalValue: string, 
    operation: string, 
    newValue: string, 
    findText?: string, 
    replaceText?: string
  ): string => {
    switch (operation) {
      case 'set':
        return newValue
      case 'prepend':
        return newValue + originalValue
      case 'append':
        return originalValue + newValue
      case 'find-replace':
        return findText ? originalValue.replace(new RegExp(findText, 'g'), replaceText || '') : originalValue
      case 'uppercase':
        return originalValue.toUpperCase()
      case 'lowercase':
        return originalValue.toLowerCase()
      case 'title-case':
        return originalValue.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
        )
      case 'trim':
        return originalValue.trim()
      case 'clear':
        return ''
      default:
        return newValue
    }
  }, [])

  /**
   * Apply number operation to a numeric value
   */
  const applyNumberOperation = useCallback((
    originalValue: number, 
    operation: string, 
    newValue: number
  ): number => {
    switch (operation) {
      case 'set':
        return newValue
      case 'increase':
        return originalValue + newValue
      case 'decrease':
        return originalValue - newValue
      case 'multiply':
        return originalValue * newValue
      case 'percentage':
        return originalValue * (1 + newValue / 100)
      default:
        return newValue
    }
  }, [])

  /**
   * Apply tags operation to an array of tags
   */
  const applyTagsOperation = useCallback((
    originalTags: string[], 
    operation: string, 
    newTags: string[]
  ): string[] => {
    switch (operation) {
      case 'set':
        return newTags
      case 'add':
        return [...new Set([...originalTags, ...newTags])]
      case 'remove':
        return originalTags.filter(tag => !newTags.includes(tag))
      case 'clear':
        return []
      default:
        return newTags
    }
  }, [])

  return {
    applyTextOperation,
    applyNumberOperation,
    applyTagsOperation
  }
}