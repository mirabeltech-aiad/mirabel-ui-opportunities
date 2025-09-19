import React from 'react'
import { SimpleMultiSelect } from './SimpleMultiSelect'

interface SafeMultiSelectProps {
  placeholder: string
  value: string[]
  options: { value: string; label: string }[]
  onChange: (values: string[]) => void
  className?: string
  disabled?: boolean
  // Migration helpers
  fallbackComponent?: React.ComponentType<any>
  useFallback?: boolean
  onError?: (error: Error) => void
}

/**
 * SafeMultiSelect - Migration helper component
 * 
 * This component provides a safe way to migrate to SimpleMultiSelect
 * with fallback support and error handling.
 */
export const SafeMultiSelect: React.FC<SafeMultiSelectProps> = ({
  placeholder,
  value,
  options,
  onChange,
  className,
  disabled,
  fallbackComponent: FallbackComponent,
  useFallback = false,
  onError
}) => {
  const [hasError, setHasError] = React.useState(false)

  // Error boundary for the new component
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('SafeMultiSelect error:', error)
      setHasError(true)
      onError?.(new Error(error.message))
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [onError])

  // Use fallback if explicitly requested or if error occurred
  if (useFallback || hasError) {
    if (FallbackComponent) {
      return (
        <FallbackComponent
          placeholder={placeholder}
          value={value}
          options={options}
          onChange={onChange}
          className={className}
          disabled={disabled}
        />
      )
    }
    
    // Default fallback to native select (not ideal but safe)
    return (
      <select
        multiple
        value={value}
        onChange={(e) => {
          const selectedValues = Array.from(e.target.selectedOptions, option => option.value)
          onChange(selectedValues)
        }}
        className={`w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-ocean-500 focus:outline-none bg-white ${className || ''}`}
        disabled={disabled}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  // Use the new SimpleMultiSelect component
  try {
    return (
      <SimpleMultiSelect
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        options={options}
        className={className}
        disabled={disabled}
      />
    )
  } catch (error) {
    console.error('SimpleMultiSelect error:', error)
    setHasError(true)
    onError?.(error as Error)
    
    // Return fallback on error
    return (
      <div className="text-red-600 text-sm p-2 border border-red-300 rounded">
        Multi-select component error. Please refresh the page.
      </div>
    )
  }
}

// Migration utilities
export const createMigrationConfig = (pageName: string) => {
  const storageKey = `multiselect-migration-${pageName}`
  
  return {
    // Check if new component should be used for this page
    shouldUseNew: () => {
      if (import.meta.env.DEV) {
        return localStorage.getItem(storageKey) !== 'false'
      }
      return localStorage.getItem(storageKey) === 'true'
    },
    
    // Enable new component for this page
    enableNew: () => {
      localStorage.setItem(storageKey, 'true')
      window.location.reload()
    },
    
    // Disable new component for this page (rollback)
    disableNew: () => {
      localStorage.setItem(storageKey, 'false')
      window.location.reload()
    },
    
    // Get current status
    getStatus: () => {
      const value = localStorage.getItem(storageKey)
      if (value === 'true') return 'enabled'
      if (value === 'false') return 'disabled'
      return 'default'
    }
  }
}

// Development helper component
export const MigrationControls: React.FC<{ pageName: string }> = ({ pageName }) => {
  const config = createMigrationConfig(pageName)
  const status = config.getStatus()
  
  if (!import.meta.env.DEV) {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-50">
      <div className="text-xs font-medium text-gray-700 mb-2">
        Multi-Select Migration: {pageName}
      </div>
      <div className="text-xs text-gray-600 mb-2">
        Status: <span className={`font-medium ${
          status === 'enabled' ? 'text-green-600' : 
          status === 'disabled' ? 'text-red-600' : 
          'text-gray-600'
        }`}>{status}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={config.enableNew}
          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
        >
          Enable New
        </button>
        <button
          onClick={config.disableNew}
          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
        >
          Rollback
        </button>
      </div>
    </div>
  )
}