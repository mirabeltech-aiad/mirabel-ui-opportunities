import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export const useDebouncedNavigation = (delay: number = 300) => {
  const navigate = useNavigate()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastNavigationRef = useRef<string | null>(null)

  const debouncedNavigate = useCallback((path: string) => {
    // Prevent duplicate navigation to the same path
    if (lastNavigationRef.current === path) {
      return
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for navigation
    timeoutRef.current = setTimeout(() => {
      lastNavigationRef.current = path
      navigate(path)
      
      // Reset after navigation
      setTimeout(() => {
        lastNavigationRef.current = null
      }, delay)
    }, 50) // Small delay to prevent rapid clicks
  }, [navigate, delay])

  const clearNavigation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    lastNavigationRef.current = null
  }, [])

  return { debouncedNavigate, clearNavigation }
}