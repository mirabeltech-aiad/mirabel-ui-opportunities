import { useState, useCallback, useRef, useEffect } from 'react'
import {
  DragState,
  DragData,
  DropZone,
  DragDropResult,
  createDragData,
  parseDragData,
  setDragData,
  createDropZones,
  calculateDropResult,
  createDragPreview,
  updateDragPreviewPosition,
  getDropZoneFromElement,
  getInsertionIndex,
  addDropZoneHighlight,
  removeDropZoneHighlight,
  addInsertionIndicator,
  removeInsertionIndicator
} from '../utils/dragDropUtils'

export interface UseDragAndDropOptions {
  onDragStart?: (dragData: DragData) => void
  onDragEnd?: (result: DragDropResult) => void
  onDrop?: (result: DragDropResult) => void
  enablePreview?: boolean
  previewOptions?: {
    width?: number
    opacity?: number
    className?: string
  }
}

export interface UseDragAndDropReturn {
  // State
  dragState: DragState
  
  // Drag handlers
  handleDragStart: (
    event: React.DragEvent,
    columnKey: string,
    sourcePane: 'available' | 'selected',
    sourceIndex: number,
    columnData: any
  ) => void
  handleDragEnd: (event: React.DragEvent) => void
  handleDragOver: (event: React.DragEvent) => void
  handleDragEnter: (event: React.DragEvent) => void
  handleDragLeave: (event: React.DragEvent) => void
  handleDrop: (event: React.DragEvent) => void
  
  // Utilities
  isDragging: boolean
  getDraggedColumn: () => string | null
  isValidDropZone: (dropZoneId: string) => boolean
  getDropZones: (pane: 'available' | 'selected', itemCount: number) => DropZone[]
}

