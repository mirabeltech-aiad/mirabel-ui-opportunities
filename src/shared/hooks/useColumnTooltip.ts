import { useState, useCallback, useRef, useEffect } from 'react'
import { EnhancedColumnMetadata } from '../utils/columnMetadata'

export interface TooltipState {
  isVisible: boolean
  columnKey: string | null
  position: { x: number; y: number }
  metadata: EnhancedColumnMetadata | null
  showExtended: boolean
}

export interface UseColumnTooltipOptions {
  delay?: number
  hideDelay?: number
  offset?: { x: number; y: number }
  boundary?: 'viewport' | 'container'
  container?: HTMLElement
}

export interface UseColumnTooltipReturn {
  tooltipState: TooltipState
  showTooltip: (
    columnKey: string,
    metadata: EnhancedColumnMetadata,
    event: React.MouseEvent,
    extended?: boolean
  ) => void
  hideTooltip: () => void
  updatePosition: (event: React.MouseEvent) => void
  isTooltipVisible: (columnKey: string) => boolean
}

export function useColumnTooltip(options: UseColumnTooltipOptions = {}): UseColumnTooltipReturn {
  const {
    delay = 500,
    hideDelay = 100,
    offset = { x: 0, y: -10 },
    boundary = 'viewport',
    container
  } = options

  const [tooltipState, setTooltipState] = useState<TooltipState>({
    isVisible: false,
    columnKey: null,
    position: { x: 0, y: 0 },
    metadata: null,
    showExtended: false
  })

  const showTimeoutRef = useRef<NodeJS.Timeout>()
  const hideTimeoutRef = useRef<NodeJS.Timeout>()
  const isMouseOverTooltip = useRef(false)

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  // Calculate tooltip position with boundary detection
  const calculatePosition = useCallback((event: React.MouseEvent) => {
    const { clientX, clientY } = event
    let x = clientX + offset.x
    let y = clientY + offset.y

    if (boundary === 'viewport') {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const tooltipWidth = 320 // Approximate tooltip width
      const tooltipHeight = 400 // Approximate tooltip height

      // Adjust horizontal position
      if (x + tooltipWidth > viewportWidth) {
        x = clientX - tooltipWidth - Math.abs(offset.x)
      }

      // Adjust vertical position
      if (y + tooltipHeight > viewportHeight) {
        y = clientY - tooltipHeight - Math.abs(offset.y)
      }

      // Ensure tooltip stays within viewport
      x = Math.max(10, Math.min(x, viewportWidth - tooltipWidth - 10))
      y = Math.max(10, Math.min(y, viewportHeight - tooltipHeight - 10))
    } else if (boundary === 'container' && container) {
      const containerRect = container.getBoundingClientRect()
      const tooltipWidth = 320
      const tooltipHeight = 400

      // Convert to container-relative coordinates
      x = clientX - containerRect.left + offset.x
      y = clientY - containerRect.top + offset.y

      // Adjust for container boundaries
      if (x + tooltipWidth > containerRect.width) {
        x = clientX - containerRect.left - tooltipWidth - Math.abs(offset.x)
      }

      if (y + tooltipHeight > containerRect.height) {
        y = clientY - containerRect.top - tooltipHeight - Math.abs(offset.y)
      }

      // Ensure tooltip stays within container
      x = Math.max(10, Math.min(x, containerRect.width - tooltipWidth - 10))
      y = Math.max(10, Math.min(y, containerRect.height - tooltipHeight - 10))

      // Convert back to viewport coordinates
      x += containerRect.left
      y += containerRect.top
    }

    return { x, y }
  }, [offset, boundary, container])

  // Show tooltip
  const showTooltip = useCallback((
    columnKey: string,
    metadata: EnhancedColumnMetadata,
    event: React.MouseEvent,
    extended = false
  ) => {
    // Clear any existing timeouts
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)

    const position = calculatePosition(event)

    // If tooltip is already visible for the same column, just update position
    if (tooltipState.isVisible && tooltipState.columnKey === columnKey) {
      setTooltipState(prev => ({
        ...prev,
        position,
        showExtended: extended
      }))
      return
    }

    // Show tooltip after delay
    showTimeoutRef.current = setTimeout(() => {
      setTooltipState({
        isVisible: true,
        columnKey,
        position,
        metadata,
        showExtended: extended
      })
    }, delay)
  }, [delay, calculatePosition, tooltipState.isVisible, tooltipState.columnKey])

  // Hide tooltip
  const hideTooltip = useCallback(() => {
    // Clear show timeout if it's pending
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = undefined
    }

    // Don't hide if mouse is over tooltip
    if (isMouseOverTooltip.current) {
      return
    }

    // Hide tooltip after delay
    hideTimeoutRef.current = setTimeout(() => {
      setTooltipState(prev => ({
        ...prev,
        isVisible: false,
        columnKey: null,
        metadata: null
      }))
    }, hideDelay)
  }, [hideDelay])

  // Update tooltip position
  const updatePosition = useCallback((event: React.MouseEvent) => {
    if (!tooltipState.isVisible) return

    const position = calculatePosition(event)
    setTooltipState(prev => ({
      ...prev,
      position
    }))
  }, [tooltipState.isVisible, calculatePosition])

  // Check if tooltip is visible for a specific column
  const isTooltipVisible = useCallback((columnKey: string) => {
    return tooltipState.isVisible && tooltipState.columnKey === columnKey
  }, [tooltipState.isVisible, tooltipState.columnKey])

  // Handle mouse enter/leave on tooltip itself
  const handleTooltipMouseEnter = useCallback(() => {
    isMouseOverTooltip.current = true
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = undefined
    }
  }, [])

  const handleTooltipMouseLeave = useCallback(() => {
    isMouseOverTooltip.current = false
    hideTooltip()
  }, [hideTooltip])

  // Enhanced tooltip state with mouse handlers
  const enhancedTooltipState = {
    ...tooltipState,
    onMouseEnter: handleTooltipMouseEnter,
    onMouseLeave: handleTooltipMouseLeave
  }

  return {
    tooltipState: enhancedTooltipState,
    showTooltip,
    hideTooltip,
    updatePosition,
    isTooltipVisible
  }
}

