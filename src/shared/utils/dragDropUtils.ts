/**
 * Drag and drop utilities for column selector
 */

export interface DragData {
  type: 'column'
  columnKey: string
  sourcePane: 'available' | 'selected'
  sourceIndex: number
  columnData: any
}

export interface DropZone {
  id: string
  type: 'pane' | 'insertion'
  pane: 'available' | 'selected'
  index?: number
  accepts: string[]
  isValid: boolean
}

export interface DragState {
  isDragging: boolean
  draggedItem: string | null
  dragData: DragData | null
  dragPreview: HTMLElement | null
  dropZones: DropZone[]
  activeDropZone: string | null
  dragOffset: { x: number; y: number }
}

export interface DragDropResult {
  success: boolean
  operation: 'move' | 'copy' | 'reorder'
  fromPane: 'available' | 'selected'
  toPane: 'available' | 'selected'
  fromIndex: number
  toIndex: number
  columnKey: string
}

/**
 * Create drag data for transfer
 */
export function createDragData(
  columnKey: string,
  sourcePane: 'available' | 'selected',
  sourceIndex: number,
  columnData: any
): DragData {
  return {
    type: 'column',
    columnKey,
    sourcePane,
    sourceIndex,
    columnData
  }
}

/**
 * Parse drag data from data transfer
 */
export function parseDragData(dataTransfer: DataTransfer): DragData | null {
  try {
// logger import removed to avoid top-level import errors in utility helpers

    const data = dataTransfer.getData('application/json')
    if (!data) return null
    
    const parsed = JSON.parse(data)
    if (parsed.type !== 'column') return null
    
    return parsed as DragData
  } catch (error) {
    // console.warn('Failed to parse drag data:', error)
    return null
  }
}

/**
 * Set drag data on data transfer
 */
export function setDragData(dataTransfer: DataTransfer, dragData: DragData): void {
  dataTransfer.setData('application/json', JSON.stringify(dragData))
  dataTransfer.setData('text/plain', dragData.columnKey)
  dataTransfer.effectAllowed = 'move'
}

/**
 * Create drop zones for a pane
 */
export function createDropZones(
  pane: 'available' | 'selected',
  itemCount: number,
  dragData: DragData | null
): DropZone[] {
  const dropZones: DropZone[] = []
  
  // Pane drop zone (for adding/removing columns)
  dropZones.push({
    id: `${pane}-pane`,
    type: 'pane',
    pane,
    accepts: ['column'],
    isValid: dragData ? canDropInPane(dragData, pane) : true
  })
  
  // Insertion drop zones (for reordering within selected pane)
  if (pane === 'selected') {
    for (let i = 0; i <= itemCount; i++) {
      dropZones.push({
        id: `${pane}-insertion-${i}`,
        type: 'insertion',
        pane,
        index: i,
        accepts: ['column'],
        isValid: dragData ? canDropAtIndex(dragData, pane, i) : true
      })
    }
  }
  
  return dropZones
}

/**
 * Check if item can be dropped in a pane
 */
export function canDropInPane(dragData: DragData, targetPane: 'available' | 'selected'): boolean {
  // Can't drop in the same pane (unless reordering in selected pane)
  if (dragData.sourcePane === targetPane && targetPane === 'available') {
    return false
  }
  
  // Check if column is locked (can't remove locked columns from selected)
  if (targetPane === 'available' && dragData.columnData?.locked) {
    return false
  }
  
  return true
}

/**
 * Check if item can be dropped at a specific index
 */
export function canDropAtIndex(
  dragData: DragData,
  targetPane: 'available' | 'selected',
  targetIndex: number
): boolean {
  // Only allow reordering in selected pane
  if (targetPane !== 'selected') return false
  
  // Can't drop at the same position
  if (dragData.sourcePane === targetPane && dragData.sourceIndex === targetIndex) {
    return false
  }
  
  // Check if column is locked (locked columns have position restrictions)
  if (dragData.columnData?.locked) {
    // Allow some flexibility for locked columns, but not complete freedom
    return true
  }
  
  return true
}

/**
 * Calculate drop result
 */
export function calculateDropResult(
  dragData: DragData,
  dropZone: DropZone
): DragDropResult {
  const operation = dragData.sourcePane === dropZone.pane ? 'reorder' : 'move'
  
  return {
    success: dropZone.isValid,
    operation,
    fromPane: dragData.sourcePane,
    toPane: dropZone.pane,
    fromIndex: dragData.sourceIndex,
    toIndex: dropZone.index ?? -1,
    columnKey: dragData.columnKey
  }
}

/**
 * Create drag preview element
 */
