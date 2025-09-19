import React from 'react'
import { Button } from './button'
import { Badge } from './badge'
import { Progress } from './progress'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Loader2,
  X,
  Undo2
} from 'lucide-react'
import { BulkOperationResult, formatOperationForDisplay } from '../../utils/bulkOperations'

interface BulkOperationFeedbackProps {
  result?: BulkOperationResult
  isProcessing?: boolean
  progress?: number
  onDismiss?: () => void
  onUndo?: () => void
  className?: string
}

export const BulkOperationFeedback: React.FC<BulkOperationFeedbackProps> = ({
  result,
  isProcessing = false,
  progress = 0,
  onDismiss,
  onUndo,
  className = ''
}) => {
  if (!result && !isProcessing) return null

  const getStatusIcon = () => {
    if (isProcessing) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
    }
    
    if (!result) return null

    if (result.success) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = () => {
    if (isProcessing) return 'blue'
    if (!result) return 'gray'
    return result.success ? 'green' : 'red'
  }

  const statusColor = getStatusColor()

  return (
    <div className={`
      p-3 rounded-lg border transition-all duration-200
      ${statusColor === 'blue' ? 'bg-blue-50 border-blue-200' : ''}
      ${statusColor === 'green' ? 'bg-green-50 border-green-200' : ''}
      ${statusColor === 'red' ? 'bg-red-50 border-red-200' : ''}
      ${className}
    `}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          {isProcessing ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  Processing bulk operation...
                </span>
                <span className="text-xs text-blue-700">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {formatOperationForDisplay(result.operation).title}
                </span>
                <div className="flex items-center gap-1">
                  {result.success && onUndo && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={onUndo}
                      title="Undo operation"
                    >
                      <Undo2 className="h-3 w-3" />
                    </Button>
                  )}
                  {onDismiss && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={onDismiss}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Operation Details */}
              <div className="space-y-1">
                {result.affectedColumns.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary" className="text-xs">
                      {result.affectedColumns.length} affected
                    </Badge>
                    <span className={`${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.affectedColumns.length <= 3 
                        ? result.affectedColumns.join(', ')
                        : `${result.affectedColumns.slice(0, 3).join(', ')} and ${result.affectedColumns.length - 3} more`
                      }
                    </span>
                  </div>
                )}

                {result.skippedColumns.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                      {result.skippedColumns.length} skipped
                    </Badge>
                    <span className="text-yellow-700">
                      {result.skippedColumns.length <= 3 
                        ? result.skippedColumns.join(', ')
                        : `${result.skippedColumns.slice(0, 3).join(', ')} and ${result.skippedColumns.length - 3} more`
                      }
                    </span>
                  </div>
                )}

                {result.errors.length > 0 && (
                  <div className="space-y-1">
                    {result.errors.slice(0, 3).map((error, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-red-700">{error}</span>
                      </div>
                    ))}
                    {result.errors.length > 3 && (
                      <div className="text-xs text-red-600">
                        And {result.errors.length - 3} more errors...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Operation Metadata */}
              {result.operation.metadata && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{formatOperationForDisplay(result.operation).timestamp}</span>
                  {result.operation.metadata.category && (
                    <Badge variant="outline" className="text-xs">
                      {result.operation.metadata.category}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BulkOperationFeedback