import React, { useState } from 'react'
import { Button } from './button'
import { Badge } from './badge'
import { 
  Undo2, 
  Redo2, 
  History, 
  ChevronDown, 
  ChevronUp,
  Clock,
  X
} from 'lucide-react'
import { UndoRedoState } from '../../utils/undoRedoManager'

interface UndoRedoPanelProps {
  state: UndoRedoState
  onUndo: () => Promise<boolean>
  onRedo: () => Promise<boolean>
  onJumpTo?: (index: number) => Promise<boolean>
  onClear?: () => void
  className?: string
  showHistory?: boolean
}

export const UndoRedoPanel: React.FC<UndoRedoPanelProps> = ({
  state,
  onUndo,
  onRedo,
  onJumpTo,
  onClear,
  className = '',
  showHistory = false
}) => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUndo = async () => {
    if (isProcessing || !state.canUndo) return
    
    setIsProcessing(true)
    try {
      await onUndo()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRedo = async () => {
    if (isProcessing || !state.canRedo) return
    
    setIsProcessing(true)
    try {
      await onRedo()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleJumpTo = async (index: number) => {
    if (isProcessing || !onJumpTo) return
    
    setIsProcessing(true)
    try {
      await onJumpTo(index)
    } finally {
      setIsProcessing(false)
    }
  }

  const historySummary = state.history.map((action, index) => ({
    index,
    description: action.description,
    timestamp: action.timestamp.toLocaleTimeString(),
    isCurrent: index === state.currentIndex,
    canUndo: action.canUndo,
    canRedo: action.canRedo
  }))

  if (state.history.length === 0) {
    return null
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={handleUndo}
            disabled={!state.canUndo || isProcessing}
            title="Undo last action"
          >
            <Undo2 className="h-3 w-3 mr-1" />
            Undo
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={handleRedo}
            disabled={!state.canRedo || isProcessing}
            title="Redo next action"
          >
            <Redo2 className="h-3 w-3 mr-1" />
            Redo
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Badge variant="secondary" className="text-xs">
            {state.history.length} action{state.history.length !== 1 ? 's' : ''}
          </Badge>
          
          {showHistory && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
            >
              <History className="h-3 w-3 mr-1" />
              History
              {isHistoryExpanded ? (
                <ChevronUp className="h-3 w-3 ml-1" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </Button>
          )}

          {onClear && state.history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              onClick={onClear}
              title="Clear history"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* History Panel */}
      {showHistory && isHistoryExpanded && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">Action History</h4>
              <span className="text-xs text-gray-500">
                {state.currentIndex + 1} of {state.history.length}
              </span>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {historySummary.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No actions in history
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {historySummary.map((item, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-between p-2 rounded text-sm cursor-pointer transition-colors
                      ${item.isCurrent 
                        ? 'bg-blue-50 border border-blue-200 text-blue-900' 
                        : index <= state.currentIndex
                          ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          : 'bg-white text-gray-400 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleJumpTo(index)}
                    title={`Jump to: ${item.description}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`
                        w-2 h-2 rounded-full flex-shrink-0
                        ${item.isCurrent 
                          ? 'bg-blue-500' 
                          : index <= state.currentIndex
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }
                      `} />
                      
                      <span className="truncate font-medium">
                        {item.description}
                      </span>
                      
                      {item.isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {state.history.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                  Click any action to jump to that point in history
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Applied</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span>Undone</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Current</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UndoRedoPanel