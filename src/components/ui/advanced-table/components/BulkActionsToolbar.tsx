import { logger } from '../../../shared/logger'

import React, { useState } from 'react'
import { Button } from '../../button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../dialog'
import { ProductBulkUpdateDialog } from '../../ProductBulkUpdateDialog'
import { ScheduleBulkUpdateDialog } from '../../AdvancedBulkUpdateDialog'
import { Product } from '../../../shared/types/product'

import {
  Trash2,
  Download,
  Edit,
  AlertTriangle,
  X,
  FileText,
  Printer,
  Settings,
  RotateCcw
} from 'lucide-react'

interface BulkAction {
  id: string
  label: string
  icon: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  requiresConfirmation?: boolean
  confirmationMessage?: string
  requiresInput?: boolean
  inputType?: 'text' | 'select' | 'date'
  inputOptions?: { value: string; label: string }[]
  inputPlaceholder?: string
}

interface BulkActionsToolbarProps<T> {
  selectedCount: number
  totalCount: number
  selectedData: T[]
  onAction: (actionId: string, data: T[], inputValue?: string) => void
  onClearSelection: () => void
  customActions?: BulkAction[]
  className?: string
  context?: 'products' | 'schedules' // Add context to determine which dialog to use
}

const BulkActionsToolbar = <T extends Record<string, any>>({
  selectedCount,
  totalCount,
  selectedData,
  onAction,
  onClearSelection,
  customActions = [],
  context = 'products', // Default to products
  className = ''
}: BulkActionsToolbarProps<T>) => {
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null)
  const [inputAction, setInputAction] = useState<BulkAction | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAdvancedUpdate, setShowAdvancedUpdate] = useState(false)
  const [showLargeSelectionWarning, setShowLargeSelectionWarning] = useState(false)
  // Check for large selection and show warning
  React.useEffect(() => {
    setShowLargeSelectionWarning(selectedCount > 1000)
  }, [selectedCount])

  // Default bulk actions matching the image design
  const defaultActions: BulkAction[] = [
    {
      id: 'export',
      label: 'Export',
      icon: <FileText className="h-4 w-4" />,
      variant: 'default'
    },

    {
      id: 'batch-update',
      label: 'Batch Update',
      icon: <Settings className="h-4 w-4" />,
      variant: 'default'
    },

    {
      id: 'print',
      label: 'Print',
      icon: <Printer className="h-4 w-4" />,
      variant: 'default'
    },

    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationMessage: `Are you sure you want to delete ${selectedCount} item${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`
    }
  ]

  // Combine default and custom actions
  const allActions = [...defaultActions, ...customActions]

  // Handle action click
  const handleActionClick = (action: BulkAction) => {
    // Special handling for batch update
    if (action.id === 'batch-update') {
      setShowAdvancedUpdate(true)
      return
    }

    if (action.requiresInput) {
      setInputAction(action)
      setInputValue('')
    } else if (action.requiresConfirmation) {
      setConfirmAction(action)
    } else {
      executeAction(action)
    }
  }

  // Execute action
  const executeAction = async (action: BulkAction, inputVal?: string) => {
    setIsProcessing(true)
    try {
      await onAction(action.id, selectedData, inputVal)
    } finally {
      setIsProcessing(false)
      setConfirmAction(null)
      setInputAction(null)
      setInputValue('')
    }
  }

  // Get action button variant
  const getButtonVariant = (variant?: string) => {
    switch (variant) {
      case 'destructive': return 'destructive'
      case 'outline': return 'outline'
      case 'secondary': return 'secondary'
      default: return 'default'
    }
  }

  if (selectedCount === 0) {
    return null
  }

  return (
    <>
      {/* Large Selection Warning */}
      {showLargeSelectionWarning && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-2">
          <div className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">
              <strong>Large Selection:</strong> {selectedCount.toLocaleString()} items selected.
              Operations will be processed in chunks for optimal performance.
            </span>
          </div>
        </div>
      )}

      {/* Bulk actions toolbar positioned above table */}
      <div className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
        <div className="flex items-center justify-between">
          {/* Left side - Selection info and actions */}
          <div className="flex items-center gap-3">
            {/* Selection count */}
            <span className="text-sm text-gray-600">
              {selectedCount.toLocaleString()} of {totalCount.toLocaleString()} selected
              {showLargeSelectionWarning && (
                <span className="text-orange-600 ml-2">• Large dataset</span>
              )}
            </span>

            {/* Action buttons with specific colors matching the image */}
            <div className="flex items-center gap-2">
              {/* Export - Light Green/Teal */}
              <Button
                size="sm"
                onClick={() => handleActionClick(allActions.find(a => a.id === 'export')!)}
                disabled={isProcessing}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-200 flex items-center gap-2 px-3 py-1.5 text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                Export
              </Button>



              {/* Batch Update - Dark Blue */}
              <Button
                size="sm"
                onClick={() => handleActionClick(allActions.find(a => a.id === 'batch-update')!)}
                disabled={isProcessing}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-200 flex items-center gap-2 px-3 py-1.5 text-sm font-medium"
              >
                <Settings className="h-4 w-4" />
                Batch Update
              </Button>



              {/* Print - Light Orange */}
              <Button
                size="sm"
                onClick={() => handleActionClick(allActions.find(a => a.id === 'print')!)}
                disabled={isProcessing}
                className="bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-200 flex items-center gap-2 px-3 py-1.5 text-sm font-medium"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>


            </div>
          </div>

          {/* Right side - Clear selection */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Confirmation dialog */}
      {confirmAction && (
        <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Confirm Action
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-gray-700">
                {confirmAction.confirmationMessage || `Are you sure you want to ${confirmAction.label.toLowerCase()} the selected items?`}
              </p>

              {confirmAction.variant === 'destructive' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>Warning:</strong> This action cannot be undone.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmAction(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant={getButtonVariant(confirmAction.variant)}
                onClick={() => executeAction(confirmAction)}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  confirmAction.icon
                )}
                {isProcessing ? 'Processing...' : confirmAction.label}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Input dialog */}
      {inputAction && (
        <Dialog open={!!inputAction} onOpenChange={() => setInputAction(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {inputAction.icon}
                {inputAction.label}
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-gray-700 mb-4">
                {inputAction.label} for {selectedCount} selected item{selectedCount > 1 ? 's' : ''}
              </p>

              {inputAction.inputType === 'select' ? (
                <Select value={inputValue} onValueChange={setInputValue}>
                  <SelectTrigger>
                    <SelectValue placeholder={inputAction.inputPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {inputAction.inputOptions?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <input
                  type={inputAction.inputType || 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputAction.inputPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setInputAction(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={() => executeAction(inputAction, inputValue)}
                disabled={isProcessing || !inputValue}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  inputAction.icon
                )}
                {isProcessing ? 'Processing...' : inputAction.label}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Batch Update Dialog - Context-aware */}
      {showAdvancedUpdate && context === 'products' && (
        <ProductBulkUpdateDialog
          isOpen={showAdvancedUpdate}
          onClose={() => setShowAdvancedUpdate(false)}
          selectedItems={selectedData as unknown as Product[]}
          onSuccess={(result) => {
            logger.log('Product batch update completed:', result)
            onAction('batch-update-completed', selectedData, String(result))
          }}
        />
      )}

      {showAdvancedUpdate && context === 'schedules' && (
        <ScheduleBulkUpdateDialog
          isOpen={showAdvancedUpdate}
          onClose={() => setShowAdvancedUpdate(false)}
          selectedItems={selectedData}
          onSuccess={(result) => {
            logger.log('Schedule batch update completed:', result)
            onAction('batch-update-completed', selectedData, String(result))
          }}
        />
      )}

    </>
  )
}

export { BulkActionsToolbar }
export default BulkActionsToolbar