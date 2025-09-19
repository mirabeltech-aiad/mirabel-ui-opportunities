import { useState, useEffect } from 'react'

interface ScreenProportionalSize {
  width: string
  height: string
  maxWidth: string
  maxHeight: string
}

/**
 * Custom hook to calculate screen-proportional dimensions with a 1-inch margin
 * Assumes 96 DPI (standard web DPI) where 1 inch = 96 pixels
 */
export function useScreenProportionalSize(): ScreenProportionalSize {
  const [dimensions, setDimensions] = useState<ScreenProportionalSize>({
    width: '90vw',
    height: '90vh',
    maxWidth: '1200px',
    maxHeight: '800px'
  })

  useEffect(() => {
    const calculateDimensions = () => {
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      // 1 inch margin = 96 pixels (at 96 DPI)
      const marginInPixels = 96
      const doubleMargin = marginInPixels * 2 // Both sides
      
      // Calculate proportional dimensions based on screen size
      const proportionalWidth = Math.min(screenWidth - doubleMargin, viewportWidth - doubleMargin)
      const proportionalHeight = Math.min(screenHeight - doubleMargin, viewportHeight - doubleMargin)
      
      // Convert to CSS values
      const widthVw = Math.min(95, (proportionalWidth / viewportWidth) * 100)
      const heightVh = Math.min(95, (proportionalHeight / viewportHeight) * 100)
      
      // Set reasonable max dimensions for very large screens
      const maxWidth = Math.min(proportionalWidth, 1400)
      const maxHeight = Math.min(proportionalHeight, 900)
      
      setDimensions({
        width: `${widthVw}vw`,
        height: `${heightVh}vh`,
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`
      })
    }

    // Calculate on mount
    calculateDimensions()

    // Recalculate on resize
    window.addEventListener('resize', calculateDimensions)
    
    return () => {
      window.removeEventListener('resize', calculateDimensions)
    }
  }, [])

  return dimensions
}

/**
 * Hook for smaller modals that should be more compact but still proportional
 */
export function useCompactScreenProportionalSize(): ScreenProportionalSize {
  const fullSize = useScreenProportionalSize()
  
  return {
    width: '70vw',
    height: '80vh',
    maxWidth: '800px',
    maxHeight: '700px'
  }
}