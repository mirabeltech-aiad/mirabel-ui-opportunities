import React from 'react'
import { Progress } from '../../progress'
import { BulkUpdateExecutionState } from '../types'

interface ProgressTabProps {
  executionState: BulkUpdateExecutionState
}

/**
 * Progress tab component showing execution progress and results
 */
export const ProgressTab: React.FC<ProgressTabProps> = ({
  executionState
}) => {
  const { isProcessing, progress, currentOperation, results, showResults } = executionState

  return (
    <div className="space-y-4">
      {isProcessing && (
        <>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          
          {currentOperation && (
            <div className="text-sm text-gray-600">
              {currentOperation}
            </div>
          )}
        </>
      )}

      {showResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="text-sm font-medium text-green-800">Successful</div>
              <div className="text-2xl font-bold text-green-600">{results.successful}</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-sm font-medium text-red-800">Failed</div>
              <div className="text-2xl font-bold text-red-600">{results.failed}</div>
            </div>
          </div>

          {results.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-red-800 mb-2">Errors:</h4>
              <ul className="text-xs text-red-700 space-y-1">
                {results.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}