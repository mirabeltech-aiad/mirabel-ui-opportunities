import React, { useMemo } from 'react'
import { Alert, AlertDescription } from '../../alert'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { FieldUpdate } from '../types'
import { PRODUCT_FIELDS } from '../constants/productFields'

interface PreviewTabProps {
  enabledUpdates: FieldUpdate[]
  selectedItemsCount: number
}

/**
 * Preview tab component showing changes that will be applied
 */
export const PreviewTab: React.FC<PreviewTabProps> = React.memo(({
  enabledUpdates,
  selectedItemsCount
}) => {
  const getOperationDescription = useMemo(() => (update: FieldUpdate): string => {
    switch (update.operation) {
      case 'set':
        return `Set to: ${update.value}`
      case 'prepend':
        return `Prepend: ${update.value}`
      case 'append':
        return `Append: ${update.value}`
      case 'find-replace':
        return `Replace "${update.findText}" with "${update.replaceText}"`
      case 'uppercase':
        return 'Convert to UPPERCASE'
      case 'lowercase':
        return 'Convert to lowercase'
      case 'title-case':
        return 'Convert to Title Case'
      case 'trim':
        return 'Trim whitespace'
      case 'clear':
        return 'Clear field'
      case 'increase':
        return `Increase by: ${update.value}`
      case 'decrease':
        return `Decrease by: ${update.value}`
      case 'multiply':
        return `Multiply by: ${update.value}`
      case 'percentage':
        return `Change by: ${update.value}%`
      case 'add':
        return `Add tags: ${Array.isArray(update.value) ? update.value.join(', ') : update.value}`
      case 'remove':
        return `Remove tags: ${Array.isArray(update.value) ? update.value.join(', ') : update.value}`
      default:
        return update.operation || 'Set value'
    }
  }, [])

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Preview of changes that will be applied to {selectedItemsCount} products:
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        {enabledUpdates.map((update) => {
          const field = PRODUCT_FIELDS.find(f => f.key === update.field)
          return (
            <div key={update.field} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">{field?.label}</span>
              </div>
              <div className="text-sm text-gray-600">
                {getOperationDescription(update)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})