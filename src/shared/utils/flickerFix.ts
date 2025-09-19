/**
 * Comprehensive Flicker Fix Utilities
 * 
 * This module provides utilities to prevent common UI flickering issues
 * in tooltips, dropdowns, floating elements, and animations.
 */

// Debounce utility to prevent rapid state changes
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for scroll/resize events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Stable position calculation to prevent jittery positioning
export const calculateStablePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: 'top' | 'bottom' | 'left' | 'right' = 'top',
  offset: number = 8
) => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY
  }

  let x = 0
  let y = 0

  // Calculate base position
  switch (placement) {
    case 'top':
      x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
      y = triggerRect.top - tooltipRect.height - offset
      break
    case 'bottom':
      x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
      y = triggerRect.bottom + offset
      break
    case 'left':
      x = triggerRect.left - tooltipRect.width - offset
      y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
      break
    case 'right':
      x = triggerRect.right + offset
      y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
      break
  }

  // Apply viewport constraints with padding
  const padding = 8
  x = Math.max(padding, Math.min(x, viewport.width - tooltipRect.width - padding))
  y = Math.max(padding, Math.min(y, viewport.height - tooltipRect.height - padding))

  // Round to prevent sub-pixel positioning
  return {
    x: Math.round(x),
    y: Math.round(y)
  }
}

// Prevent animation conflicts
export const createStableAnimationClass = (isVisible: boolean, duration: number = 150) => {
  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.95)',
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    pointerEvents: isVisible ? 'auto' : 'none' as const
  }
}

// Stable z-index management
export const getStableZIndex = (type: 'tooltip' | 'dropdown' | 'modal' | 'overlay') => {
  const zIndexMap = {
    tooltip: 9999,
    dropdown: 9998,
    modal: 9997,
    overlay: 9996
  }
  return zIndexMap[type]
}

// Prevent rapid hover state changes
export class HoverStateManager {
  private timeouts = new Map<string, NodeJS.Timeout>()
  
  setHoverState(
    id: string, 
    callback: () => void, 
    delay: number = 100,
    immediate: boolean = false
  ) {
    // Clear existing timeout
    const existingTimeout = this.timeouts.get(id)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    if (immediate) {
      callback()
    } else {
      const timeout = setTimeout(callback, delay)
      this.timeouts.set(id, timeout)
    }
  }

  clearHoverState(id: string) {
    const timeout = this.timeouts.get(id)
    if (timeout) {
      clearTimeout(timeout)
      this.timeouts.delete(id)
    }
  }

  clearAll() {
    this.timeouts.forEach(timeout => clearTimeout(timeout))
    this.timeouts.clear()
  }
}

// Global hover state manager instance
export const hoverStateManager = new HoverStateManager()

// Prevent layout thrashing during animations
export const batchDOMUpdates = (updates: (() => void)[]) => {
  requestAnimationFrame(() => {
    updates.forEach(update => update())
  })
}

// Stable event handlers to prevent re-renders
export const createStableEventHandlers = <T extends Record<string, (...args: any[]) => void>>(
  handlers: T,
  dependencies: any[] = []
): T => {
  const stableHandlers = {} as T
  
  Object.keys(handlers).forEach(key => {
    stableHandlers[key as keyof T] = handlers[key as keyof T]
  })
  
  return stableHandlers
}

// CSS transition utilities
export const transitionClasses = {
  fadeIn: 'transition-opacity duration-150 ease-out opacity-0 data-[state=open]:opacity-100',
  slideDown: 'transition-all duration-150 ease-out transform -translate-y-1 opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100',
  scaleIn: 'transition-all duration-150 ease-out transform scale-95 opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100'
}

// Prevent scroll-induced flickering
export const createScrollStableElement = (element: HTMLElement) => {
  if (!element) return

  // Use transform instead of changing position
  element.style.willChange = 'transform'
  element.style.backfaceVisibility = 'hidden'
  element.style.perspective = '1000px'
}

// Fix for tooltip positioning flickering
export const useStableTooltipPosition = () => {
  const positionCache = new Map<string, { x: number; y: number }>()
  
  return {
    getPosition: (id: string, calculateFn: () => { x: number; y: number }) => {
      const cached = positionCache.get(id)
      const newPosition = calculateFn()
      
      // Only update if position changed significantly (> 2px)
      if (!cached || 
          Math.abs(cached.x - newPosition.x) > 2 || 
          Math.abs(cached.y - newPosition.y) > 2) {
        positionCache.set(id, newPosition)
        return newPosition
      }
      
      return cached
    },
    clearCache: (id?: string) => {
      if (id) {
        positionCache.delete(id)
      } else {
        positionCache.clear()
      }
    }
  }
}