export function createDragPreview(
  columnData: any,
  options: {
    width?: number
    opacity?: number
    className?: string
  } = {}
): HTMLElement {
  const { width = 200, opacity = 0.8, className = '' } = options
  
  const preview = document.createElement('div')
  preview.className = `
    bg-white border border-gray-300 rounded-lg shadow-lg p-2 pointer-events-none
    ${className}
  `.trim()
  
  preview.style.width = `${width}px`
  preview.style.opacity = opacity.toString()
  preview.style.position = 'absolute'
  preview.style.top = '-1000px'
  preview.style.left = '-1000px'
  preview.style.zIndex = '9999'
  
  // Create content
  const content = document.createElement('div')
  content.className = 'flex items-center gap-2'
  
  // Icon
  const icon = document.createElement('div')
  icon.className = 'w-4 h-4 bg-gray-400 rounded'
  content.appendChild(icon)
  
  // Title
  const title = document.createElement('span')
  title.className = 'font-medium text-sm text-gray-900 truncate'
  title.textContent = columnData.title || columnData.key
  content.appendChild(title)
  
  // Category badge
  if (columnData.category) {
    const badge = document.createElement('span')
    badge.className = 'text-xs bg-gray-100 text-gray-600 px-1 rounded'
    badge.textContent = columnData.category
    content.appendChild(badge)
  }
  
  preview.appendChild(content)
  
  return preview
}

/**
 * Update drag preview position
 */
export function updateDragPreviewPosition(
  preview: HTMLElement,
  clientX: number,
  clientY: number,
  offset: { x: number; y: number }
): void {
  preview.style.left = `${clientX - offset.x}px`
  preview.style.top = `${clientY - offset.y}px`
}

/**
 * Get drop zone from element
 */
export function getDropZoneFromElement(element: Element): string | null {
  // Look for drop zone data attribute
  const dropZoneId = element.getAttribute('data-drop-zone')
  if (dropZoneId) return dropZoneId
  
  // Look in parent elements
  let parent = element.parentElement
  while (parent) {
    const parentDropZoneId = parent.getAttribute('data-drop-zone')
    if (parentDropZoneId) return parentDropZoneId
    parent = parent.parentElement
  }
  
  return null
}

/**
 * Get insertion index from drop position
 */
export function getInsertionIndex(
  dropY: number,
  containerElement: Element,
  itemElements: Element[]
): number {
  const containerRect = containerElement.getBoundingClientRect()
  const relativeY = dropY - containerRect.top
  
  for (let i = 0; i < itemElements.length; i++) {
    const itemRect = itemElements[i].getBoundingClientRect()
    const itemRelativeY = itemRect.top - containerRect.top
    const itemMiddle = itemRelativeY + itemRect.height / 2
    
    if (relativeY < itemMiddle) {
      return i
    }
  }
  
  return itemElements.length
}

/**
 * Add drop zone visual feedback
 */
export function addDropZoneHighlight(element: Element, isValid: boolean): void {
  element.classList.add('drop-zone-active')
  
  if (isValid) {
    element.classList.add('drop-zone-valid')
    element.classList.remove('drop-zone-invalid')
  } else {
    element.classList.add('drop-zone-invalid')
    element.classList.remove('drop-zone-valid')
  }
}

/**
 * Remove drop zone visual feedback
 */
export function removeDropZoneHighlight(element: Element): void {
  element.classList.remove('drop-zone-active', 'drop-zone-valid', 'drop-zone-invalid')
}

/**
 * Add insertion point indicator
 */
export function addInsertionIndicator(
  containerElement: Element,
  index: number,
  itemElements: Element[]
): HTMLElement {
  const indicator = document.createElement('div')
  indicator.className = 'insertion-indicator'
  indicator.style.cssText = `
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #3b82f6;
    border-radius: 1px;
    z-index: 10;
    pointer-events: none;
  `
  
  if (index === 0) {
    // Insert at the beginning
    indicator.style.top = '0px'
  } else if (index >= itemElements.length) {
    // Insert at the end
    const lastItem = itemElements[itemElements.length - 1]
    if (lastItem) {
      const rect = lastItem.getBoundingClientRect()
      const containerRect = containerElement.getBoundingClientRect()
      indicator.style.top = `${rect.bottom - containerRect.top}px`
    }
  } else {
    // Insert between items
    const item = itemElements[index]
    if (item) {
      const rect = item.getBoundingClientRect()
      const containerRect = containerElement.getBoundingClientRect()
      indicator.style.top = `${rect.top - containerRect.top}px`
    }
  }
  
  containerElement.appendChild(indicator)
  return indicator
}

/**
 * Remove insertion point indicator
 */
export function removeInsertionIndicator(containerElement: Element): void {
  const indicators = containerElement.querySelectorAll('.insertion-indicator')
  indicators.forEach(indicator => indicator.remove())
}