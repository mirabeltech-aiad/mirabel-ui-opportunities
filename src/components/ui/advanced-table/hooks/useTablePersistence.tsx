import { logger } from '../../../shared/logger'

import { useEffect, useCallback } from 'react'
import { TableState, SavedView, ColumnState, SortConfig, FilterConfig } from '../types'

interface PersistenceConfig {
  key: string
  version?: string
  storage?: Storage
  debounceMs?: number
}

interface PersistedTableState {
  version: string
  columns: ColumnState[]
  sortConfig: SortConfig[]
  filters: FilterConfig[]
  pageSize: number
  rowDensity: 'compact' | 'normal' | 'comfortable'
  currentView: string | null
  savedViews: SavedView[]
  timestamp: number
}

const DEFAULT_VERSION = '1.0.0'
const DEFAULT_DEBOUNCE_MS = 500

/**
 * Hook for persisting table state to localStorage
 */
export function useTablePersistence<T>(
  state: TableState<T>,
  config: PersistenceConfig,
  onStateRestore?: (restoredState: Partial<TableState<T>>) => void
) {
  const {
    key,
    version = DEFAULT_VERSION,
    storage = localStorage,
    debounceMs = DEFAULT_DEBOUNCE_MS
  } = config

  // Generate storage key with version
  const storageKey = `table-state-${key}-v${version}`

  // Load persisted state on mount
  useEffect(() => {
    try {
      const stored = storage.getItem(storageKey)
      if (stored) {
        const parsed: PersistedTableState = JSON.parse(stored)
        
        // Validate version compatibility
        if (parsed.version === version) {
          const restoredState: Partial<TableState<T>> = {
            columns: parsed.columns,
            sortConfig: parsed.sortConfig,
            filters: parsed.filters,
            pageSize: parsed.pageSize,
            rowDensity: parsed.rowDensity,
            currentView: parsed.currentView,
            savedViews: parsed.savedViews
          }
          
          onStateRestore?.(restoredState)
        } else {
          // Version mismatch, clear old data
          storage.removeItem(storageKey)
        }
      }
    } catch (error) {
      logger.warn('Failed to load persisted table state:', error)
      // Clear corrupted data
      storage.removeItem(storageKey)
    }
  }, [storageKey, storage, version, onStateRestore])

  // Debounced save function
  const saveState = useCallback(
    debounce((stateToSave: TableState<T>) => {
      try {
        const persistedState: PersistedTableState = {
          version,
          columns: stateToSave.columns,
          sortConfig: stateToSave.sortConfig,
          filters: stateToSave.filters,
          pageSize: stateToSave.pageSize,
          rowDensity: stateToSave.rowDensity,
          currentView: stateToSave.currentView,
          savedViews: stateToSave.savedViews,
          timestamp: Date.now()
        }
        
        storage.setItem(storageKey, JSON.stringify(persistedState))
      } catch (error) {
        logger.warn('Failed to persist table state:', error)
      }
    }, debounceMs),
    [storageKey, storage, version, debounceMs]
  )

  // Save state when relevant properties change
  useEffect(() => {
    saveState(state)
  }, [
    state.columns,
    state.sortConfig,
    state.filters,
    state.pageSize,
    state.rowDensity,
    state.currentView,
    state.savedViews,
    saveState
  ])

  // Clear persisted state
  const clearPersistedState = useCallback(() => {
    try {
      storage.removeItem(storageKey)
    } catch (error) {
      logger.warn('Failed to clear persisted table state:', error)
    }
  }, [storageKey, storage])

  // Export current state
  const exportState = useCallback((): string => {
    const exportData: PersistedTableState = {
      version,
      columns: state.columns,
      sortConfig: state.sortConfig,
      filters: state.filters,
      pageSize: state.pageSize,
      rowDensity: state.rowDensity,
      currentView: state.currentView,
      savedViews: state.savedViews,
      timestamp: Date.now()
    }
    
    return JSON.stringify(exportData, null, 2)
  }, [state, version])

  // Import state from JSON
  const importState = useCallback((jsonData: string): Partial<TableState<T>> | null => {
    try {
      const parsed: PersistedTableState = JSON.parse(jsonData)
      
      // Basic validation
      if (!parsed.version || !parsed.columns) {
        throw new Error('Invalid state format')
      }
      
      return {
        columns: parsed.columns,
        sortConfig: parsed.sortConfig || [],
        filters: parsed.filters || [],
        pageSize: parsed.pageSize || 25,
        rowDensity: parsed.rowDensity || 'normal',
        currentView: parsed.currentView || null,
        savedViews: parsed.savedViews || []
      }
    } catch (error) {
      console.error('Failed to import table state:', error)
      return null
    }
  }, [])

  return {
    clearPersistedState,
    exportState,
    importState
  }
}

