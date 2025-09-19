import React, { useState } from 'react'
import { Button } from '../../button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../dialog'
import { BulkActionConfig } from '../types'
import { 
  Trash2, 
  Download, 
  Edit, 
  Archive, 
  Copy, 
  Tag, 
  MoreHorizontal,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface BulkActionsProps<T> {
  selectedCount: number
  totalCount: number
  selectedData: T[]
  actions?: BulkActionConfig[]
  onAction: (actionId: string, data: T[]) => void
  className?: string
}

const BulkActions = <T extends Record<string, any>>({
  selectedCount,
  totalCount,
  selectedData,
  actions = [],
  onAction,
  className = ''
}: BulkActionsProps<T>) => {
  const [confirmAction, setConfirmAction] = useState<BulkActionConfig | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Default bulk actions
  const defaultActions: BulkActionConfig[] = [
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationMessage: `Are you sure you want to delete ${selectedCount} item${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      variant: 'outline'
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <Copy className="h-4 w-4" />,
      variant: 'outline'
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: <Archive className="h-4 w-4" />,
      variant: 'outline',
      requiresConfirmation: true,
      confirmationMessage: `Archive ${selectedCount} item${selectedCount > 1 ? 's' : ''}?`
    }
  ]

  // Combine default and custom actions
  const allActions = [...defaultActions, ...actions]

  // Handle action click
  const handleActionClick = (action: BulkActionConfig) => {
    if (action.requiresConfirmation) {
      setConfirmAction(action)
    } else {
      executeAction(action)
    }
  }

  // Execute action
  const executeAction = async (action: BulkActionConfig) => {
    setIsProcessing(true)
    try {
      await onAction(action.id, selectedData)
    } finally {
      setIsProcessing(false)
      setConfirmAction(null)
    }
  }

  // Get action button variant
  const getButtonVariant = (variant?: string) => {
    switch (variant) {
      case 'destructive': return 'destructive'
      case 'outline': return 'outline'
      default: return 'default'
    }
  }

  if (selectedCount === 0) {
    return null
  }

  return (
    <>
      <div className={`flex items-center gap-3 p-4 bg-ocean-50 border border-ocean-200 rounded-lg ${className}`}>
        {/* Selection info */}
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-ocean-600" />
          <span className="font-medium text-ocean-800">
            {selectedCount} of {totalCount} selected
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Primary actions (first 3) */}
          {allActions.slice(0, 3).map((action) => (
            <Button
              key={action.id}
              variant={getButtonVariant(action.variant)}
              size="sm"
              onClick={() => handleActionClick(action)}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}

          {/* More actions dropdown */}
          {allActions.length > 3 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                disabled={isProcessing}
              >
                <MoreHorizontal className="h-4 w-4" />
                More
              </Button>
              {/* TODO: Implement dropdown menu for additional actions */}
            </div>
          )}

          {/* Clear selection */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('clear-selection', [])}
            disabled={isProcessing}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear
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
    </>
  )
}

export default BulkActions