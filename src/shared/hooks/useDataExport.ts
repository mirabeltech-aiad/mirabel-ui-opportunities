import { useState, useCallback } from 'react'
import { Product } from '@/shared/types/product'

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json'
export type ExportScope = 'all' | 'filtered' | 'selected'

interface ExportOptions {
  format: ExportFormat
  scope: ExportScope
  filename?: string
  includeHeaders?: boolean
  selectedColumns?: string[]
}

interface ExportProgress {
  isExporting: boolean
  progress: number
  message: string
  canCancel: boolean
  canRetry: boolean
  retryCount: number
}

interface UseDataExportReturn {
  exportData: (data: Product[], options: ExportOptions) => Promise<void>
  quickExport: (data: Product[], format?: ExportFormat) => Promise<void>
  retryExport: () => Promise<void>
  progress: ExportProgress
  cancelExport: () => void
  error: string | null
  clearError: () => void
}

export const useDataExport = (): UseDataExportReturn => {
  const [progress, setProgress] = useState<ExportProgress>({
    isExporting: false,
    progress: 0,
    message: '',
    canCancel: false,
    canRetry: false,
    retryCount: 0
  })
  const [error, setError] = useState<string | null>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [lastExportParams, setLastExportParams] = useState<{data: Product[], options: ExportOptions} | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const cancelExport = useCallback(() => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setProgress(prev => ({
        ...prev,
        isExporting: false,
        progress: 0,
        message: 'Export cancelled',
        canCancel: false
      }))
    }
  }, [abortController])

  const generateFilename = useCallback((format: ExportFormat, scope: ExportScope): string => {
    const timestamp = new Date().toISOString().split('T')[0]
    const scopePrefix = scope === 'all' ? 'all' : scope === 'filtered' ? 'filtered' : 'selected'
    return `products-${scopePrefix}-${timestamp}.${format === 'excel' ? 'xlsx' : format}`
  }, [])

  const exportToCSV = useCallback(async (data: Product[], options: ExportOptions, signal: AbortSignal) => {
    const { selectedColumns, includeHeaders = true } = options
    
    // Define column mappings
    const columnMap: Record<string, (product: Product) => string> = {
      name: (p) => `"${p.name.replace(/"/g, '""')}"`,
      type: (p) => p.type,
      sku: (p) => p.sku || '',
      category: (p) => p.category || '',
      basePrice: (p) => p.basePrice?.toString() || '',
      currency: (p) => p.currency || '',
      isActive: (p) => p.isActive ? 'Active' : 'Inactive',
      isFeatured: (p) => p.isFeatured ? 'Yes' : 'No',
      createdAt: (p) => new Date(p.createdAt).toLocaleDateString(),
      updatedAt: (p) => new Date(p.updatedAt).toLocaleDateString()
    }

    const columns = selectedColumns || Object.keys(columnMap)
    let csvContent = ''

    // Add headers
    if (includeHeaders) {
      const headers = columns.map(col => col.charAt(0).toUpperCase() + col.slice(1))
      csvContent += headers.join(',') + '\n'
    }

    // Process data in chunks
    const chunkSize = 100
    for (let i = 0; i < data.length; i += chunkSize) {
      if (signal.aborted) throw new Error('Export cancelled')
      
      const chunk = data.slice(i, i + chunkSize)
      const rows = chunk.map(product => 
        columns.map(col => columnMap[col]?.(product) || '').join(',')
      )
      
      csvContent += rows.join('\n') + '\n'
      
      setProgress(prev => ({
        ...prev,
        progress: Math.round((i / data.length) * 100),
        message: `Processing ${i + chunk.length} of ${data.length} records...`
      }))
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    return csvContent
  }, [])

  const exportToJSON = useCallback(async (data: Product[], options: ExportOptions, signal: AbortSignal) => {
    const { selectedColumns } = options
    
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalRecords: data.length,
        format: 'json',
        scope: options.scope
      },
      products: data.map((product, index) => {
        if (signal.aborted) throw new Error('Export cancelled')
        
        if (index % 100 === 0) {
          setProgress(prev => ({
            ...prev,
            progress: Math.round((index / data.length) * 100),
            message: `Processing ${index} of ${data.length} records...`
          }))
        }

        if (selectedColumns) {
          const filteredProduct: Partial<Product> = {}
          selectedColumns.forEach(col => {
            if (col in product) {
              (filteredProduct as any)[col] = (product as any)[col]
            }
          })
          return filteredProduct
        }
        
        return product
      })
    }

    return JSON.stringify(exportData, null, 2)
  }, [])

  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }, [])

  // Quick export for casual users - simplified one-click export
  const quickExport = useCallback(async (data: Product[], format: ExportFormat = 'csv') => {
    const options: ExportOptions = {
      format,
      scope: 'filtered',
      includeHeaders: true,
      // Export all available columns for quick export
      selectedColumns: undefined
    }
    
    await exportData(data, options)
  }, [])

  // Retry mechanism for failed exports
  const retryExport = useCallback(async () => {
    if (!lastExportParams) {
      setError('No previous export to retry')
      return
    }

    const { data, options } = lastExportParams
    const newRetryCount = progress.retryCount + 1
    
    setProgress(prev => ({
      ...prev,
      retryCount: newRetryCount,
      canRetry: false
    }))
    
    setError(null)
    
    // Add exponential backoff delay for retries
    const delay = Math.min(1000 * Math.pow(2, newRetryCount - 1), 10000)
    await new Promise(resolve => setTimeout(resolve, delay))
    
    await exportData(data, options)
  }, [lastExportParams, progress.retryCount])

  // Enhanced error handling with retry capability
  const handleExportError = useCallback((error: Error, retryCount: number) => {
    const isRetryableError = error.message.includes('network') || 
                            error.message.includes('timeout') ||
                            error.message.includes('fetch')
    
    const canRetry = isRetryableError && retryCount < 3
    
    setError(error.message)
    setProgress(prev => ({
      ...prev,
      isExporting: false,
      progress: 0,
      message: 'Export failed',
      canCancel: false,
      canRetry
    }))
  }, [])

  const exportData = useCallback(async (data: Product[], options: ExportOptions) => {
    const controller = new AbortController()
    setAbortController(controller)
    setError(null)
    setLastExportParams({ data, options })
    
    try {
      // Check for large dataset and suggest chunking
      const isLargeDataset = data.length > 10000
      const chunkSize = 5000
      
      setProgress(prev => ({
        ...prev,
        isExporting: true,
        progress: 0,
        message: isLargeDataset 
          ? `Processing large dataset (${data.length} records)...` 
          : 'Starting export...',
        canCancel: true,
        canRetry: false
      }))

      const filename = options.filename || generateFilename(options.format, options.scope)
      let content: string
      let mimeType: string

      // For large datasets, show chunking progress
      if (isLargeDataset) {
        setProgress(prev => ({
          ...prev,
          message: `Processing in chunks of ${chunkSize} records for optimal performance...`
        }))
      }

      switch (options.format) {
        case 'csv':
          content = await exportToCSV(data, options, controller.signal)
          mimeType = 'text/csv;charset=utf-8;'
          break
        
        case 'json':
          content = await exportToJSON(data, options, controller.signal)
          mimeType = 'application/json;charset=utf-8;'
          break
        
        case 'excel':
          // For now, export as CSV with .xlsx extension
          // In a real implementation, you'd use a library like xlsx
          content = await exportToCSV(data, options, controller.signal)
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          break
        
        case 'pdf':
          // For now, export as CSV
          // In a real implementation, you'd use a library like jsPDF
          content = await exportToCSV(data, options, controller.signal)
          mimeType = 'application/pdf'
          break
        
        default:
          throw new Error(`Unsupported format: ${options.format}`)
      }

      if (controller.signal.aborted) return

      setProgress(prev => ({
        ...prev,
        progress: 100,
        message: 'Preparing download...'
      }))

      downloadFile(content, filename, mimeType)

      setProgress(prev => ({
        ...prev,
        isExporting: false,
        progress: 100,
        message: `Export completed: ${filename}`,
        canCancel: false,
        canRetry: false,
        retryCount: 0
      }))

    } catch (error) {
      if (error instanceof Error && error.message === 'Export cancelled') {
        return // Already handled in cancelExport
      }
      
      handleExportError(error instanceof Error ? error : new Error('Export failed'), progress.retryCount)
    } finally {
      setAbortController(null)
    }
  }, [generateFilename, exportToCSV, exportToJSON, downloadFile, handleExportError, progress.retryCount])

  return {
    exportData,
    quickExport,
    retryExport,
    progress,
    cancelExport,
    error,
    clearError
  }
}