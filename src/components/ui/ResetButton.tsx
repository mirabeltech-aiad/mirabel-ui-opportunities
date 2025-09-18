import React from 'react'
import { Button } from './button'
import { Badge } from './badge'
import { RotateCcw } from 'lucide-react'
import { cn } from '../shared/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip'
import { getTooltip } from '../shared/constants/tooltips'

interface ResetButtonProps {
  onReset: () => void
  hasActiveItems: boolean
  itemType: 'filters' | 'columns' | 'selection' | 'sorting'
  variant?: 'primary' | 'secondary' | 'minimal'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showCount?: boolean
  activeCount?: number
  className?: string
  disabled?: boolean
  iconOnly?: boolean
}

export const ResetButton: React.FC<ResetButtonProps> = ({
  onReset,
  hasActiveItems,
  itemType,
  variant = 'secondary',
  size = 'sm',
  showCount = false,
  activeCount = 0,
  className,
  disabled = false,
  iconOnly = false
}) => {
  // Generate appropriate labels based on item type
  const getLabels = () => {
    const labels = {
      filters: { single: 'Reset Filters', plural: 'Reset Filters', short: 'Reset' },
      columns: { single: 'Reset Columns', plural: 'Reset Columns', short: 'Reset' },
      selection: { single: 'Clear Selection', plural: 'Clear Selection', short: 'Clear' },
      sorting: { single: 'Clear Sorting', plural: 'Clear Sorting', short: 'Clear' }
    }
    return labels[itemType]
  }

  // Generate tooltip text
  const getTooltipText = () => {
    if (!hasActiveItems) {
      return `No active ${itemType} to reset`
    }

    const count = showCount && activeCount > 0 ? activeCount : ''
    const itemLabel = itemType === 'selection' ? 'selected items' : itemType

    if (count) {
      return `Reset ${count} ${itemLabel}`
    }

    return `Reset all ${itemLabel}`
  }

  // Generate button styling based on variant and state
  const getButtonStyles = () => {
    const baseStyles = 'transition-all duration-200'

    if (!hasActiveItems) {
      return cn(
        baseStyles,
        'text-gray-400 border-gray-200 cursor-not-allowed opacity-50',
        'hover:text-gray-400 hover:border-gray-200 hover:bg-transparent'
      )
    }

    switch (variant) {
      case 'primary':
        return cn(
          baseStyles,
          'text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300',
          'focus:ring-2 focus:ring-red-200 focus:ring-opacity-50'
        )

      case 'minimal':
        return cn(
          baseStyles,
          'text-gray-600 hover:text-red-600 hover:bg-red-50 border-transparent hover:border-red-200',
          'focus:ring-2 focus:ring-red-200 focus:ring-opacity-50'
        )

      case 'secondary':
      default:
        return cn(
          baseStyles,
          'text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300',
          'focus:ring-2 focus:ring-red-200 focus:ring-opacity-50'
        )
    }
  }

  // Get button size styles
  const getSizeStyles = () => {
    if (iconOnly) {
      switch (size) {
        case 'sm':
          return 'h-7 w-7 p-0'
        case 'lg':
          return 'h-10 w-10 p-0'
        case 'icon':
          return 'h-8 w-8 p-0'
        case 'default':
        default:
          return 'h-9 w-9 p-0'
      }
    }

    switch (size) {
      case 'sm':
        return 'h-8 px-2 text-xs'
      case 'lg':
        return 'h-11 px-4'
      case 'icon':
        return 'h-10 px-3'
      case 'default':
      default:
        return 'h-10 px-4'
    }
  }

  // Get icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3'
      case 'lg':
        return 'h-5 w-5'
      case 'icon':
        return 'h-4 w-4'
      case 'default':
      default:
        return 'h-4 w-4'
    }
  }

  const labels = getLabels()
  const displayCount = showCount && activeCount > 0 ? activeCount : null
  const isDisabled = disabled || !hasActiveItems

  const tooltipKey = hasActiveItems
    ? `RESET_BUTTON.${itemType.toUpperCase()}`
    : 'RESET_BUTTON.DISABLED'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={cn(
              getSizeStyles(),
              getButtonStyles(),
              className
            )}
            onClick={hasActiveItems ? onReset : undefined}
            disabled={isDisabled}
            aria-label={getTooltipText()}
          >
            <RotateCcw className={cn(getIconSize(), iconOnly ? '' : 'mr-1')} />

            {/* Show label only if not icon-only mode */}
            {!iconOnly && (
              <span className="font-medium">
                {labels.short}
                {displayCount && (
                  <>
                    {' '}
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-red-100 text-red-800 text-xs h-5 min-w-[20px] px-1.5 rounded-full"
                    >
                      {displayCount}
                    </Badge>
                  </>
                )}
                {hasActiveItems && !displayCount && ' ✓'}
                {!hasActiveItems && ' (0)'}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltip(tooltipKey) || getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Convenience components for specific use cases
export const FilterResetButton: React.FC<Omit<ResetButtonProps, 'itemType'>> = (props) => (
  <ResetButton {...props} itemType="filters" />
)

export const ColumnResetButton: React.FC<Omit<ResetButtonProps, 'itemType'>> = (props) => (
  <ResetButton {...props} itemType="columns" />
)

export const SelectionResetButton: React.FC<Omit<ResetButtonProps, 'itemType'>> = (props) => (
  <ResetButton {...props} itemType="selection" />
)

export const SortingResetButton: React.FC<Omit<ResetButtonProps, 'itemType'>> = (props) => (
  <ResetButton {...props} itemType="sorting" />
)

// Compact icon-only variants
export const CompactFilterResetButton: React.FC<Omit<ResetButtonProps, 'itemType' | 'iconOnly'>> = (props) => (
  <ResetButton {...props} itemType="filters" iconOnly={true} size="sm" />
)

export const CompactColumnResetButton: React.FC<Omit<ResetButtonProps, 'itemType' | 'iconOnly'>> = (props) => (
  <ResetButton {...props} itemType="columns" iconOnly={true} size="sm" />
)

export const CompactSelectionResetButton: React.FC<Omit<ResetButtonProps, 'itemType' | 'iconOnly'>> = (props) => (
  <ResetButton {...props} itemType="selection" iconOnly={true} size="sm" />
)

export const CompactSortingResetButton: React.FC<Omit<ResetButtonProps, 'itemType' | 'iconOnly'>> = (props) => (
  <ResetButton {...props} itemType="sorting" iconOnly={true} size="sm" />
)