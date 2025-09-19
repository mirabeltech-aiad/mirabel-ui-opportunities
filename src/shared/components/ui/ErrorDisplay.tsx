import React from 'react'
import { Button } from './button'
import { AlertTriangle, RefreshCw, Wifi, Server, Search, Filter } from 'lucide-react'

export type ErrorType = 'network' | 'server' | 'validation' | 'not-found' | 'permission' | 'filter' | 'search' | 'generic'

interface ErrorDisplayProps {
  type?: ErrorType
  title?: string
  message: string
  onRetry?: () => void
  onClear?: () => void
  onReset?: () => void
  retryLabel?: string
  clearLabel?: string
  resetLabel?: string
  showRetry?: boolean
  showClear?: boolean
  showReset?: boolean
  className?: string
}

const errorConfig = {
  network: {
    icon: Wifi,
    title: 'Connection Error',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    defaultMessage: 'Unable to connect to the server. Please check your internet connection.'
  },
  server: {
    icon: Server,
    title: 'Server Error',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    defaultMessage: 'The server encountered an error. Please try again later.'
  },
  validation: {
    icon: AlertTriangle,
    title: 'Validation Error',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    defaultMessage: 'The provided data is invalid. Please check your input.'
  },
  'not-found': {
    icon: Search,
    title: 'Not Found',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    defaultMessage: 'The requested resource could not be found.'
  },
  permission: {
    icon: AlertTriangle,
    title: 'Permission Denied',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    defaultMessage: 'You do not have permission to perform this action.'
  },
  filter: {
    icon: Filter,
    title: 'Filter Error',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    defaultMessage: 'Unable to apply filters. Please try adjusting your criteria.'
  },
  search: {
    icon: Search,
    title: 'Search Error',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    defaultMessage: 'Search failed. Please try a different search term.'
  },
  generic: {
    icon: AlertTriangle,
    title: 'Error',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    defaultMessage: 'An unexpected error occurred.'
  }
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  type = 'generic',
  title,
  message,
  onRetry,
  onClear,
  onReset,
  retryLabel = 'Try Again',
  clearLabel = 'Clear Error',
  resetLabel = 'Reset',
  showRetry = true,
  showClear = false,
  showReset = false,
  className = ''
}) => {
  const config = errorConfig[type]
  const Icon = config.icon
  const displayTitle = title || config.title
  const displayMessage = message || config.defaultMessage

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${config.color}`}>
            {displayTitle}
          </h3>
          <div className={`mt-2 text-sm ${config.color.replace('600', '700')}`}>
            <p>{displayMessage}</p>
          </div>
          
          {(showRetry || showClear || showReset) && (
            <div className="mt-4 flex gap-2">
              {showRetry && onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className={`${config.color} ${config.borderColor} hover:${config.bgColor}`}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {retryLabel}
                </Button>
              )}
              
              {showClear && onClear && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClear}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  {clearLabel}
                </Button>
              )}
              
              {showReset && onReset && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  {resetLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Specific error components for common scenarios
export const NetworkError: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay type="network" {...props} />
)

export const ServerError: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay type="server" {...props} />
)

export const ValidationError: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay type="validation" {...props} />
)

export const NotFoundError: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay type="not-found" {...props} />
)

export const PermissionError: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay type="permission" {...props} />
)

export const FilterError: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay type="filter" {...props} />
)

export const SearchError: React.FC<Omit<ErrorDisplayProps, 'type'>> = (props) => (
  <ErrorDisplay type="search" {...props} />
)

export default ErrorDisplay