/**
 * Advanced undo/redo manager for bulk operations
 * Provides comprehensive state management with branching support
 */
import React from 'react'

export interface UndoableAction {
  id: string
  type: string
  description: string
  timestamp: Date
  execute: () => Promise<void> | void
  undo: () => Promise<void> | void
  canUndo: boolean
  canRedo: boolean
  metadata?: Record<string, any>
}

export interface UndoRedoState {
  history: UndoableAction[]
  currentIndex: number
  maxHistorySize: number
  canUndo: boolean
  canRedo: boolean
}

export class UndoRedoManager {
  private history: UndoableAction[] = []
  private currentIndex: number = -1
  private maxHistorySize: number
  private listeners: Array<(state: UndoRedoState) => void> = []

  constructor(maxHistorySize: number = 50) {
    this.maxHistorySize = maxHistorySize
  }

  /**
   * Execute an action and add it to history
   */
  async executeAction(action: UndoableAction): Promise<void> {
    try {
      await action.execute()
      
      // Remove any actions after current index (for branching)
      this.history = this.history.slice(0, this.currentIndex + 1)
      
      // Add new action
      this.history.push(action)
      this.currentIndex = this.history.length - 1
      
      // Limit history size
      if (this.history.length > this.maxHistorySize) {
        const removeCount = this.history.length - this.maxHistorySize
        this.history = this.history.slice(removeCount)
        this.currentIndex -= removeCount
      }
      
      this.notifyListeners()
    } catch (error) {
      console.error('Failed to execute action:', error)
      throw error
    }
  }

  /**
   * Undo the last action
   */
  async undo(): Promise<boolean> {
    if (!this.canUndo()) return false

    const action = this.history[this.currentIndex]
    
    try {
      await action.undo()
      this.currentIndex--
      this.notifyListeners()
      return true
    } catch (error) {
      console.error('Failed to undo action:', error)
      return false
    }
  }

  /**
   * Redo the next action
   */
  async redo(): Promise<boolean> {
    if (!this.canRedo()) return false

    const action = this.history[this.currentIndex + 1]
    
    try {
      await action.execute()
      this.currentIndex++
      this.notifyListeners()
      return true
    } catch (error) {
      console.error('Failed to redo action:', error)
      return false
    }
  }

  /**
   * Check if undo is possible
   */
  canUndo(): boolean {
    return this.currentIndex >= 0 && 
           this.currentIndex < this.history.length &&
           this.history[this.currentIndex]?.canUndo !== false
  }

  /**
   * Check if redo is possible
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1 &&
           this.history[this.currentIndex + 1]?.canRedo !== false
  }

  /**
   * Get current state
   */
  getState(): UndoRedoState {
    return {
      history: [...this.history],
      currentIndex: this.currentIndex,
      maxHistorySize: this.maxHistorySize,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    }
  }

  /**
   * Get action at specific index
   */
  getAction(index: number): UndoableAction | null {
    return this.history[index] || null
  }

  /**
   * Get current action
   */
  getCurrentAction(): UndoableAction | null {
    return this.getAction(this.currentIndex)
  }

  /**
   * Get next action (for redo)
   */
  getNextAction(): UndoableAction | null {
    return this.getAction(this.currentIndex + 1)
  }

  /**
   * Clear history
   */
  clear(): void {
    this.history = []
    this.currentIndex = -1
    this.notifyListeners()
  }

  /**
   * Get history summary
   */
  getHistorySummary(): Array<{
    index: number
    description: string
    timestamp: string
    isCurrent: boolean
    canUndo: boolean
    canRedo: boolean
  }> {
    return this.history.map((action, index) => ({
      index,
      description: action.description,
      timestamp: action.timestamp.toLocaleTimeString(),
      isCurrent: index === this.currentIndex,
      canUndo: action.canUndo,
      canRedo: action.canRedo
    }))
  }

  /**
   * Jump to specific point in history
   */
  async jumpTo(targetIndex: number): Promise<boolean> {
    if (targetIndex < -1 || targetIndex >= this.history.length) {
      return false
    }

    try {
      // Undo actions if moving backwards
      while (this.currentIndex > targetIndex) {
        const success = await this.undo()
        if (!success) return false
      }

      // Redo actions if moving forwards
      while (this.currentIndex < targetIndex) {
        const success = await this.redo()
        if (!success) return false
      }

      return true
    } catch (error) {
      console.error('Failed to jump to history point:', error)
      return false
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: UndoRedoState) => void): () => void {
    this.listeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    const state = this.getState()
    this.listeners.forEach(listener => {
      try {
        listener(state)
      } catch (error) {
        console.error('Error in undo/redo listener:', error)
      }
    })
  }
}

/**
 * Create an undoable action for column operations
 */
export function createColumnAction(
  type: 'add' | 'remove' | 'reorder' | 'bulk',
  description: string,
  executeCallback: () => Promise<void> | void,
  undoCallback: () => Promise<void> | void,
  metadata?: Record<string, any>
): UndoableAction {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    description,
    timestamp: new Date(),
    execute: executeCallback,
    undo: undoCallback,
    canUndo: true,
    canRedo: true,
    metadata
  }
}

/**
 * Create bulk operation action
 */
export function createBulkOperationAction(
  operationType: string,
  columnKeys: string[],
  fromState: string[],
  toState: string[],
  applyChanges: (state: string[]) => void
): UndoableAction {
  const description = `${operationType} ${columnKeys.length} column${columnKeys.length !== 1 ? 's' : ''}`
  
  return createColumnAction(
    'bulk',
    description,
    () => applyChanges(toState),
    () => applyChanges(fromState),
    {
      operationType,
      columnKeys,
      fromState: [...fromState],
      toState: [...toState]
    }
  )
}

/**
 * Hook for undo/redo functionality
 */
export function useUndoRedo(maxHistorySize?: number) {
  const managerRef = React.useRef(new UndoRedoManager(maxHistorySize))
  const [state, setState] = React.useState<UndoRedoState>(() => managerRef.current.getState())

  React.useEffect(() => {
    const unsubscribe = managerRef.current.subscribe(setState)
    return unsubscribe
  }, [])

  return {
    ...state,
    executeAction: managerRef.current.executeAction.bind(managerRef.current),
    undo: managerRef.current.undo.bind(managerRef.current),
    redo: managerRef.current.redo.bind(managerRef.current),
    clear: managerRef.current.clear.bind(managerRef.current),
    jumpTo: managerRef.current.jumpTo.bind(managerRef.current),
    getHistorySummary: managerRef.current.getHistorySummary.bind(managerRef.current),
    getCurrentAction: managerRef.current.getCurrentAction.bind(managerRef.current),
    getNextAction: managerRef.current.getNextAction.bind(managerRef.current)
  }
}