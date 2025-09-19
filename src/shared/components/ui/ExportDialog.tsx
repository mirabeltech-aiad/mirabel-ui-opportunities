import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { FloatingLabelSelect } from './FloatingLabelSelect'
import { Checkbox } from './checkbox'
import { Progress } from './progress'
import { Alert, AlertDescription } from './alert'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Database,
  X,
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useDataExport, ExportFormat, ExportScope } from '@/shared/hooks/useDataExport'
import { Product } from '@/shared/types/product'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  data: Product[]
  filteredData: Product[]
  selectedData: Product[]
  availableColumns: Array<{ key: string; label: string }>
}

const formatIcons: Record<ExportFormat, React.ComponentType<{ className?: string }>> = {
  csv: FileText,
  excel: FileSpreadsheet,
  pdf: FileImage,
  json: Database
}

const formatLabels: Record<ExportFormat, string> = {
  csv: 'CSV (Comma Separated)',
  excel: 'Excel Spreadsheet',
  pdf: 'PDF Document',
  json: 'JSON Data'
}

const scopeLabels: Record<ExportScope, string> = {
  all: 'All Data',
  filtered: 'Filtered Data',
  selected: 'Selected Rows'
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  data,
  filteredData,
  selectedData,
  availableColumns
}) => {
  const [format, setFormat] = useState<ExportFormat>('csv')
  const [scope, setScope] = useState<ExportScope>('filtered')
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    availableColumns.map(col => col.key)
  )
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [focusedColumnIndex, setFocusedColumnIndex] = useState<number>(-1)
  const [showFileSizeWarning, setShowFileSizeWarning] = useState(false)

  const { exportData, quickExport, retryExport, progress, cancelExport, error, clearError } = useDataExport()
  const columnGridRef = useRef<HTMLDivElement>(null)
  const progressAnnouncementRef = useRef<HTMLDivElement>(null)

  const getDataForScope = (scope: ExportScope): Product[] => {
    switch (scope) {
      case 'all': return data || []
      case 'filtered': return filteredData || []
      case 'selected': return selectedData || []
      default: return filteredData || []
    }
  }

  const getRecordCount = (scope: ExportScope): number => {
    const scopeData = getDataForScope(scope)
    return scopeData ? scopeData.length : 0
  }

  // Estimate file size based on data and format
  const estimateFileSize = useCallback((scope: ExportScope, format: ExportFormat, columns: string[]): number => {
    const recordCount = getRecordCount(scope)
    if (recordCount === 0) return 0

    // Average bytes per field (rough estimates)
    const avgFieldSize = {
      name: 50,
      type: 20,
      sku: 15,
      category: 25,
      basePrice: 10,
      currency: 5,
      isActive: 8,
      isFeatured: 8,
      createdAt: 25,
      updatedAt: 25
    }

    // Calculate average row size
    const avgRowSize = columns.reduce((total, col) => {
      return total + (avgFieldSize[col as keyof typeof avgFieldSize] || 30)
    }, 0)

    // Add overhead for separators, quotes, etc.
    const formatMultiplier = {
      csv: 1.2,
      json: 2.5,
      excel: 1.8,
      pdf: 3.0
    }

    const estimatedSize = recordCount * avgRowSize * formatMultiplier[format]
    return Math.round(estimatedSize)
  }, [getRecordCount])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Check for large file size and show warning
  useEffect(() => {
    const estimatedSize = estimateFileSize(scope, format, selectedColumns)
    const shouldWarn = estimatedSize > 50 * 1024 * 1024 // 50MB threshold
    setShowFileSizeWarning(shouldWarn)
  }, [scope, format, selectedColumns, estimateFileSize])

  // Quick export handler for casual users
  const handleQuickExport = async () => {
    clearError()
    const exportDataSet = getDataForScope('filtered') // Always use filtered data for quick export
    
    if (exportDataSet.length === 0) {
      return
    }

    await quickExport(exportDataSet, 'csv')
  }

  // Check if dataset is large enough to warrant chunking warnings
  const isLargeDataset = getRecordCount(scope) > 10000
  const isVeryLargeDataset = getRecordCount(scope) > 50000

  const handleExport = async () => {
    clearError()
    const exportDataSet = getDataForScope(scope)
    
    if (exportDataSet.length === 0) {
      return
    }

    await exportData(exportDataSet, {
      format,
      scope,
      selectedColumns: selectedColumns.length > 0 ? selectedColumns : undefined,
      includeHeaders
    })
  }

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    )
  }

  const handleSelectAllColumns = () => {
    setSelectedColumns(availableColumns.map(col => col.key))
  }

  const handleDeselectAllColumns = () => {
    setSelectedColumns([])
  }

  // Keyboard navigation for column grid
  const handleColumnGridKeyDown = useCallback((e: React.KeyboardEvent) => {
    const columnCount = availableColumns.length
    const columnsPerRow = 2 // Based on grid-cols-2
    const currentRow = Math.floor(focusedColumnIndex / columnsPerRow)
    const currentCol = focusedColumnIndex % columnsPerRow
    
    let newIndex = focusedColumnIndex

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        newIndex = Math.min(focusedColumnIndex + columnsPerRow, columnCount - 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        newIndex = Math.max(focusedColumnIndex - columnsPerRow, 0)
        break
      case 'ArrowRight':
        e.preventDefault()
        if (currentCol < columnsPerRow - 1 && focusedColumnIndex < columnCount - 1) {
          newIndex = focusedColumnIndex + 1
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (currentCol > 0) {
          newIndex = focusedColumnIndex - 1
        }
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = columnCount - 1
        break
      case ' ':
      case 'Enter':
        e.preventDefault()
        if (focusedColumnIndex >= 0 && focusedColumnIndex < columnCount) {
          const column = availableColumns[focusedColumnIndex]
          handleColumnToggle(column.key)
        }
        break
      default:
        return
    }

    setFocusedColumnIndex(newIndex)
    
    // Focus the checkbox element
    const checkboxes = columnGridRef.current?.querySelectorAll('input[type="checkbox"]')
    if (checkboxes && checkboxes[newIndex]) {
      (checkboxes[newIndex] as HTMLElement).focus()
    }
  }, [focusedColumnIndex, availableColumns, handleColumnToggle])

  // Update progress announcements for screen readers
  useEffect(() => {
    if (progressAnnouncementRef.current && progress.message) {
      progressAnnouncementRef.current.textContent = `${progress.message} ${progress.progress}% complete`
    }
  }, [progress.message, progress.progress])

  const canExport = !progress.isExporting && getRecordCount(scope) > 0 && selectedColumns.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl"
        aria-describedby="export-dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" aria-hidden="true" />
            Export Products Data
          </DialogTitle>
          <div id="export-dialog-description" className="text-sm text-gray-600">
            Configure and export your product data in various formats. Use keyboard navigation 
            in the column selection grid with arrow keys.
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Export for Casual Users */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Quick Export
                </h3>
                <p className="text-xs text-blue-700">
                  Export filtered data as CSV with all columns - perfect for most use cases
                </p>
              </div>
              <Button
                onClick={handleQuickExport}
                disabled={filteredData.length === 0 || progress.isExporting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Quick Export CSV
              </Button>
            </div>
          </div>

          {/* Advanced Options Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Advanced Export Options</span>
            </div>
          </div>

          {/* Export Format */}
          <div className="space-y-3">
            <FloatingLabelSelect
              label="Export Format"
              value={format}
              onChange={(value) => setFormat(value as ExportFormat)}
              options={(Object.keys(formatIcons) as ExportFormat[]).map((fmt) => {
                const Icon = formatIcons[fmt]
                return {
                  value: fmt,
                  label: formatLabels[fmt],
                  icon: <Icon className="h-4 w-4" />
                }
              })}
              placeholder="Select format"
              modal
              searchable
            />
          </div>

          {/* Data Scope */}
          <div className="space-y-3">
            <FloatingLabelSelect
              label="Data to Export"
              value={scope}
              onChange={(value) => setScope(value as ExportScope)}
              options={[
                {
                  value: 'all',
                  label: `All Data (${data.length} records)`,
                  description: 'Export all available data'
                },
                {
                  value: 'filtered',
                  label: `Filtered Data (${filteredData.length} records)`,
                  description: 'Export currently filtered data'
                },
                {
                  value: 'selected',
                  label: `Selected Rows (${selectedData.length} records)${selectedData.length === 0 ? ' - No rows selected' : ''}`,
                  description: 'Export only selected rows',
                  disabled: selectedData.length === 0
                }
              ]}
              placeholder="Select data scope"
              modal
            />
            <div className="text-xs text-gray-500">
              Choose which subset of data to include in the export
            </div>
          </div>

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label 
                id="column-selection-label"
                className="text-sm font-medium text-gray-700"
              >
                Columns to Include ({selectedColumns.length} selected)
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllColumns}
                  aria-describedby="column-selection-label"
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAllColumns}
                  aria-describedby="column-selection-label"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div 
              ref={columnGridRef}
              className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3"
              role="grid"
              aria-labelledby="column-selection-label"
              aria-describedby="column-selection-help"
              onKeyDown={handleColumnGridKeyDown}
              tabIndex={0}
            >
              {availableColumns.map((column, index) => (
                <label
                  key={column.key}
                  className={`flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded ${
                    focusedColumnIndex === index ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                  }`}
                  role="gridcell"
                  aria-selected={selectedColumns.includes(column.key)}
                >
                  <Checkbox
                    checked={selectedColumns.includes(column.key)}
                    onCheckedChange={() => handleColumnToggle(column.key)}
                    onFocus={() => setFocusedColumnIndex(index)}
                    aria-describedby={`column-${column.key}-desc`}
                  />
                  <span className="text-sm" id={`column-${column.key}-desc`}>
                    {column.label}
                  </span>
                </label>
              ))}
            </div>
            <div id="column-selection-help" className="text-xs text-gray-500">
              Use arrow keys to navigate, Space or Enter to toggle selection
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label id="options-label" className="text-sm font-medium text-ocean-600">
              Export Options
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={includeHeaders}
                onCheckedChange={(checked) => setIncludeHeaders(!!checked)}
                aria-describedby="headers-option-desc"
              />
              <span className="text-sm" id="headers-option-desc">
                Include column headers in the exported file
              </span>
            </label>
          </div>

          {/* Large Dataset and File Size Warnings */}
          {(showFileSizeWarning || isLargeDataset || isVeryLargeDataset) && !progress.isExporting && (
            <div className="space-y-3">
              {/* Very Large Dataset Warning */}
              {isVeryLargeDataset && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Very Large Dataset:</strong> You're exporting {getRecordCount(scope).toLocaleString()} records. 
                    This will be processed in chunks of 5,000 records for optimal performance. 
                    Consider using filters to reduce the dataset size or export in smaller batches.
                  </AlertDescription>
                </Alert>
              )}

              {/* Large Dataset Info */}
              {isLargeDataset && !isVeryLargeDataset && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Large Dataset:</strong> Exporting {getRecordCount(scope).toLocaleString()} records. 
                    This will be processed in optimized chunks for better performance.
                  </AlertDescription>
                </Alert>
              )}

              {/* File Size Warning */}
              {showFileSizeWarning && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Large File Warning:</strong> Estimated file size: {formatFileSize(estimateFileSize(scope, format, selectedColumns))}. 
                    Large files may cause browser performance issues. Consider reducing columns or using CSV format for better performance.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Progress */}
          {progress.isExporting && (
            <div className="space-y-2" role="status" aria-live="polite">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{progress.message}</span>
                <span className="text-sm font-medium">{progress.progress}%</span>
              </div>
              <Progress 
                value={progress.progress} 
                className="h-2"
                aria-label={`Export progress: ${progress.progress}% complete`}
              />
            </div>
          )}

          {/* Screen reader announcements */}
          <div 
            ref={progressAnnouncementRef}
            className="sr-only" 
            aria-live="polite" 
            aria-atomic="true"
          />

          {/* Error with Retry Option */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Export Failed:</strong> {error}
                    {progress.retryCount > 0 && (
                      <span className="block text-xs mt-1">
                        Retry attempt {progress.retryCount} of 3
                      </span>
                    )}
                  </div>
                  {progress.canRetry && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retryExport}
                      className="ml-3 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Retry Export
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Success */}
          {progress.progress === 100 && !progress.isExporting && !error && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{progress.message}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-500" aria-live="polite">
              {getRecordCount(scope).toLocaleString()} records • {selectedColumns.length} columns
              {isLargeDataset && (
                <span className="text-blue-600 font-medium ml-2">
                  • Chunked processing
                </span>
              )}
              {showFileSizeWarning && (
                <span className="text-orange-600 font-medium ml-2">
                  • Large file warning
                </span>
              )}
              {progress.retryCount > 0 && (
                <span className="text-red-600 font-medium ml-2">
                  • Retry {progress.retryCount}/3
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {progress.isExporting && progress.canCancel && (
                <Button 
                  variant="outline" 
                  onClick={cancelExport}
                  aria-describedby="cancel-export-desc"
                >
                  <X className="h-4 w-4 mr-2" aria-hidden="true" />
                  Cancel
                  <span id="cancel-export-desc" className="sr-only">
                    Cancel the current export operation
                  </span>
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={onClose} 
                disabled={progress.isExporting}
                aria-describedby="close-dialog-desc"
              >
                Close
                <span id="close-dialog-desc" className="sr-only">
                  Close the export dialog without exporting
                </span>
              </Button>
              <Button 
                onClick={handleExport} 
                disabled={!canExport}
                className="bg-blue-600 hover:bg-blue-700"
                aria-describedby="export-button-desc"
              >
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                Export {formatLabels[format]}
                <span id="export-button-desc" className="sr-only">
                  Export {getRecordCount(scope)} records in {formatLabels[format]} format
                  {showFileSizeWarning ? '. Warning: Large file size expected.' : ''}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}