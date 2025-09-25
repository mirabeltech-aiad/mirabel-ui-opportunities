import { useState, useCallback, useRef, useEffect } from 'react'

interface UseColumnResizeProps {
  onColumnResize: (columnId: string, newWidth: number) => void
  getColumnWidth: (columnId: string) => number
  minWidth?: number
  maxWidth?: number
}

interface ResizeState {
  isResizing: boolean
  columnId: string | null
  startX: number
  startWidth: number
}

export const useColumnResize = ({
  onColumnResize,
  getColumnWidth,
  minWidth = 80,
  maxWidth = 1000
}: UseColumnResizeProps) => {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    columnId: null,
    startX: 0,
    startWidth: 0
  })

  const resizeHandleRef = useRef<HTMLDivElement>(null)

  // Handle mouse down on resize handle
  const handleResizeStart = useCallback((e: React.MouseEvent, columnId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startWidth = getColumnWidth(columnId)

    setResizeState({
      isResizing: true,
      columnId,
      startX,
      startWidth
    })

    // Add cursor style to body
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [getColumnWidth])

  // Handle mouse move during resize
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizeState.isResizing || !resizeState.columnId) return

    const deltaX = e.clientX - resizeState.startX
    const newWidth = resizeState.startWidth + deltaX

    // Apply constraints
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))

    onColumnResize(resizeState.columnId, constrainedWidth)
  }, [resizeState, onColumnResize, minWidth, maxWidth])

  // Handle mouse up to end resize
  const handleResizeEnd = useCallback(() => {
    if (!resizeState.isResizing) return

    setResizeState({
      isResizing: false,
      columnId: null,
      startX: 0,
      startWidth: 0
    })

    // Remove cursor style from body
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [resizeState.isResizing])

  // Add global mouse event listeners
  useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      document.addEventListener('mouseleave', handleResizeEnd)

      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
        document.removeEventListener('mouseleave', handleResizeEnd)
      }
    }
  }, [resizeState.isResizing, handleResizeMove, handleResizeEnd])

  // Create resize handle component
  const ResizeHandle = useCallback(({ columnId, className = '' }: { columnId: string, className?: string }) => (
    <div
      ref={resizeHandleRef}
      className={`resize-handle absolute right-0 top-0 bottom-0 w-2 hover:bg-ocean-300 transition-colors cursor-col-resize ${className}`}
      onMouseDown={(e) => handleResizeStart(e, columnId)}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize column"
      aria-valuenow={getColumnWidth(columnId)}
      style={{ zIndex: 10 }}
    />
  ), [handleResizeStart, getColumnWidth])

  return {
    resizeState,
    ResizeHandle,
    isResizing: resizeState.isResizing
  }
}