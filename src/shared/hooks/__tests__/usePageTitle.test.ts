import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { usePageTitle } from '../usePageTitle'

describe('usePageTitle Hook', () => {
  let originalTitle: string

  beforeEach(() => {
    originalTitle = document.title
  })

  afterEach(() => {
    document.title = originalTitle
  })

  describe('Basic Functionality', () => {
    it('should set document title with default suffix', () => {
      renderHook(() => usePageTitle('Test Page'))
      
      expect(document.title).toBe('Test Page - Magazine Manager Kiro')
    })

    it('should set document title with custom suffix', () => {
      renderHook(() => usePageTitle('Test Page', 'Custom App'))
      
      expect(document.title).toBe('Test Page - Custom App')
    })

    it('should set document title without suffix when empty string provided', () => {
      renderHook(() => usePageTitle('Test Page', ''))
      
      expect(document.title).toBe('Test Page')
    })
  })

  describe('Title Updates', () => {
    it('should update title when title prop changes', () => {
      const { rerender } = renderHook(
        ({ title }) => usePageTitle(title),
        { initialProps: { title: 'Initial Title' } }
      )
      
      expect(document.title).toBe('Initial Title - Magazine Manager Kiro')
      
      rerender({ title: 'Updated Title' })
      expect(document.title).toBe('Updated Title - Magazine Manager Kiro')
    })

    it('should update title when suffix prop changes', () => {
      const { rerender } = renderHook(
        ({ suffix }) => usePageTitle('Test Page', suffix),
        { initialProps: { suffix: 'Initial App' } }
      )
      
      expect(document.title).toBe('Test Page - Initial App')
      
      rerender({ suffix: 'Updated App' })
      expect(document.title).toBe('Test Page - Updated App')
    })
  })

  describe('Cleanup', () => {
    it('should restore default title on unmount', () => {
      const { unmount } = renderHook(() => usePageTitle('Test Page'))
      
      expect(document.title).toBe('Test Page - Magazine Manager Kiro')
      
      unmount()
      expect(document.title).toBe('Magazine Manager Kiro')
    })

    it('should handle multiple hook instances correctly', () => {
      const { unmount: unmount1 } = renderHook(() => usePageTitle('Page 1'))
      expect(document.title).toBe('Page 1 - Magazine Manager Kiro')
      
      const { unmount: unmount2 } = renderHook(() => usePageTitle('Page 2'))
      expect(document.title).toBe('Page 2 - Magazine Manager Kiro')
      
      // Unmounting first hook shouldn't affect title since second is still mounted
      unmount1()
      expect(document.title).toBe('Page 2 - Magazine Manager Kiro')
      
      // Unmounting second hook should restore default
      unmount2()
      expect(document.title).toBe('Magazine Manager Kiro')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      renderHook(() => usePageTitle(''))
      
      expect(document.title).toBe(' - Magazine Manager Kiro')
    })

    it('should handle special characters in title', () => {
      renderHook(() => usePageTitle('Test & Special "Characters"'))
      
      expect(document.title).toBe('Test & Special "Characters" - Magazine Manager Kiro')
    })

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(200)
      renderHook(() => usePageTitle(longTitle))
      
      expect(document.title).toBe(`${longTitle} - Magazine Manager Kiro`)
    })

    it('should handle undefined suffix gracefully', () => {
      renderHook(() => usePageTitle('Test Page', undefined as any))
      
      expect(document.title).toBe('Test Page - Magazine Manager Kiro')
    })
  })

  describe('Performance', () => {
    it('should not update title unnecessarily', () => {
      let titleSetCount = 0
      const originalTitleSetter = Object.getOwnPropertyDescriptor(Document.prototype, 'title')?.set
      
      Object.defineProperty(document, 'title', {
        set: function(value: string) {
          titleSetCount++
          if (originalTitleSetter) {
            originalTitleSetter.call(this, value)
          }
        },
        get: function() {
          return originalTitleSetter?.call(this) || ''
        },
        configurable: true
      })
      
      const { rerender } = renderHook(
        ({ title }) => usePageTitle(title),
        { initialProps: { title: 'Same Title' } }
      )
      
      const initialCount = titleSetCount
      
      // Rerender with same title
      rerender({ title: 'Same Title' })
      
      // Title should only be set once more (due to useEffect dependency)
      expect(titleSetCount).toBe(initialCount + 1)
      
      // Cleanup
      Object.defineProperty(document, 'title', originalTitleSetter || {})
    })
  })
})