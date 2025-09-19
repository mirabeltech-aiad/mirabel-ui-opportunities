import { useState, useCallback } from 'react'
import { SortConfig } from '../types/sortPresets'
import { 
  convertPresetToSortConfig, 
  shouldClearPreset,
  isCustomSort 
} from '../utils/sortUtils'

export interface UseSortStateReturn {
  activePresetId: string | null
  currentSort: SortConfig[]
  isCustomSort: boolean
  setPreset: (presetId: string | null) => void
  setCustomSort: (sortConfig: SortConfig[]) => void
  reset: () => void
}

export const useSortState = (
  initialPresetId: string | null = null,
  initialCustomSort: SortConfig[] = []
): UseSortStateReturn => {
  const [activePresetId, setActivePresetId] = useState<string | null>(initialPresetId)
  const [customSort, setCustomSortState] = useState<SortConfig[]>(initialCustomSort)

  const setPreset = useCallback((presetId: string | null) => {
    setActivePresetId(presetId)
    setCustomSortState([]) // Clear custom sort when preset is selected
  }, [])

  const setCustomSort = useCallback((sortConfig: SortConfig[]) => {
    setCustomSortState(sortConfig)
    
    // Clear preset if custom sort conflicts with it
    if (shouldClearPreset(sortConfig, activePresetId)) {
      setActivePresetId(null)
    }
  }, [activePresetId])

  const reset = useCallback(() => {
    setActivePresetId(null)
    setCustomSortState([])
  }, [])

  const getCurrentSort = useCallback((): SortConfig[] => {
    if (customSort.length > 0) {
      return customSort
    }
    return convertPresetToSortConfig(activePresetId)
  }, [customSort, activePresetId])

  const isCustomSortActive = isCustomSort(getCurrentSort(), activePresetId)

  return {
    activePresetId,
    currentSort: getCurrentSort(),
    isCustomSort: isCustomSortActive,
    setPreset,
    setCustomSort,
    reset
  }
}