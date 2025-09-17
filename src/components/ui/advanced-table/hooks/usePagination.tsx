import { useState, useMemo, useCallback } from 'react'

interface UsePaginationProps<T> {
  data: T[]
  initialPageSize?: number
  initialPage?: number
}

interface UsePaginationReturn<T> {
  // Current state
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
  
  // Paginated data
  paginatedData: T[]
  
  // Actions
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  nextPage: () => void
  previousPage: () => void
  firstPage: () => void
  lastPage: () => void
  
  // Computed values
  hasNextPage: boolean
  hasPreviousPage: boolean
  startItem: number
  endItem: number
  
  // Utilities
  getPageInfo: () => {
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
    startItem: number
    endItem: number
  }
}

export function usePagination<T>({
  data,
  initialPageSize = 25,
  initialPage = 1
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / pageSize)
  }, [data.length, pageSize])

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, pageSize])

  // Calculate item range
  const startItem = useMemo(() => {
    return data.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  }, [currentPage, pageSize, data.length])

  const endItem = useMemo(() => {
    return Math.min(currentPage * pageSize, data.length)
  }, [currentPage, pageSize, data.length])

  // Navigation helpers
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  // Actions
  const setPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }, [totalPages])

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size)
    // Adjust current page to maintain roughly the same position
    const currentFirstItem = (currentPage - 1) * pageSize + 1
    const newPage = Math.ceil(currentFirstItem / size)
    setCurrentPage(Math.max(1, Math.min(newPage, Math.ceil(data.length / size))))
  }, [currentPage, pageSize, data.length])

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasNextPage])

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1)
    }
  }, [hasPreviousPage])

  const firstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const lastPage = useCallback(() => {
    setCurrentPage(totalPages)
  }, [totalPages])

  const getPageInfo = useCallback(() => ({
    currentPage,
    pageSize,
    totalPages,
    totalItems: data.length,
    startItem,
    endItem
  }), [currentPage, pageSize, totalPages, data.length, startItem, endItem])

  return {
    // Current state
    currentPage,
    pageSize,
    totalPages,
    totalItems: data.length,
    
    // Paginated data
    paginatedData,
    
    // Actions
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    
    // Computed values
    hasNextPage,
    hasPreviousPage,
    startItem,
    endItem,
    
    // Utilities
    getPageInfo
  }
}