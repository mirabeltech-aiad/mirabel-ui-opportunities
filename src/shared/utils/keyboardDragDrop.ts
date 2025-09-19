/**
 * Keyboard-based drag and drop utilities for accessibility
 * Provides keyboard alternatives to mouse-based drag and drop operations
 */

export interface KeyboardDragState {
  selectedColumn: string | null
  mode: 'select' | 'move' | 'reorder'
  sourcePane: 'available' | 'selected' | null
  targetPane: 'available' | 'selected' | null
  insertionIndex: number
  isActive: boolean
}

export interface KeyboardDragCallbacks {
  onColumnSelect: (columnKey: string, pane: 'available' | 'selected') => void
  onColumnMove: (columnKey: string, fromPane: 'available' | 'selected', toPane: 'available' | 'selected', index?: number) => void
  onColumnReorder: (columnKey: string, newIndex: number) => void
  onCancel: () => void
  onError: (message: string) => void
}

export class KeyboardDragManager {
  private state: KeyboardDragState
  private callbacks: KeyboardDragCallbacks
  private availableColumns: string[]
  private selectedColumns: string[]

  constructor(callbacks: KeyboardDragCallbacks) {
    this.callbacks = callbacks
    this.state = {
      selectedColumn: null,
      mode: 'select',
      sourcePane: null,
      targetPane: null,
      insertionIndex: 0,
      isActive: false
    }
    this.availableColumns = []
    this.selectedColumns = []
  }

  /**
   * Update column lists
   */
  updateColumns(available: string[], selected: string[]): void {
    this.availableColumns = available
    this.selectedColumns = selected
  }

  /**
   * Get current state
   */
  getState(): KeyboardDragState {
    return { ...this.state }
  }

  /**
   * Handle keyboard events
   */
  handleKeyDown(event: KeyboardEvent, currentColumn?: string, currentPane?: 'available' | 'selected'): boolean {
    if (!this.state.isActive && event.key !== 'Enter' && event.key !== ' ') {
      return false
    }

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!this.state.isActive) {
          this.startKeyboardDrag(currentColumn, currentPane)
        } else {
          this.executeAction()
        }
        event.preventDefault()
        return true

      case 'Escape':
        this.cancelKeyboardDrag()
        event.preventDefault()
        return true

      case 'ArrowUp':
        this.moveSelection(-1)
        event.preventDefault()
        return true

      case 'ArrowDown':
        this.moveSelection(1)
        event.preventDefault()
        return true

      case 'ArrowLeft':
        this.switchPane('available')
        event.preventDefault()
        return true

      case 'ArrowRight':
        this.switchPane('selected')
        event.preventDefault()
        return true

      case 'Tab':
        if (this.state.mode === 'reorder') {
          this.switchMode('move')
        } else if (this.state.mode === 'move') {
          this.switchMode('reorder')
        }
        event.preventDefault()
        return true

      case 'Home':
        this.moveToPosition(0)
        event.preventDefault()
        return true

      case 'End':
        this.moveToEnd()
        event.preventDefault()
        return true

