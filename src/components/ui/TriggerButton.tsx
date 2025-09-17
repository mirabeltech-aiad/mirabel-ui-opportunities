import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

interface TriggerButtonProps {
  isOpen: boolean
  hasActiveState?: boolean
  activeCount?: number
  icon?: React.ReactNode
  label: string
  placeholder?: string
  onClick: () => void
  className?: string
  disabled?: boolean
  error?: boolean
}

export const TriggerButton: React.FC<TriggerButtonProps> = ({
  isOpen,
  hasActiveState = false,
  activeCount = 0,
  icon,
  label,
  placeholder,
  onClick,
  className = '',
  disabled = false,
  error = false
}) => {
  const displayText = hasActiveState && activeCount > 0 ? label : (placeholder || label)
  
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "h-10 px-3 flex items-center justify-between gap-2 transition-all duration-200 relative w-full text-left rounded-md border",
        // Base states
        "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
        // Active state
        hasActiveState && "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm",
        // Open state
        isOpen && "ring-2 ring-blue-300 ring-opacity-50",
        // Error state
        error && "border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
        // Disabled state
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {icon && (
          <span className={cn(
            "flex-shrink-0",
            hasActiveState ? 'text-blue-600' : 'text-gray-500',
            error && 'text-red-500'
          )}>
            {icon}
          </span>
        )}
        <span className={cn(
          "text-sm font-medium truncate",
          !hasActiveState && !error && "text-gray-500"
        )}>
          {displayText}
        </span>
      </div>
      
      <div className="flex items-center gap-1 flex-shrink-0">
        {hasActiveState && activeCount > 0 && (
          <span className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180",
            hasActiveState ? 'text-blue-600' : 'text-gray-400',
            error && 'text-red-500'
          )} 
        />
      </div>
    </button>
  )
}