import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { advancedSearch, SearchHistory, SearchResult } from '../utils/searchUtils'

export interface UseAdvancedSearchOptions<T> {
  items: T[]
  searchFields: (keyof T)[]
  fuzzySearch?: boolean
  debounceMs?: number
  maxResults?: number
  minScore?: number
  enableHistory?: boolean
  historySize?: number
}

export interface UseAdvancedSearchReturn<T> {
  searchTerm: string
  setSearchTerm: (term: string) => void
  results: SearchResult[]
  isSearching: boolean
  searchHistory: string[]
  clearHistory: () => void
  removeFromHistory: (term: string) => void
  hasResults: boolean
  resultCount: number
}

export function useAdvancedSearch<T>({
  items,
  searchFields,
  fuzzySearch = false,
  debounceMs = 300,
  maxResults = 50,
  minScore = 0.1,
  enableHistory = true,
  historySize = 10
}: UseAdvancedSearchOptions<T>): UseAdvancedSearchReturn<T> {
  const [searchTerm, setSearchTermState] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  
  const searchHistoryRef = useRef(new SearchHistory(historySize))
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  
  // Debounce search term
  useEffect(() => {
    setIsSearching(true)
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setIsSearching(false)
      
      // Add to history if not empty and history is enabled
      if (enableHistory && searchTerm.trim()) {
        searchHistoryRef.current.add(searchTerm.trim())
        setSearchHistory(searchHistoryRef.current.getHistory())
      }
    }, debounceMs)
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [searchTerm, debounceMs, enableHistory])
  
  // Perform search
  const results = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return []
    }
    
    return advancedSearch(items, debouncedSearchTerm, searchFields, {
      fuzzySearch,
      maxResults,
      minScore
    })
  }, [items, debouncedSearchTerm, searchFields, fuzzySearch, maxResults, minScore])
  
  // Set search term with immediate UI update
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term)
  }, [])
  
  // Clear search history
  const clearHistory = useCallback(() => {
    searchHistoryRef.current.clear()
    setSearchHistory([])
  }, [])
  
  // Remove item from search history
  const removeFromHistory = useCallback((term: string) => {
    searchHistoryRef.current.remove(term)
    setSearchHistory(searchHistoryRef.current.getHistory())
  }, [])
  
  // Initialize search history
  useEffect(() => {
    if (enableHistory) {
      setSearchHistory(searchHistoryRef.current.getHistory())
    }
  }, [enableHistory])
  
  return {
    searchTerm,
    setSearchTerm,
    results,
    isSearching,
    searchHistory,
    clearHistory,
    removeFromHistory,
    hasResults: results.length > 0,
    resultCount: results.length
  }
}