/**
 * Hook for managing saved views
 */
export function useSavedViews<T>(
  state: TableState<T>,
  actions: {
    addSavedView: (view: SavedView) => void
    updateSavedView: (view: SavedView) => void
    deleteSavedView: (viewId: string) => void
    setCurrentView: (viewId: string | null) => void
    setSortConfig: (config: SortConfig[]) => void
    setFilters: (filters: FilterConfig[]) => void
    setColumnState: (columns: ColumnState[]) => void
  }
) {
  // Create a new saved view from current state
  const createSavedView = useCallback((name: string, description?: string): SavedView => {
    const view: SavedView = {
      id: `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      filters: [...state.filters],
      sorting: [...state.sortConfig],
      columns: [...state.columns],
      groupBy: state.groupBy || undefined,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    actions.addSavedView(view)
    return view
  }, [state, actions])

  // Apply a saved view
  const applySavedView = useCallback((view: SavedView) => {
    actions.setSortConfig(view.sorting)
    actions.setFilters(view.filters)
    actions.setColumnState(view.columns)
    actions.setCurrentView(view.id)
    
    // Apply grouping if supported
    if (view.groupBy) {
      // This would need to be implemented when grouping is added
    }
  }, [actions])

  // Update existing saved view with current state
  const updateSavedView = useCallback((viewId: string, name?: string, description?: string) => {
    const existingView = state.savedViews.find(v => v.id === viewId)
    if (!existingView) return null

    const updatedView: SavedView = {
      ...existingView,
      name: name || existingView.name,
      description: description !== undefined ? description : existingView.description,
      filters: [...state.filters],
      sorting: [...state.sortConfig],
      columns: [...state.columns],
      groupBy: state.groupBy || undefined,
      updatedAt: new Date().toISOString()
    }
    
    actions.updateSavedView(updatedView)
    return updatedView
  }, [state, actions])

  // Delete a saved view
  const deleteSavedView = useCallback((viewId: string) => {
    actions.deleteSavedView(viewId)
    
    // If this was the current view, clear it
    if (state.currentView === viewId) {
      actions.setCurrentView(null)
    }
  }, [state.currentView, actions])

  // Set default view
  const setDefaultView = useCallback((viewId: string) => {
    const updatedViews = state.savedViews.map(view => ({
      ...view,
      isDefault: view.id === viewId
    }))
    
    // Update all views to reflect new default
    updatedViews.forEach(view => {
      actions.updateSavedView(view)
    })
  }, [state.savedViews, actions])

  // Get current view
  const getCurrentView = useCallback(() => {
    return state.savedViews.find(v => v.id === state.currentView) || null
  }, [state.savedViews, state.currentView])

  // Check if current state matches a saved view
  const isCurrentStateModified = useCallback(() => {
    const currentView = getCurrentView()
    if (!currentView) return false
    
    // Compare current state with saved view
    const filtersMatch = JSON.stringify(state.filters) === JSON.stringify(currentView.filters)
    const sortingMatch = JSON.stringify(state.sortConfig) === JSON.stringify(currentView.sorting)
    const columnsMatch = JSON.stringify(state.columns) === JSON.stringify(currentView.columns)
    
    return !(filtersMatch && sortingMatch && columnsMatch)
  }, [state, getCurrentView])

  return {
    createSavedView,
    applySavedView,
    updateSavedView,
    deleteSavedView,
    setDefaultView,
    getCurrentView,
    isCurrentStateModified
  }
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}