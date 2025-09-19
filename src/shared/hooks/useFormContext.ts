import { useEffect, useState } from 'react'

export interface FormContextInfo {
  type: 'modal' | 'page' | 'auth' | 'simple' | 'filter'
  fieldCount: number
  isInModal: boolean
  isAuthForm: boolean
  containerWidth: number
}

/**
 * Hook that automatically detects form context to choose appropriate field types
 */
export function useFormContext(
  containerRef?: React.RefObject<HTMLElement>,
  explicitType?: 'modal' | 'page' | 'auth' | 'simple' | 'filter'
): FormContextInfo {
  const [context, setContext] = useState<FormContextInfo>({
    type: explicitType || 'page',
    fieldCount: 0,
    isInModal: false,
    isAuthForm: false,
    containerWidth: 0
  })

  useEffect(() => {
    if (!containerRef?.current) return

    const container = containerRef.current
    
    // Auto-detect context clues
    const detectContext = () => {
      // Check if we're in a modal/dialog
      const isInModal = !!(
        container.closest('[role="dialog"]') ||
        container.closest('.modal') ||
        container.closest('[data-modal]') ||
        container.closest('.dialog')
      )

      // Check if this is an auth form
      const isAuthForm = !!(
        container.closest('.auth-form') ||
        container.closest('[data-auth]') ||
        container.querySelector('input[type="password"]') ||
        container.textContent?.toLowerCase().includes('login') ||
        container.textContent?.toLowerCase().includes('sign in') ||
        container.textContent?.toLowerCase().includes('register')
      )

      // Count form fields
      const fieldCount = container.querySelectorAll(
        'input:not([type="hidden"]), select, textarea'
      ).length

      // Get container width for responsive decisions
      const containerWidth = container.getBoundingClientRect().width

      // Determine form type
      let detectedType: FormContextInfo['type'] = explicitType || 'page'
      
      if (!explicitType) {
        if (isInModal) {
          detectedType = 'modal'
        } else if (isAuthForm) {
          detectedType = 'auth'
        } else if (fieldCount <= 2) {
          detectedType = 'simple'
        } else {
          detectedType = 'page'
        }
      }

      setContext({
        type: detectedType,
        fieldCount,
        isInModal,
        isAuthForm,
        containerWidth
      })
    }

    // Initial detection
    detectContext()

    // Re-detect on DOM changes (for dynamic forms)
    const observer = new MutationObserver(detectContext)
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-modal', 'data-auth']
    })

    // Re-detect on resize
    const resizeObserver = new ResizeObserver(detectContext)
    resizeObserver.observe(container)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [containerRef, explicitType])

  return context
}

/**
 * Hook that provides field type recommendations based on context
 */
export function useFieldTypeRecommendation(context: FormContextInfo) {
  return {
    // Should use floating labels?
    shouldUseFloating: (() => {
      switch (context.type) {
        case 'modal':
          return true  // Always floating in modals (space efficient)
        case 'auth':
          return false // Never floating in auth (familiar)
        case 'simple':
          return false // Traditional for simple forms (clear)
        case 'filter':
          return false // Filters use their own components
        case 'page':
        default:
          return true  // Default to floating (modern)
      }
    })(),

    // Should use compact sizing?
    shouldUseCompact: context.type === 'modal',

    // Should use traditional patterns?
    shouldUseTraditional: context.type === 'auth' || context.type === 'simple',

    // Field height recommendation
    recommendedHeight: context.type === 'modal' ? 36 : 40,

    // CSS class recommendations
    recommendedClasses: {
      container: context.type === 'modal' ? 'space-y-4' : 'space-y-6',
      field: context.type === 'modal' ? 'form-field-modal' : 'form-field-base'
    }
  }
}