      default:
        return false
    }
  }

  /**
   * Start keyboard drag operation
   */
  private startKeyboardDrag(columnKey?: string, pane?: 'available' | 'selected'): void {
    if (!columnKey || !pane) return

    this.state = {
      selectedColumn: columnKey,
      mode: 'move',
      sourcePane: pane,
      targetPane: pane === 'available' ? 'selected' : 'available',
      insertionIndex: pane === 'available' ? this.selectedColumns.length : 0,
      isActive: true
    }

    this.callbacks.onColumnSelect(columnKey, pane)
    this.announceState()
  }

  /**
   * Cancel keyboard drag operation
   */
  private cancelKeyboardDrag(): void {
    this.state = {
      selectedColumn: null,
      mode: 'select',
      sourcePane: null,
      targetPane: null,
      insertionIndex: 0,
      isActive: false
    }

    this.callbacks.onCancel()
    this.announce('Drag operation cancelled')
  }

  /**
   * Execute the current action
   */
  private executeAction(): void {
    if (!this.state.selectedColumn || !this.state.sourcePane) return

    try {
      if (this.state.mode === 'move' && this.state.targetPane) {
        this.callbacks.onColumnMove(
          this.state.selectedColumn,
          this.state.sourcePane,
          this.state.targetPane,
          this.state.insertionIndex
        )
        this.announce(`Column moved to ${this.state.targetPane} pane at position ${this.state.insertionIndex + 1}`)
      } else if (this.state.mode === 'reorder') {
        this.callbacks.onColumnReorder(this.state.selectedColumn, this.state.insertionIndex)
        this.announce(`Column reordered to position ${this.state.insertionIndex + 1}`)
      }

      this.cancelKeyboardDrag()
    } catch (error) {
      this.callbacks.onError(`Failed to execute action: ${error}`)
    }
  }

  /**
   * Move selection up or down
   */
  private moveSelection(direction: number): void {
    if (this.state.mode === 'reorder' && this.state.sourcePane === 'selected') {
      const maxIndex = this.selectedColumns.length - 1
      this.state.insertionIndex = Math.max(0, Math.min(maxIndex, this.state.insertionIndex + direction))
    } else if (this.state.mode === 'move') {
      const targetColumns = this.state.targetPane === 'available' ? this.availableColumns : this.selectedColumns
      const maxIndex = targetColumns.length
      this.state.insertionIndex = Math.max(0, Math.min(maxIndex, this.state.insertionIndex + direction))
    }

    this.announcePosition()
  }

  /**
   * Switch between panes
   */
  private switchPane(pane: 'available' | 'selected'): void {
    if (this.state.mode !== 'move') return

    this.state.targetPane = pane
    this.state.insertionIndex = 0
    this.announceState()
  }

  /**
   * Switch between modes
   */
  private switchMode(mode: 'move' | 'reorder'): void {
    if (mode === 'reorder' && this.state.sourcePane !== 'selected') {
      this.callbacks.onError('Can only reorder columns within the selected pane')
      return
    }

    this.state.mode = mode
    if (mode === 'reorder') {
      this.state.targetPane = 'selected'
      this.state.insertionIndex = this.selectedColumns.indexOf(this.state.selectedColumn!) || 0
    }

    this.announceState()
  }

  /**
   * Move to specific position
   */
  private moveToPosition(position: number): void {
    const targetColumns = this.state.targetPane === 'available' ? this.availableColumns : this.selectedColumns
    const maxIndex = this.state.mode === 'reorder' ? targetColumns.length - 1 : targetColumns.length
    this.state.insertionIndex = Math.max(0, Math.min(maxIndex, position))
    this.announcePosition()
  }

  /**
   * Move to end
   */
  private moveToEnd(): void {
    const targetColumns = this.state.targetPane === 'available' ? this.availableColumns : this.selectedColumns
    const maxIndex = this.state.mode === 'reorder' ? targetColumns.length - 1 : targetColumns.length
    this.state.insertionIndex = maxIndex
    this.announcePosition()
  }

  /**
   * Announce current state for screen readers
   */
  private announceState(): void {
    if (!this.state.selectedColumn) return

    const column = this.state.selectedColumn
    const mode = this.state.mode
    const targetPane = this.state.targetPane

    if (mode === 'move') {
      this.announce(`Moving ${column} to ${targetPane} pane. Use arrow keys to choose position, Enter to confirm, Escape to cancel.`)
    } else if (mode === 'reorder') {
      this.announce(`Reordering ${column} within selected pane. Use arrow keys to choose position, Enter to confirm, Escape to cancel.`)
    }
  }

  /**
   * Announce current position
   */
  private announcePosition(): void {
    const position = this.state.insertionIndex + 1
    const targetPane = this.state.targetPane
    this.announce(`Position ${position} in ${targetPane} pane`)
  }

  /**
   * Announce message to screen readers
   */
  private announce(message: string): void {
    // Create a live region for screen reader announcements
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  /**
   * Get keyboard shortcuts help text
   */
  static getKeyboardShortcuts(): Array<{ key: string; description: string }> {
    return [
      { key: 'Enter/Space', description: 'Start drag operation or confirm action' },
      { key: 'Escape', description: 'Cancel drag operation' },
      { key: 'Arrow Up/Down', description: 'Move insertion position' },
      { key: 'Arrow Left/Right', description: 'Switch between panes' },
      { key: 'Tab', description: 'Switch between move and reorder modes' },
      { key: 'Home', description: 'Move to first position' },
      { key: 'End', description: 'Move to last position' }
    ]
  }
}

/**
 * Hook for keyboard drag and drop functionality
 */
export function useKeyboardDragDrop(callbacks: KeyboardDragCallbacks) {
  const manager = new KeyboardDragManager(callbacks)

  return {
    handleKeyDown: manager.handleKeyDown.bind(manager),
    updateColumns: manager.updateColumns.bind(manager),
    getState: manager.getState.bind(manager),
    getKeyboardShortcuts: KeyboardDragManager.getKeyboardShortcuts
  }
}