export function useDragAndDrop(options: UseDragAndDropOptions = {}): UseDragAndDropReturn {
  const {
    onDragStart,
    onDragEnd,
    onDrop,
    enablePreview = true,
    previewOptions = {}
  } = options
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragData: null,
    dragPreview: null,
    dropZones: [],
    activeDropZone: null,
    dragOffset: { x: 0, y: 0 }
  })
  
  const dragPreviewRef = useRef<HTMLElement | null>(null)
  const activeDropZoneRef = useRef<Element | null>(null)
  const insertionIndicatorRef = useRef<HTMLElement | null>(null)
  
  // Handle drag start
  const handleDragStart = useCallback((
    event: React.DragEvent,
    columnKey: string,
    sourcePane: 'available' | 'selected',
    sourceIndex: number,
    columnData: any
  ) => {
    const dragData = createDragData(columnKey, sourcePane, sourceIndex, columnData)
    
    // Set drag data
    setDragData(event.dataTransfer, dragData)
    
    // Calculate drag offset
    const rect = event.currentTarget.getBoundingClientRect()
    const dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
    
    // Create drag preview
    let dragPreview: HTMLElement | null = null
    if (enablePreview) {
      dragPreview = createDragPreview(columnData, previewOptions)
      document.body.appendChild(dragPreview)
      dragPreviewRef.current = dragPreview
    }
    
    // Update state
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      draggedItem: columnKey,
      dragData,
      dragPreview,
      dragOffset
    }))
    
    // Add drag class to source element
    event.currentTarget.classList.add('dragging')
    
    // Call callback
    onDragStart?.(dragData)
  }, [enablePreview, previewOptions, onDragStart])
  
  // Handle drag end
  const handleDragEnd = useCallback((event: React.DragEvent) => {
    // Remove drag class from source element
    event.currentTarget.classList.remove('dragging')
    
    // Clean up drag preview
    if (dragPreviewRef.current) {
      document.body.removeChild(dragPreviewRef.current)
      dragPreviewRef.current = null
    }
    
    // Clean up drop zone highlights
    if (activeDropZoneRef.current) {
      removeDropZoneHighlight(activeDropZoneRef.current)
      activeDropZoneRef.current = null
    }
    
    // Clean up insertion indicators
    if (insertionIndicatorRef.current) {
      insertionIndicatorRef.current.remove()
      insertionIndicatorRef.current = null
    }
    
    const result: DragDropResult = {
      success: false,
      operation: 'move',
      fromPane: dragState.dragData?.sourcePane || 'available',
      toPane: 'available',
      fromIndex: dragState.dragData?.sourceIndex || 0,
      toIndex: -1,
      columnKey: dragState.draggedItem || ''
    }
    
    // Reset state
    setDragState(prev => ({
      ...prev,
      isDragging: false,
      draggedItem: null,
      dragData: null,
      dragPreview: null,
      activeDropZone: null
    }))
    
    // Call callback
    onDragEnd?.(result)
  }, [dragState, onDragEnd])
  
  // Handle drag over
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    
    // Update drag preview position
    if (dragPreviewRef.current && dragState.dragOffset) {
      updateDragPreviewPosition(
        dragPreviewRef.current,
        event.clientX,
        event.clientY,
        dragState.dragOffset
      )
    }
    
    // Find drop zone
    const dropZoneId = getDropZoneFromElement(event.target as Element)
    if (dropZoneId && dropZoneId !== dragState.activeDropZone) {
      // Clean up previous drop zone
      if (activeDropZoneRef.current) {
        removeDropZoneHighlight(activeDropZoneRef.current)
      }
      
      // Highlight new drop zone
      const dropZoneElement = document.querySelector(`[data-drop-zone="${dropZoneId}"]`)
      if (dropZoneElement) {
        const dropZone = dragState.dropZones.find(dz => dz.id === dropZoneId)
        addDropZoneHighlight(dropZoneElement, dropZone?.isValid ?? false)
        activeDropZoneRef.current = dropZoneElement
      }
      
      // Update state
      setDragState(prev => ({
        ...prev,
        activeDropZone: dropZoneId
      }))
    }
    
    // Handle insertion indicators for selected pane
    if (dropZoneId?.includes('selected') && dragState.dragData) {
      const containerElement = event.currentTarget as Element
      const itemElements = Array.from(containerElement.querySelectorAll('[data-column-item]'))
      const insertionIndex = getInsertionIndex(event.clientY, containerElement, itemElements)
      
      // Remove old indicator
      if (insertionIndicatorRef.current) {
        insertionIndicatorRef.current.remove()
      }
      
      // Add new indicator
      insertionIndicatorRef.current = addInsertionIndicator(
        containerElement,
        insertionIndex,
        itemElements
      )
    }
  }, [dragState])
  
  // Handle drag enter
  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])
  
  // Handle drag leave
  const handleDragLeave = useCallback((event: React.DragEvent) => {
    // Only handle if leaving the drop zone completely
    const relatedTarget = event.relatedTarget as Element
    const currentTarget = event.currentTarget as Element
    
    if (!currentTarget.contains(relatedTarget)) {
      // Clean up drop zone highlights
      if (activeDropZoneRef.current) {
        removeDropZoneHighlight(activeDropZoneRef.current)
        activeDropZoneRef.current = null
      }
      
      // Clean up insertion indicators
      if (insertionIndicatorRef.current) {
        insertionIndicatorRef.current.remove()
        insertionIndicatorRef.current = null
      }
      
      // Update state
      setDragState(prev => ({
        ...prev,
        activeDropZone: null
      }))
    }
  }, [])
  
  // Handle drop
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    
    const dragData = parseDragData(event.dataTransfer)
    if (!dragData) return
    
    const dropZoneId = getDropZoneFromElement(event.target as Element)
    if (!dropZoneId) return
    
    const dropZone = dragState.dropZones.find(dz => dz.id === dropZoneId)
    if (!dropZone || !dropZone.isValid) return
    
    // Calculate insertion index for selected pane
    if (dropZone.type === 'insertion') {
      const containerElement = event.currentTarget as Element
      const itemElements = Array.from(containerElement.querySelectorAll('[data-column-item]'))
      dropZone.index = getInsertionIndex(event.clientY, containerElement, itemElements)
    }
    
    const result = calculateDropResult(dragData, dropZone)
    
    // Clean up
    if (activeDropZoneRef.current) {
      removeDropZoneHighlight(activeDropZoneRef.current)
      activeDropZoneRef.current = null
    }
    
    if (insertionIndicatorRef.current) {
      insertionIndicatorRef.current.remove()
      insertionIndicatorRef.current = null
    }
    
    // Call callback
    onDrop?.(result)
  }, [dragState, onDrop])
  
  // Get drop zones for a pane
  const getDropZones = useCallback((pane: 'available' | 'selected', itemCount: number) => {
    return createDropZones(pane, itemCount, dragState.dragData)
  }, [dragState.dragData])
  
  // Update drop zones when drag data changes
  useEffect(() => {
    if (dragState.isDragging && dragState.dragData) {
      // This will be called by the component to update drop zones
      // when the drag operation is active
    }
  }, [dragState.isDragging, dragState.dragData])
  
  return {
    // State
    dragState,
    
    // Handlers
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    
    // Utilities
    isDragging: dragState.isDragging,
    getDraggedColumn: () => dragState.draggedItem,
    isValidDropZone: (dropZoneId: string) => {
      const dropZone = dragState.dropZones.find(dz => dz.id === dropZoneId)
      return dropZone?.isValid ?? false
    },
    getDropZones
  }
}