/**
 * Hook for managing column information panel (extended tooltip)
 */
export function useColumnInfoPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<EnhancedColumnMetadata | null>(null)
  const [position, setPosition] = useState<'right' | 'left' | 'bottom'>('right')

  const openPanel = useCallback((metadata: EnhancedColumnMetadata, preferredPosition?: 'right' | 'left' | 'bottom') => {
    setSelectedColumn(metadata)
    setPosition(preferredPosition || 'right')
    setIsOpen(true)
  }, [])

  const closePanel = useCallback(() => {
    setIsOpen(false)
    setSelectedColumn(null)
  }, [])

  const togglePanel = useCallback((metadata?: EnhancedColumnMetadata) => {
    if (isOpen && (!metadata || selectedColumn?.key === metadata.key)) {
      closePanel()
    } else if (metadata) {
      openPanel(metadata)
    }
  }, [isOpen, selectedColumn, openPanel, closePanel])

  return {
    isOpen,
    selectedColumn,
    position,
    openPanel,
    closePanel,
    togglePanel
  }
}

/**
 * Hook for managing multiple column comparisons
 */
export function useColumnComparison() {
  const [comparedColumns, setComparedColumns] = useState<EnhancedColumnMetadata[]>([])
  const [isComparisonMode, setIsComparisonMode] = useState(false)

  const addToComparison = useCallback((metadata: EnhancedColumnMetadata) => {
    setComparedColumns(prev => {
      if (prev.find(col => col.key === metadata.key)) {
        return prev // Already in comparison
      }
      return [...prev, metadata].slice(0, 4) // Max 4 columns
    })
  }, [])

  const removeFromComparison = useCallback((columnKey: string) => {
    setComparedColumns(prev => prev.filter(col => col.key !== columnKey))
  }, [])

  const clearComparison = useCallback(() => {
    setComparedColumns([])
    setIsComparisonMode(false)
  }, [])

  const toggleComparisonMode = useCallback(() => {
    setIsComparisonMode(prev => !prev)
    if (isComparisonMode) {
      clearComparison()
    }
  }, [isComparisonMode, clearComparison])

  const isInComparison = useCallback((columnKey: string) => {
    return comparedColumns.some(col => col.key === columnKey)
  }, [comparedColumns])

  return {
    comparedColumns,
    isComparisonMode,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleComparisonMode,
    isInComparison,
    canAddMore: comparedColumns.length < 4
  }
}