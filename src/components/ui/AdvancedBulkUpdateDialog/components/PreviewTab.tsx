import React from 'react'
import { Button } from '../../button'
import { CheckCircle, Eye } from 'lucide-react'

interface PreviewTabProps {
  preview: any[]
  affectedItemsCount: number
  onExecuteUpdate: () => void
}

export const PreviewTab: React.FC<PreviewTabProps> = ({
  preview,
  affectedItemsCount,
  onExecuteUpdate
}) => {
  if (preview.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No preview available. Configure fields and click "Preview Changes".</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          Changes Preview ({affectedItemsCount} items affected)
        </h3>
        <Button onClick={onExecuteUpdate} size="sm">
          <CheckCircle className="h-4 w-4 mr-2" />
          Apply Changes
        </Button>
      </div>
      <div className="text-center py-4 text-gray-500">
        Preview functionality will be implemented
      </div>
    </div>
  )
}